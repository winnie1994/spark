use std::io::Write;

use super::{compress_data, obfuscate, Wlg0Gaussian, Wlg0Settings, Wlg0Header};
use crate::ordering::{
    hilbert_coord_to_index, hilbert_coord_to_index_24, morton_coord_to_index,
    morton_coord_to_index_24,
};

// WLG splat representation with fixed-point encoding.

#[derive(Debug)]
struct WlgSplat {
    order: u128,
    center: [u32; 3],
    scale: [u8; 3],
    quaternion: [i8; 3],
    opacity: u8,
    color: [u8; 3],
}

impl WlgSplat {
    fn new(
        settings: &Wlg0Settings,
        index: usize,
        center: [f32; 3],
        scale: [f32; 3],
        mut quaternion: [f32; 4],
        opacity: f32,
        color: [f32; 3],
    ) -> Self {
        use std::array::from_fn;
        let center = if settings.enable_24bit_center {
            from_fn(|d| (center[d] * 16777215.0).clamp(0.0, 16777215.0).round() as u32)
        } else {
            from_fn(|d| (center[d] * 65535.0).clamp(0.0, 65535.0).round() as u32)
        };
        if quaternion[3] < 0.0 {
            quaternion = from_fn(|d| -quaternion[d]);
        }
        Self {
            order: if settings.enable_hilbert_reordering {
                // Convert X/Y/Z into a single Hilbert curve index
                if settings.enable_24bit_center {
                    hilbert_coord_to_index_24(center) as u128
                } else {
                    hilbert_coord_to_index(from_fn(|d| center[d] as u16)) as u128
                }
            } else if settings.enable_morton_reordering {
                // Interleave X/Y/Z bits into a single Morton index
                if settings.enable_24bit_center {
                    morton_coord_to_index_24(center) as u128
                } else {
                    morton_coord_to_index(from_fn(|d| center[d] as u16)) as u128
                }
            } else {
                index as u128
            },
            center,
            scale: from_fn(|d| (scale[d] * 255.0).clamp(0.0, 255.0).round() as u8),
            quaternion: from_fn(|d| (quaternion[d] * 127.0).clamp(-127.0, 127.0).round() as i8),
            opacity: (opacity * 255.0).clamp(0.0, 255.0).round() as u8,
            color: from_fn(|d| (color[d] * 255.0).clamp(0.0, 255.0).round() as u8),
        }
    }
}

// Encoding functions

fn first_differences(settings: &Wlg0Settings, mut data: Vec<u8>) -> Vec<u8> {
    if settings.enable_first_differences {
        super::first_differences(&mut data);
    }
    data
}

