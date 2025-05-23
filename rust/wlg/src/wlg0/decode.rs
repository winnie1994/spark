use anyhow::anyhow;
use std::io::Read;
use half::f16;

use super::{
    decompress_data, deobfuscate, encode_scale, first_cumulative,
    PackedSplats, Wlg0Gaussian, Wlg0Header, Wlg0Settings,
};

pub(super) trait Wlg0Decoder {
    fn init_num_splats(&mut self, num_splats: usize);
    fn write_center(&mut self, index: usize, dim: usize, value: f32);
    fn write_scale(&mut self, index: usize, dim: usize, value: f32);
    fn write_quaternion_f32(&mut self, index: usize, dim: usize, value: f32);
    fn write_quaternion_i8(&mut self, index: usize, dim: usize, value: i8);
    fn write_quaternion_full_f32(&mut self, index: usize, value: [f32; 4]);
    fn write_rgba(&mut self, index: usize, dim: usize, value: u8);
}

impl Wlg0Decoder for Vec<Wlg0Gaussian> {
    fn init_num_splats(&mut self, num_splats: usize) {
        self.resize(num_splats, Wlg0Gaussian::default());
    }

    fn write_center(&mut self, index: usize, dim: usize, value: f32) {
        self[index].center[dim] = value;
    }
    
    fn write_scale(&mut self, index: usize, dim: usize, value: f32) {
        self[index].ln_scale[dim] = value.ln();
    }
    
    fn write_quaternion_f32(&mut self, index: usize, dim: usize, value: f32) {
        self[index].quaternion[dim] = value;
    }
    
    fn write_quaternion_i8(&mut self, _index: usize, _dim: usize, _value: i8) {
        // No-op sing we use the f32 variant
    }

    fn write_quaternion_full_f32(&mut self, _index: usize, _value: [f32; 4]) {
        // No-op
    }

    fn write_rgba(&mut self, index: usize, dim: usize, value: u8) {
        self[index].color[dim] = value as f32 / 255.0;
    }
}

impl Wlg0Decoder for PackedSplats {
    fn init_num_splats(&mut self, num_splats: usize) {
        self.0.resize(num_splats * 4, 0);
    }
    
    fn write_center(&mut self, index: usize, dim: usize, value: f32) {
        match dim {
            0 => { self.0[index * 4 + 1] |= f16::from_f32(value).to_bits() as u32; },
            1 => { self.0[index * 4 + 1] |= (f16::from_f32(value).to_bits() as u32) << 16; },
            2 => { self.0[index * 4 + 2] |= f16::from_f32(value).to_bits() as u32; },
            _ => unreachable!(),
        }
    }
    
    fn write_scale(&mut self, index: usize, dim: usize, value: f32) {
        let scale8 = encode_scale(value);
        match dim {
            0 => { self.0[index * 4 + 3] |= scale8 as u32; },
            1 => { self.0[index * 4 + 3] |= (scale8 as u32) << 8; },
            2 => { self.0[index * 4 + 3] |= (scale8 as u32) << 16; },
            _ => unreachable!(),
        }
    }
    
    fn write_quaternion_f32(&mut self, _index: usize, _dim: usize, _value: f32) {
        // No-op since we use the i8 variant
    }

    fn write_quaternion_i8(&mut self, _index: usize, _dim: usize, _value: i8) {
        // Old Qxyz encoding:
        // match dim {
        //     0 => { self.0[index * 4 + 2] |= ((value as u32) & 0xff) << 16; },
        //     1 => { self.0[index * 4 + 2] |= ((value as u32) & 0xff) << 24; },
        //     2 => { self.0[index * 4 + 3] |= ((value as u32) & 0xff) << 24; },
        //     3 => {
        //         // Quaternion w is inferred from xyz in PackedSplats
        //     },
        //     _ => unreachable!(),
        // }
    }

    fn write_quaternion_full_f32(&mut self, index: usize, value: [f32; 4]) {
        // Encode as OctXy88R8
        let q = if value[3] < 0.0 { value.map(|v| -v) } else { value };
        let theta = 2.0 * q[3].acos();

        let xyz_norm = (q[0] * q[0] + q[1] * q[1] + q[2] * q[2]).sqrt();
        let axis = if xyz_norm < 1e-6 {
            [1.0, 0.0, 0.0]
        } else {
            [q[0] / xyz_norm, q[1] / xyz_norm, q[2] / xyz_norm]
        };

        let sum = axis[0].abs() + axis[1].abs() + axis[2].abs();
        let p = [axis[0] / sum, axis[1] / sum];
        let p = if axis[2] >= 0.0 { p } else {
            [
                (1.0 - p[1].abs()) * p[0].signum(),
                (1.0 - p[0].abs()) * p[1].signum(),
            ]
        };
        let uv = [
            ((p[0] * 0.5 + 0.5) * 255.0).round() as u8,
            ((p[1] * 0.5 + 0.5) * 255.0).round() as u8,
        ];

        let angle = (theta * (255.0 / 3.14159265359)).round().clamp(0.0, 255.0) as u8;
        self.0[index * 4 + 2] |= (uv[0] as u32) << 16;
        self.0[index * 4 + 2] |= (uv[1] as u32) << 24;
        self.0[index * 4 + 3] |= (angle as u32) << 24;
    }

