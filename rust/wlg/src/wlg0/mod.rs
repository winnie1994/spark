use serde::{Deserialize, Serialize};
use std::io::{Read, Write};

use anyhow::anyhow;

mod decode;
mod encode;

#[derive(Debug, Default, Clone)]
pub struct Wlg0Gaussian {
    pub center: [f32; 3],
    pub ln_scale: [f32; 3],
    pub quaternion: [f32; 4],
    pub opacity: f32,
    pub color: [f32; 3],
}

pub const LN_SCALE_MIN: f32 = -9.0;
pub const LN_SCALE_MAX: f32 = 9.0;
pub const LN_RESCALE: f32 = (LN_SCALE_MAX - LN_SCALE_MIN) / 254.0; // 1..=255

pub fn encode_scale(scale: f32) -> u8 {
    if scale == 0.0 {
        0
    } else {
        // Allow scales below LN_SCALE_MIN to be encoded as 0, which signifies a 2DGS
        ((scale.ln() - LN_SCALE_MIN) / LN_RESCALE + 1.0).clamp(0.0, 255.0).round() as u8
    }
}

pub fn decode_scale(scale: u8) -> f32 {
    if scale == 0 {
        0.0
    } else {
        (LN_SCALE_MIN + (scale - 1) as f32 * LN_RESCALE).exp()
    }
}

pub struct PackedSplats(pub Vec<u32>);

#[derive(Debug, Serialize, Deserialize)]
struct Wlg0Signature {
    magic: [u8; 4], // "WLG0"
    version: u32,   // 1 or 2
}

impl Wlg0Signature {
    const MAGIC: [u8; 4] = *b"WLG0";

    fn new(version: u32) -> Self {
        Self {
            magic: Self::MAGIC,
            version,
        }
    }

    fn check_version(&self) -> Option<u32> {
        if self.magic == Self::MAGIC {
            Some(self.version)
        } else {
            None
        }
    }

    fn write<W: Write>(&self, writer: &mut W) -> std::io::Result<()> {
        writer.write_all(&bincode::serialize(self).unwrap())
    }

    fn read<R: Read>(reader: &mut R) -> std::io::Result<Self> {
        let mut buf = [0; std::mem::size_of::<Self>()];
        reader.read_exact(&mut buf)?;
        Ok(bincode::deserialize(&buf).unwrap())
    }
}

#[derive(Debug, Clone)]
pub struct Wlg0Settings {
    pub version: u32,
    pub enable_compression: bool,
    pub enable_first_differences: bool,
    pub enable_morton_reordering: bool,
    pub enable_hilbert_reordering: bool,
    pub enable_split_center_bytes: bool,
    pub enable_obfuscation: bool,
    pub enable_split_dims: bool,
    pub enable_24bit_center: bool,
    pub zstd_compression_level: i32, // 0 selects default level (3), max is 22
}

const WLG012_SETTINGS: [Wlg0Settings; 3] = [
    // 0: WLGv0: Not a valid version, for testing purposes only
    Wlg0Settings {
        version: 0,
        enable_compression: true,
        enable_first_differences: true,
        enable_morton_reordering: false,
        enable_hilbert_reordering: true,
        enable_split_center_bytes: true,
        enable_obfuscation: true,
        enable_split_dims: true,
        enable_24bit_center: true,
        zstd_compression_level: 0,
    },
    // 1: WLGv1: Default settings for WLG v1 files
    Wlg0Settings {
        version: 1,
        enable_compression: true,
        enable_first_differences: true,
        enable_morton_reordering: true,
        enable_hilbert_reordering: false,
        enable_split_center_bytes: true,
        enable_obfuscation: true,
        enable_split_dims: true,
        enable_24bit_center: false,
        zstd_compression_level: 0,
    },
    // 2: WLGv2: Default settings for WLG v2 files
    Wlg0Settings {
        version: 2,
        enable_compression: true,
        enable_first_differences: true,
        enable_morton_reordering: true,
        enable_hilbert_reordering: false,
        enable_split_center_bytes: true,
        enable_obfuscation: true,
        enable_split_dims: true,
        enable_24bit_center: true,
        zstd_compression_level: 0,
    },
];

#[derive(Debug, Serialize, Deserialize)]
pub struct Wlg0Header {
    // center[d] = center_int[d] * center_scale + center_offset
    pub center_scale: f32,
    pub center_offset: [f32; 3],
    // scale[d] = exp(scale_int[d] / 255 * (scale_max - scale_min) + scale_min)
    pub ln_scale_min: f32,
    pub ln_scale_max: f32,
    // Total # splats, regardless of SH order
    pub num_splats: u32,
    // 0 for "no spherical harmonics"
    pub max_sh_order: u32,
    // Supports maximum of SH=3
    pub num_sh_splats: [u32; 4],
}