pub(super) fn encode_internal(
    settings: &Wlg0Settings,
    gaussians: &[Wlg0Gaussian],
) -> anyhow::Result<Vec<u8>> {
    use std::array::from_fn;
    let num_splats = gaussians.len();

    // Compute min/max bounds for Gsplat centers
    let center_min_max = ([f32::INFINITY; 3], [-f32::INFINITY; 3]);
    let (center_min, center_max) = gaussians.iter().fold(center_min_max, |(min, max), g| {
        let min = from_fn(|i| min[i].min(g.center[i]));
        let max = from_fn(|i| max[i].max(g.center[i]));
        (min, max)
    });
    // println!("Center min: {:?}, max: {:?}", center_min, center_max);
    // Compute scale factor and offset for center values
    let center_ranges: [f32; 3] = from_fn(|i| center_max[i] - center_min[i]);
    let center_scale = center_ranges.into_iter().reduce(|a, b| a.max(b)).unwrap();
    let center_offset = center_min;

    // Compute min/max bounds for Gsplat ln_scales
    let ln_scale_min_max = (f32::INFINITY, -f32::INFINITY);
    let (ln_scale_min, ln_scale_max) =
        gaussians
            .iter()
            .fold(ln_scale_min_max, |(mut min, mut max), g| {
                g.ln_scale.iter().for_each(|&ln_scale| {
                    let ln_scale = ln_scale.clamp(-10.0, 10.0);
                    min = min.min(ln_scale);
                    max = max.max(ln_scale);
                });
                (min, max)
            });
    // println!("ln_scale min: {}, max: {}", ln_scale_min, ln_scale_max);

    let mut splats: Vec<_> = gaussians
        .iter()
        .enumerate()
        .map(|(index, g)| {
            WlgSplat::new(
                settings,
                index,
                from_fn(|d| (g.center[d] - center_offset[d]) / center_scale),
                from_fn(|d| (g.ln_scale[d] - ln_scale_min) / (ln_scale_max - ln_scale_min)),
                g.quaternion,
                g.opacity,
                from_fn(|d| g.color[d]),
            )
        })
        .collect();

    // Reorder splats using the provided ordering key, either Morton or original index.
    splats.sort_by_key(|splat| splat.order);

    // Create buffer to write header and splats to
    let mut buffer: Vec<u8> = Vec::new();

    let header = Wlg0Header {
        center_scale,
        center_offset,
        ln_scale_min,
        ln_scale_max,
        num_splats: num_splats as u32,
        max_sh_order: 0,
        num_sh_splats: [num_splats as u32, 0, 0, 0],
    };
    header.write(&mut buffer)?;

    if settings.enable_split_dims {
        // Write dimensions separately, i.e. a column-oriented format.

        for d in 0..3 {
            if settings.enable_split_center_bytes {
                // Split center values into separate bytes (MSB order)
                if settings.enable_24bit_center {
                    let data: Vec<u8> = splats
                        .iter()
                        .map(|splat| (splat.center[d] >> 16) as u8)
                        .collect();
                    buffer.write_all(&first_differences(settings, data))?;
                }
                let data: Vec<u8> = splats
                    .iter()
                    .map(|splat| (splat.center[d] >> 8) as u8)
                    .collect();
                buffer.write_all(&first_differences(settings, data))?;
                let data: Vec<u8> = splats.iter().map(|splat| splat.center[d] as u8).collect();
                buffer.write_all(&first_differences(settings, data))?;
            } else {
                if settings.enable_24bit_center {
                    // Write 24-bit center values into u8 array in LSB order
                    let data: Vec<u8> = splats
                        .iter()
                        .flat_map(|splat| {
                            let center = splat.center[d];
                            [center as u8, (center >> 8) as u8, (center >> 16) as u8]
                        })
                        .collect();
                    buffer.write_all(&data)?;
                } else {
                    let data_u16: Vec<u16> =
                        splats.iter().map(|splat| splat.center[d] as u16).collect();
                    let data: Vec<u8> = data_u16
                        .iter()
                        .flat_map(|&v| v.to_le_bytes().to_vec())
                        .collect();
                    buffer.write_all(&data)?;
                }
            }
        }
        for d in 0..3 {
            let data: Vec<u8> = splats.iter().map(|splat| splat.scale[d]).collect();
            buffer.write_all(&data)?;
        }
        for d in 0..3 {
            let data: Vec<u8> = splats
                .iter()
                .map(|splat| splat.quaternion[d] as u8)
                .collect();
            buffer.write_all(&data)?;
        }
        {
            let data: Vec<u8> = splats.iter().map(|splat| splat.opacity).collect();
            buffer.write_all(&first_differences(settings, data))?;
        }
        for d in 0..3 {
            let data: Vec<u8> = splats.iter().map(|splat| splat.color[d]).collect();
            buffer.write_all(&first_differences(settings, data))?;
        }
    } else {
        // !enable_split_dims, write all dimensions interleaved (array of structs).

        if settings.enable_split_center_bytes {
            if settings.enable_24bit_center {
                let data: Vec<u8> = splats
                    .iter()
                    .flat_map(|splat| splat.center.iter().map(|&v| (v >> 16) as u8))
                    .collect();
                buffer.write_all(&first_differences(settings, data))?;
            }
            let data: Vec<u8> = splats
                .iter()
                .flat_map(|splat| splat.center.iter().map(|&v| (v >> 8) as u8))
                .collect();
            buffer.write_all(&first_differences(settings, data))?;
            let data: Vec<u8> = splats
                .iter()
                .flat_map(|splat| splat.center.iter().map(|&v| v as u8))
                .collect();
            buffer.write_all(&first_differences(settings, data))?;
        } else {
            if settings.enable_24bit_center {
                let data: Vec<u8> = splats
                    .iter()
                    .flat_map(|splat| {
                        splat
                            .center
                            .iter()
                            .flat_map(|&d| [d as u8, (d >> 8) as u8, (d >> 16) as u8])
                    })
                    .collect();
                buffer.write_all(&data)?;
            } else {
                let data_u16: Vec<u16> = splats
                    .iter()
                    .flat_map(|splat| splat.center.iter().map(|&v| v as u16))
                    .collect();
                let data: Vec<u8> = data_u16
                    .iter()
                    .flat_map(|&v| v.to_le_bytes().to_vec())
                    .collect();
                buffer.write_all(&data)?;
            }
        }

        let data: Vec<u8> = splats
            .iter()
            .flat_map(|splat| splat.scale.iter().copied())
            .collect();
        buffer.write_all(&data)?;

        let data: Vec<u8> = splats
            .iter()
            .flat_map(|splat| splat.quaternion.iter().map(|&v| v as u8))
            .collect();
        buffer.write_all(&data)?;

        let data: Vec<u8> = splats.iter().map(|splat| splat.opacity).collect();
        buffer.write_all(&first_differences(settings, data))?;

        let data: Vec<u8> = splats
            .iter()
            .flat_map(|splat| splat.color.iter().copied())
            .collect();
        buffer.write_all(&first_differences(settings, data))?;
    }

    let mut payload = if settings.enable_compression {
        compress_data(&buffer, settings.zstd_compression_level)?
    } else {
        buffer
    };

    if settings.enable_obfuscation {
        obfuscate(&mut payload);
    }
    Ok(payload)
}
