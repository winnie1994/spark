use anyhow::anyhow;

const DEPTH_INFINITY: u32 = 0x7c00;
const DEPTH_SIZE: usize = DEPTH_INFINITY as usize + 1;

#[derive(Default)]
pub struct OldSortBuffers {
    pub readback: Vec<u32>,
    pub ordering: Vec<u32>,
    pub buckets: Vec<u32>,
}

impl OldSortBuffers {
    pub fn ensure_size(&mut self, max_splats: usize) {
        if self.readback.len() < max_splats {
            self.readback.resize(max_splats, 0);
        }
        if self.ordering.len() < max_splats {
            self.ordering.resize(max_splats, 0);
        }
        if self.buckets.len() < DEPTH_SIZE {
            self.buckets.resize(DEPTH_SIZE, 0);
        }
    }
}

pub fn old_sort_internal(buffers: &mut OldSortBuffers, total_splats: usize) -> anyhow::Result<u32> {
    let OldSortBuffers { readback, ordering, buckets } = buffers;
    let readback = &readback[..total_splats];

    // Set the bucket counts to zero
    buckets.clear();
    buckets.resize(DEPTH_SIZE, 0);

    // Count the number of splats in each bucket
    for &readback_u32 in readback.iter() {
        let priority = readback_u32 & 0x7FFF;
        if priority < DEPTH_INFINITY {
            buckets[priority as usize] += 1;
        }
    }

    // Compute bucket starting offset
    let mut active_splats = 0;
    for count in buckets.iter_mut() {
        let new_total = active_splats + *count;
        *count = active_splats;
        active_splats = new_total;
    }

    // Write out splat indices at the right location using bucket offsets
    for (index, &readback_u32) in readback.iter().enumerate() {
        let priority = readback_u32 & 0x7FFF;
        if priority < DEPTH_INFINITY {
            ordering[buckets[priority as usize] as usize] = index as u32;
            buckets[priority as usize] += 1;
        }
    }

    // Sanity check
    if buckets[DEPTH_SIZE - 1] != active_splats {
        return Err(anyhow!(
            "Expected {} active splats but got {}",
            active_splats,
            buckets[DEPTH_SIZE - 1]
        ));
    }
    Ok(active_splats)
}


#[derive(Default)]
pub struct SortBuffers {
    pub readback: Vec<u16>,
    pub ordering: Vec<u32>,
    pub buckets: Vec<u32>,
}

impl SortBuffers {
    pub fn ensure_size(&mut self, max_splats: usize) {
        if self.readback.len() < max_splats {
            self.readback.resize(max_splats, 0);
        }
        if self.ordering.len() < max_splats {
            self.ordering.resize(max_splats, 0);
        }
        if self.buckets.len() < DEPTH_SIZE {
            self.buckets.resize(DEPTH_SIZE, 0);
        }
    }
}

pub fn sort_internal(buffers: &mut SortBuffers, num_splats: usize) -> anyhow::Result<u32> {
    let SortBuffers { readback, ordering, buckets } = buffers;
    let readback = &readback[..num_splats];

    // Set the bucket counts to zero
    buckets.clear();
    buckets.resize(DEPTH_SIZE, 0);

    // Count the number of splats in each bucket
    for &metric in readback.iter() {
        if (metric as u32) < DEPTH_INFINITY {
            buckets[metric as usize] += 1;
        }
    }

    // Compute bucket starting offset
    let mut active_splats = 0;
    for count in buckets.iter_mut().rev().skip(1) {
        let new_total = active_splats + *count;
        *count = active_splats;
        active_splats = new_total;
    }

    // Write out splat indices at the right location using bucket offsets
    for (index, &metric) in readback.iter().enumerate() {
        if (metric as u32) < DEPTH_INFINITY {
            ordering[buckets[metric as usize] as usize] = index as u32;
            buckets[metric as usize] += 1;
        }
    }

    // Sanity check
    if buckets[0] != active_splats {
        return Err(anyhow!(
            "Expected {} active splats but got {}",
            active_splats,
            buckets[0]
        ));
    }
    Ok(active_splats)
}