impl Wlg0Header {
    pub fn write<W: Write>(&self, writer: &mut W) -> std::io::Result<()> {
        writer.write_all(&bincode::serialize(self).unwrap())
    }

    pub fn read<R: Read>(reader: &mut R) -> std::io::Result<Self> {
        let mut buf = [0; std::mem::size_of::<Self>()];
        reader.read_exact(&mut buf)?;
        Ok(bincode::deserialize(&buf).unwrap())
    }
}

fn obfuscate(data: &mut [u8]) {
    let mut prev: u8 = 0;
    let mut state: u32 = 0x1AB51AB5;
    for byte in data {
        state = state.wrapping_mul(1664525).wrapping_add(1013904223);
        let rand_byte = (state >> 8) as u8;
        let obf_byte = (*byte ^ prev).rotate_left(3) ^ rand_byte;
        prev = obf_byte;
        *byte = obf_byte;
    }
}

fn deobfuscate(data: &mut [u8]) {
    let mut prev: u8 = 0;
    let mut state: u32 = 0x1AB51AB5;
    for obf_byte in data {
        state = state.wrapping_mul(1664525).wrapping_add(1013904223);
        let rand_byte = (state >> 8) as u8;
        let tmp = (*obf_byte ^ rand_byte).rotate_right(3);
        let byte = tmp ^ prev;
        prev = *obf_byte;
        *obf_byte = byte;
    }
}

fn compress_data(data: &[u8], _zstd_compression_level: i32) -> anyhow::Result<Vec<u8>> {
    use ruzstd::encoding::{compress_to_vec, CompressionLevel};
    let compressed_data = compress_to_vec(data, CompressionLevel::Fastest);
    Ok(compressed_data)
}

fn decompress_data(data: &[u8]) -> anyhow::Result<Vec<u8>> {
    let mut decoder = ruzstd::decoding::StreamingDecoder::new(data)?;
    let mut decompressed_data = Vec::new();
    decoder.read_to_end(&mut decompressed_data)?;
    Ok(decompressed_data)
}

fn first_differences(data: &mut [u8]) {
    // Compute first differences for array to aid compression
    for i in (1..data.len()).rev() {
        data[i] = data[i].wrapping_sub(data[i - 1]);
    }
}

fn first_cumulative(data: &mut [u8]) {
    // Invert first differences
    for i in 1..data.len() {
        data[i] = data[i].wrapping_add(data[i - 1]);
    }
}

pub fn decode12(bytes: &mut [u8]) -> anyhow::Result<(Wlg0Settings, Vec<Wlg0Gaussian>)> {
    let (offset, version) = {
        let mut reader = std::io::Cursor::new(&bytes);
        let signature = Wlg0Signature::read(&mut reader)?;
        let Some(version) = signature.check_version() else {
            return Err(anyhow!("Invalid WLG signature"));
        };
        if (version != 1) && (version != 2) {
            return Err(anyhow!("Unsupported WLG version"));
        }
        let offset = reader.position() as usize;
        (offset, version)
    };

    let settings = WLG012_SETTINGS[version as usize].clone();
    let mut gaussians = Vec::new();
    decode::decode_internal(&mut bytes[offset..], &settings, &mut gaussians)?;
    Ok((settings, gaussians))
}

pub fn decode12_packed(bytes: &mut [u8]) -> anyhow::Result<(Wlg0Settings, PackedSplats)> {
    let (offset, version) = {
        let mut reader = std::io::Cursor::new(&bytes);
        let signature = Wlg0Signature::read(&mut reader)?;
        let Some(version) = signature.check_version() else {
            return Err(anyhow!("Invalid WLG signature"));
        };
        if (version != 1) && (version != 2) {
            return Err(anyhow!("Unsupported WLG version"));
        }
        let offset = reader.position() as usize;
        (offset, version)
    };

    let settings = WLG012_SETTINGS[version as usize].clone();
    let mut packed_splats = PackedSplats(Vec::new());
    decode::decode_internal(&mut bytes[offset..], &settings, &mut packed_splats)?;
    Ok((settings, packed_splats))
}

pub enum Wlg0EncodeSettings {
    Wlg1,
    Wlg2,
    Custom(Wlg0Settings),
}

pub fn encode12(
    settings: &Wlg0EncodeSettings,
    gaussians: &[Wlg0Gaussian],
) -> anyhow::Result<(Wlg0Settings, Vec<u8>)> {
    let settings = match settings {
        Wlg0EncodeSettings::Wlg1 => &WLG012_SETTINGS[1],
        Wlg0EncodeSettings::Wlg2 => &WLG012_SETTINGS[2],
        Wlg0EncodeSettings::Custom(custom) => custom,
    }
    .clone();
    let payload = encode::encode_internal(&settings, gaussians)?;

    let mut buffer = Vec::new();
    Wlg0Signature::new(settings.version).write(&mut buffer)?;
    buffer.write_all(&payload)?;
    Ok((settings, buffer))
}
