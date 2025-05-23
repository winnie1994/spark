// Compute Morton index for 3D coordinates.

pub fn morton_coord_to_index([x, y, z]: [u16; 3]) -> u64 {
    fn expand3(x: u16) -> u64 {
        let mut x = x as u64;
        x = (x | x << 32) & 0x1f00000000ffff;
        x = (x | x << 16) & 0x1f0000ff0000ff;
        x = (x | x << 8) & 0x100f00f00f00f00f;
        x = (x | x << 4) & 0x10c30c30c30c30c3;
        x = (x | x << 2) & 0x1249249249249249;
        x
    }

    (expand3(x) << 0) | (expand3(y) << 1) | (expand3(z) << 2)
}

pub fn morton_coord_to_index_24([x, y, z]: [u32; 3]) -> u128 {
    fn expand3_24(x: u32) -> u128 {
        let mut x = x as u128;
        x = (x | x << 64) & 0x3ff0000000000000000ffffffffu128;
        x = (x | x << 32) & 0x3ff00000000ffff00000000ffffu128;
        x = (x | x << 16) & 0x30000ff0000ff0000ff0000ff0000ffu128;
        x = (x | x << 8) & 0x300f00f00f00f00f00f00f00f00f00fu128;
        x = (x | x << 4) & 0x30c30c30c30c30c30c30c30c30c30c3u128;
        x = (x | x << 2) & 0x9249249249249249249249249249249u128;
        x
    }

    (expand3_24(x) << 0) | (expand3_24(y) << 1) | (expand3_24(z) << 2)
}

// Compute Hilbert index for 3D coordinates.

// Converts a 48-bit Hilbert index to 3D coordinates (x, y, z).
pub fn _hilbert_index_to_coord(mut index: u64) -> (u16, u16, u16) {
    const BITS: u32 = 16;

    // Helper function to decode a Hilbert quad to coordinate bits.
    fn hilbert_decode_step(quad: u16, s: &mut [u16; 3]) {
        let (mut x, mut y, mut z) = (0u16, 0u16, 0u16);

        match quad {
            0 => { x = 0; y = 0; z = 0; },
            1 => { x = 0; y = 0; z = 1; },
            2 => { x = 0; y = 1; z = 1; },
            3 => { x = 0; y = 1; z = 0; },
            4 => { x = 1; y = 1; z = 0; },
            5 => { x = 1; y = 1; z = 1; },
            6 => { x = 1; y = 0; z = 1; },
            7 => { x = 1; y = 0; z = 0; },
            _ => {},
        }

        s[0] = x;
        s[1] = y;
        s[2] = z;
    }

    let mut mask = 1u16; // Start with the least significant bit
    let mut h = [0u16; 3];
    let mut s = [0u16; 3];

    for _ in 0..BITS {
        let quad = (index & 7) as u16; // Extract the last 3 bits
        index >>= 3;

        hilbert_decode_step(quad, &mut s);

        h[0] |= s[0] * mask;
        h[1] |= s[1] * mask;
        h[2] |= s[2] * mask;

        mask <<= 1; // Move to the next bit
    }

    (h[0], h[1], h[2])
}

// Converts 3D coordinates (x, y, z) to a 48-bit Hilbert index.
pub fn hilbert_coord_to_index([x, y, z]: [u16; 3]) -> u64 {
    const BITS: u32 = 16;

    // Helper function to encode coordinate bits to a Hilbert quad.
    fn hilbert_encode_step(s: &mut [u16; 3]) -> u16 {
        let x = s[0];
        let y = s[1];
        let z = s[2];

        let mut quad = 0u16;

        if x == 0 && y == 0 && z == 0 { quad = 0; }
        else if x == 0 && y == 0 && z == 1 { quad = 1; }
        else if x == 0 && y == 1 && z == 1 { quad = 2; }
        else if x == 0 && y == 1 && z == 0 { quad = 3; }
        else if x == 1 && y == 1 && z == 0 { quad = 4; }
        else if x == 1 && y == 1 && z == 1 { quad = 5; }
        else if x == 1 && y == 0 && z == 1 { quad = 6; }
        else if x == 1 && y == 0 && z == 0 { quad = 7; }

        quad
    }

    let mut index = 0u64;
    let mut h = [x, y, z];
    let mut s = [0u16; 3];

    for _ in 0..BITS {
        s[0] = h[0] & 1;
        s[1] = h[1] & 1;
        s[2] = h[2] & 1;

        let quad = hilbert_encode_step(&mut s);
        index <<= 3;
        index |= quad as u64;

        h[0] >>= 1;
        h[1] >>= 1;
        h[2] >>= 1;
    }

    index
}

// Converts a 72-bit Hilbert index to 3D coordinates (x, y, z).
pub fn _hilbert_index_coord_24(index: u128) -> (u32, u32, u32) {
    const BITS: u32 = 24;

    // Helper function to decode a Hilbert quad to coordinates.
    fn hilbert_decode_step(quad: u32, s: &mut [u32; 3]) {
        match quad {
            0 => { s.swap(0, 1); },
            1 => {},
            2 => {},
            3 => { s[2] ^= 1; },
            4 => { s[0] ^= 1; s[1] ^= 1; s[2] ^= 1; },
            5 => { s[0] ^= 1; s[1] ^= 1; s[2] ^= 1; s.swap(0, 1); },
            6 => { s[0] ^= 1; s[1] ^= 1; s[2] ^= 1; s.swap(1, 2); },
            7 => { s.swap(0, 2); },
            _ => {},
        }
    }

    let mut idx = index;

    let mut mask = 1u32 << (BITS - 1);
    let mut h = [0u32; 3];
    let mut s = [0u32; 3];

    for _ in 0..BITS {
        let quad = (idx & 7) as u32;
        idx >>= 3;

        hilbert_decode_step(quad, &mut s);
        h[0] |= s[0] & mask;
        h[1] |= s[1] & mask;
        h[2] |= s[2] & mask;

        mask >>= 1;
    }

    (h[0], h[1], h[2])
}

// Converts 3D coordinates (x, y, z) to a 72-bit Hilbert index.
pub fn hilbert_coord_to_index_24([x, y, z]: [u32; 3]) -> u128 {
    const BITS: u32 = 24;

    // Helper function to encode coordinates to a Hilbert quad.
    fn hilbert_encode_step(s: &mut [u32; 3]) -> u32 {
        let mut quad = 0u32;
        let mut bits = [s[0], s[1], s[2]];

        if bits[0] > bits[1] { bits.swap(0, 1); quad ^= 1; }
        if bits[1] > bits[2] { bits.swap(1, 2); quad ^= 2; }
        if bits[0] > bits[1] { bits.swap(0, 1); quad ^= 1; }

        s[0] = bits[0];
        s[1] = bits[1];
        s[2] = bits[2];

        quad
    }

    let mut index = 0u128;
    let h = [x, y, z];
    let mut s = [0u32; 3];
    let mut mask = 1u32 << (BITS - 1);

    for _ in 0..BITS {
        s[0] = (h[0] & mask) >> (BITS - 1);
        s[1] = (h[1] & mask) >> (BITS - 1);
        s[2] = (h[2] & mask) >> (BITS - 1);

        let quad = hilbert_encode_step(&mut s);
        index = (index << 3) | quad as u128;

        mask >>= 1;
    }

    index
}