    fn write_rgba(&mut self, index: usize, dim: usize, value: u8) {
        match dim {
            0 => { self.0[index * 4] |= value as u32; },
            1 => { self.0[index * 4] |= (value as u32) << 8; },
            2 => { self.0[index * 4] |= (value as u32) << 16; },
            3 => { self.0[index * 4] |= (value as u32) << 24; },
            _ => unreachable!(),
        }
    }
}

pub(super) fn decode_internal<D: Wlg0Decoder>(
    data: &mut [u8],
    settings: &Wlg0Settings,
    decoder: &mut D,
) -> anyhow::Result<()> {
    if settings.enable_obfuscation {
        deobfuscate(data);
    }

    let data = if settings.enable_compression {
        decompress_data(data)?
    } else {
        data.to_vec()
    };

    let mut reader = std::io::Cursor::new(&data);
    let header = Wlg0Header::read(&mut reader)?;

    let num_splats = header.num_splats as usize;
    decoder.init_num_splats(num_splats);
    if !settings.enable_split_dims {
        return Err(anyhow!("Unsupported WLG !settings.enable_split_dims"));
    }

    let mut data_u8: Vec<u8> = vec![0; num_splats];

    if settings.enable_split_center_bytes {
        let mut data_u32: Vec<u32> = vec![0; num_splats];
        for d in 0..3 {
            data_u32.iter_mut().for_each(|v| *v = 0);

            if settings.enable_24bit_center {
                reader.read_exact(&mut data_u8)?;
                if settings.enable_first_differences {
                    first_cumulative(&mut data_u8);
                }
                for (i, &byte) in data_u8.iter().enumerate() {
                    data_u32[i] = (byte as u32) << 16;
                }
            }
            reader.read_exact(&mut data_u8)?;
            if settings.enable_first_differences {
                first_cumulative(&mut data_u8);
            }
            for (i, &byte) in data_u8.iter().enumerate() {
                data_u32[i] |= (byte as u32) << 8;
            }
            reader.read_exact(&mut data_u8)?;
            if settings.enable_first_differences {
                first_cumulative(&mut data_u8);
            }
            for (i, &byte) in data_u8.iter().enumerate() {
                data_u32[i] |= byte as u32;
            }

            let resolution = if settings.enable_24bit_center {
                16777215.0
            } else {
                65535.0
            };
            let scale = header.center_scale / resolution;
            let offset = header.center_offset[d];
            for (i, &value) in data_u32.iter().enumerate() {
                decoder.write_center(i, d, value as f32 * scale + offset);
            }
        }
    } else {
        return Err(anyhow!(
            "Unsupported WLG !settings.enable_split_center_bytes"
        ));
    }

    for d in 0..3 {
        reader.read_exact(&mut data_u8)?;
        let scale = header.ln_scale_max - header.ln_scale_min;
        let offset = header.ln_scale_min;
        for (i, &byte) in data_u8.iter().enumerate() {
            let float = ((byte as f32 / 255.0) * scale + offset).exp();
            decoder.write_scale(i, d, float);
        }
    }

    {
        let mut quaternions: Vec<i8> = vec![0; num_splats * 3];
        for d in 0..3 {
            reader.read_exact(&mut data_u8)?;
            for (i, &byte) in data_u8.iter().enumerate() {
                quaternions[i * 3 + d] = byte as i8;
            }
        }
        for i in 0..num_splats {
            let quat: [f32; 3] = [
                quaternions[i * 3 + 0] as f32 / 127.0,
                quaternions[i * 3 + 1] as f32 / 127.0,
                quaternions[i * 3 + 2] as f32 / 127.0,
            ];
            let w = (1.0 - quat.iter().map(|&v| v.powi(2)).sum::<f32>())
                .max(0.0)
                .sqrt();
            let w8 = (w * 127.0).round() as i8;

            for d in 0..3 {
                decoder.write_quaternion_f32(i, d, quat[d]);
                decoder.write_quaternion_i8(i, d, quaternions[i * 3 + d]);
            }
            decoder.write_quaternion_f32(i, 3, w);
            decoder.write_quaternion_i8(i, 3, w8);
            decoder.write_quaternion_full_f32(i, [quat[0], quat[1], quat[2], w]);
        }
    }

    reader.read_exact(&mut data_u8)?;
    if settings.enable_first_differences {
        first_cumulative(&mut data_u8);
    }
    for (i, &byte) in data_u8.iter().enumerate() {
        decoder.write_rgba(i, 3, byte);
    }

    for d in 0..3 {
        reader.read_exact(&mut data_u8)?;
        if settings.enable_first_differences {
            first_cumulative(&mut data_u8);
        }
        for (i, &byte) in data_u8.iter().enumerate() {
            decoder.write_rgba(i, d, byte);
        }
    }

    let position = reader.position() as usize;
    if position != data.len() {
        return Err(anyhow!("Invalid WLG data size"));
    }

    Ok(())
}
