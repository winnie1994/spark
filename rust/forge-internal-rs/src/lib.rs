
use std::cell::RefCell;
use js_sys::{Array, ArrayBuffer, Float32Array, Object, Reflect, Uint16Array, Uint32Array, Uint8Array};
use wasm_bindgen::prelude::*;

use wlg::decode12_packed;

mod sort;
use sort::{old_sort_internal, OldSortBuffers, sort_internal, SortBuffers};

mod raycast;
use raycast::{raycast_ellipsoids, raycast_spheres};

const RAYCAST_BUFFER_COUNT: u32 = 65536;

thread_local! {
    static SORT_BUFFERS: RefCell<SortBuffers> = RefCell::new(SortBuffers::default());
    static OLD_SORT_BUFFERS: RefCell<OldSortBuffers> = RefCell::new(OldSortBuffers::default());
    static RAYCAST_BUFFER: RefCell<Vec<u32>> = RefCell::new(vec![0; RAYCAST_BUFFER_COUNT as usize * 4]);
}

#[wasm_bindgen]
pub fn decode_wlg(bytes: ArrayBuffer, tex_width: u32, tex_height: u32) -> Object {
    let mut bytes = Uint8Array::new(&bytes).to_vec();
    let (_settings, packed_splats) = match decode12_packed(&mut bytes) {
        Ok(result) => result,
        Err(err) => {
            wasm_bindgen::throw_str(&format!("{}", err));
        }
    };

    let num_splats = packed_splats.0.len() / 4;
    let max_splats = if tex_width != 0 && tex_height != 0 {            
        let width = tex_width as usize;
        let height = num_splats.div_ceil(width).min(tex_height as usize);
        let depth = num_splats.div_ceil(width * height);
        width * height * depth
    } else {
        num_splats
    };

    let packed = Uint32Array::new_with_length(max_splats as u32 * 4);
    let packed_slice = packed.subarray(0, packed_splats.0.len() as u32);
    packed_slice.copy_from(&packed_splats.0);

    let result = Object::new();
    Reflect::set(&result, &JsValue::from_str("numSplats"), &JsValue::from_f64(num_splats as f64)).unwrap();
    Reflect::set(&result, &JsValue::from_str("packedSplats"), &JsValue::from(packed)).unwrap();
    result
}

#[wasm_bindgen]
pub fn old_sort_splats(
    max_splats: u32, total_splats: u32, readback: Array, ordering: Uint32Array,
) -> u32 {
    let max_splats = max_splats as usize;
    let total_splats = total_splats as usize;
    let num_layers = readback.length() as usize;
    let layer_size = readback.get(0).dyn_into::<Uint8Array>().unwrap().length() as usize / 4;

    let active_splats = OLD_SORT_BUFFERS.with_borrow_mut(|buffers| {
        buffers.ensure_size(max_splats);

        // Copy the readback data layers into a contiguous buffer
        let mut layer_base = 0;
        for layer in 0..num_layers {
            let layer_count = layer_size.min(total_splats - layer_base);
            if layer_count > 0 {
                let layer_buffer = readback.get(layer as u32).dyn_into::<Uint8Array>().unwrap().buffer();
                let layer_uint32 = Uint32Array::new_with_byte_offset_and_length(&layer_buffer, 0, layer_count as u32);
                layer_uint32.copy_to(&mut buffers.readback[layer_base..layer_base + layer_count]);
            }
            layer_base += layer_count;
        }

        let active_splats = match old_sort_internal(buffers, total_splats) {
            Ok(active_splats) => active_splats,
            Err(err) => {
                wasm_bindgen::throw_str(&format!("{}", err));
            }
        };

        if active_splats > 0 {
            // Copy out ordering result
            let subarray = &buffers.ordering[..active_splats as usize];
            ordering.subarray(0, active_splats).copy_from(&subarray);
        }
        active_splats
    });

    active_splats
}

#[wasm_bindgen]
pub fn sort_splats(
    num_splats: u32, readback: Uint16Array, ordering: Uint32Array,
) -> u32 {
    let max_splats = readback.length() as usize;

    let active_splats = SORT_BUFFERS.with_borrow_mut(|buffers| {
        buffers.ensure_size(max_splats);
        let sub_readback = readback.subarray(0, num_splats);
        sub_readback.copy_to(&mut buffers.readback[..num_splats as usize]);

        let active_splats = match sort_internal(buffers, num_splats as usize) {
            Ok(active_splats) => active_splats,
            Err(err) => {
                wasm_bindgen::throw_str(&format!("{}", err));
            }
        };

        if active_splats > 0 {
            // Copy out ordering result
            let subarray = &buffers.ordering[..active_splats as usize];
            ordering.subarray(0, active_splats).copy_from(&subarray);
        }
        active_splats
    });

    active_splats
}

#[wasm_bindgen]
pub fn raycast_splats(
    origin_x: f32, origin_y: f32, origin_z: f32,
    dir_x: f32, dir_y: f32, dir_z: f32,
    near: f32, far: f32,
    num_splats: u32, packed_splats: Uint32Array,
    raycast_ellipsoid: bool,
) -> Float32Array {
    let mut distances = Vec::<f32>::new();

    _ = RAYCAST_BUFFER.with_borrow_mut(|buffer| {
        let mut base = 0;
        while base < num_splats {
            let chunk_size = RAYCAST_BUFFER_COUNT.min(num_splats - base);
            let subarray = packed_splats.subarray(4 * base, 4 * (base + chunk_size));
            let subbuffer = &mut buffer[0..(4 * chunk_size as usize)];
            subarray.copy_to(subbuffer);

            if raycast_ellipsoid {
                raycast_ellipsoids(subbuffer, &mut distances, [origin_x, origin_y, origin_z], [dir_x, dir_y, dir_z], near, far);
            } else {
                raycast_spheres(subbuffer, &mut distances, [origin_x, origin_y, origin_z], [dir_x, dir_y, dir_z], near, far);
            }

            base += chunk_size;
        }
    });

    let output = Float32Array::new_with_length(distances.len() as u32);
    output.copy_from(&distances);
    output
}
