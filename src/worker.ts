import init_wasm, {
  decode_wlg,
  old_sort_splats,
  sort_splats,
} from "forge-internal-rs";
import {
  SCALE_MIN,
  SPLAT_TEX_HEIGHT,
  SPLAT_TEX_MIN_HEIGHT,
  SPLAT_TEX_WIDTH,
  WASM_SPLAT_SORT,
} from "./defines";
import { PlyReader } from "./ply";
import { SpzReader } from "./spz";
import {
  encodeSh1Rgb,
  encodeSh2Rgb,
  encodeSh3Rgb,
  fromHalf,
  getArrayBuffers,
  setPackedSplat,
  setPackedSplatCenter,
  setPackedSplatOpacity,
  setPackedSplatQuat,
  setPackedSplatRgb,
  setPackedSplatScales,
} from "./utils";

// WebWorker for Forge's background CPU tasks, such as Gsplat file decoding
// and sorting.

async function onMessage(event: MessageEvent) {
  // Unpack RPC function name, arguments, and ID from the main thread.
  const { name, args, id }: { name: string; args: unknown; id: number } =
    event.data;
  // console.log(`worker.onMessage(${id}, ${name}):`, args);

  // Initialize return result/error, to be filled out below.
  let result = undefined;
  let error = undefined;

  try {
    switch (name) {
      case "unpackPly": {
        const { packedArray, fileBytes } = args as {
          packedArray: Uint32Array;
          fileBytes: Uint8Array;
        };
        const decoded = await unpackPly({ packedArray, fileBytes });
        result = {
          id,
          numSplats: decoded.numSplats,
          packedArray: decoded.packedArray,
          extra: decoded.extra,
        };
        break;
      }
      case "decodeWlg": {
        const { fileBytes } = args as { fileBytes: Uint8Array };
        const decoded = decode_wlg(
          fileBytes,
          SPLAT_TEX_WIDTH,
          SPLAT_TEX_HEIGHT,
        ) as { numSplats: number; packedSplats: Uint32Array };
        result = {
          id,
          numSplats: decoded.numSplats,
          packedArray: decoded.packedSplats,
        };
        break;
      }
      case "decodeSpz": {
        const { fileBytes } = args as { fileBytes: Uint8Array };
        const decoded = unpackSpz(fileBytes);
        result = {
          id,
          numSplats: decoded.numSplats,
          packedArray: decoded.packedArray,
          extra: decoded.extra,
        };
        break;
      }
      case "decodeAntiSplat": {
        const { fileBytes } = args as { fileBytes: Uint8Array };
        const decoded = unpackAntiSplat(fileBytes);
        result = {
          id,
          numSplats: decoded.numSplats,
          packedArray: decoded.packedArray,
        };
        break;
      }
      case "decodeKsplat": {
        const { fileBytes } = args as { fileBytes: Uint8Array };
        const decoded = unpackKsplat(fileBytes);
        result = {
          id,
          numSplats: decoded.numSplats,
          packedArray: decoded.packedArray,
          extra: decoded.extra,
        };
        break;
      }
      case "sortSplats": {
        // Sort maxSplats splats using readback data, which encodes one uint32 per
        // Gsplats, with the low bytes encoding a float16 distance sort metric.
        const { maxSplats, totalSplats, readback, ordering } = args as {
          maxSplats: number;
          totalSplats: number;
          readback: Uint8Array[];
          ordering: Uint32Array;
        };
        // Sort totalSplats splats each with 4 bytes of readback, and outputs Uint32Array ordering of splat indices
        if (WASM_SPLAT_SORT) {
          result = {
            id,
            readback,
            ordering,
            activeSplats: old_sort_splats(
              maxSplats,
              totalSplats,
              readback,
              ordering,
            ),
          };
        } else {
          result = {
            id,
            readback,
            ...oldSortSplats({ totalSplats, readback, ordering }),
          };
        }
        break;
      }
      case "sortDoubleSplats": {
        // Sort numSplats splats using the readback distance metric, which encodes
        // one float16 per splat (no unused high bytes like for sortSplats).
        const { numSplats, readback, ordering } = args as {
          numSplats: number;
          readback: Uint16Array;
          ordering: Uint32Array;
        };
        result = {
          id,
          readback,
          ordering,
        };
        if (WASM_SPLAT_SORT) {
          result = {
            id,
            readback,
            ordering,
            activeSplats: sort_splats(numSplats, readback, ordering),
          };
        } else {
          result = {
            id,
            readback,
            ...sortSplats({ numSplats, readback, ordering }),
          };
        }
        break;
      }
      default: {
        throw new Error(`Unknown name: ${name}`);
      }
    }
  } catch (e) {
    error = e;
  }

  // Send the result or error back to the main thread, making sure to transfer any ArrayBuffers
  self.postMessage(
    { id, result, error },
    { transfer: getArrayBuffers(result) },
  );
}

async function unpackPly({
  packedArray,
  fileBytes,
}: { packedArray: Uint32Array; fileBytes: Uint8Array }): Promise<{
  packedArray: Uint32Array;
  numSplats: number;
  extra: Record<string, unknown>;
}> {
  const ply = new PlyReader({ fileBytes });
  await ply.parseHeader();
  const numSplats = ply.numSplats;

  const extra: Record<string, unknown> = {};
  // Anything below this is considered zero and can be rendered as 2DGS
  const ZERO_CUTOFF = Math.exp(-20);

  ply.parseSplats(
    (
      index,
      x,
      y,
      z,
      scaleX,
      scaleY,
      scaleZ,
      quatX,
      quatY,
      quatZ,
      quatW,
      opacity,
      r,
      g,
      b,
    ) => {
      setPackedSplat(
        packedArray,
        index,
        x,
        y,
        z,
        scaleX < ZERO_CUTOFF ? 0 : Math.max(SCALE_MIN, scaleX),
        scaleY < ZERO_CUTOFF ? 0 : Math.max(SCALE_MIN, scaleY),
        scaleZ < ZERO_CUTOFF ? 0 : Math.max(SCALE_MIN, scaleZ),
        quatX,
        quatY,
        quatZ,
        quatW,
        opacity,
        r,
        g,
        b,
      );
    },
    (index, sh1, sh2, sh3) => {
      if (sh1) {
        if (!extra.sh1) {
          extra.sh1 = new Uint32Array(numSplats * 2);
        }
        encodeSh1Rgb(extra.sh1 as Uint32Array, index, sh1);
      }
      if (sh2) {
        if (!extra.sh2) {
          extra.sh2 = new Uint32Array(numSplats * 4);
        }
        encodeSh2Rgb(extra.sh2 as Uint32Array, index, sh2);
      }
      if (sh3) {
        if (!extra.sh3) {
          extra.sh3 = new Uint32Array(numSplats * 4);
        }
        encodeSh3Rgb(extra.sh3 as Uint32Array, index, sh3);
      }
    },
  );

  return { packedArray, numSplats, extra };
}

function computeMaxSplats(numSplats: number): number {
  // Compute the size of a Gsplat array texture (2048x2048xD) that can fit
  // numSplats splats, and return the total number of splats that can be stored
  // in such a texture.
  const width = SPLAT_TEX_WIDTH;
  const height = Math.max(
    SPLAT_TEX_MIN_HEIGHT,
    Math.min(SPLAT_TEX_HEIGHT, Math.ceil(numSplats / width)),
  );
  const depth = Math.ceil(numSplats / (width * height));
  return width * height * depth;
}

function unpackSpz(fileBytes: Uint8Array): {
  packedArray: Uint32Array;
  numSplats: number;
  extra: Record<string, unknown>;
} {
  const spz = new SpzReader({ fileBytes });
  const numSplats = spz.numSplats;
  const maxSplats = computeMaxSplats(numSplats);
  const packedArray = new Uint32Array(maxSplats * 4);
  const extra: Record<string, unknown> = {};

  spz.parseSplats(
    (index, x, y, z) => {
      setPackedSplatCenter(packedArray, index, x, y, z);
    },
    (index, alpha) => {
      setPackedSplatOpacity(packedArray, index, alpha);
    },
    (index, r, g, b) => {
      setPackedSplatRgb(packedArray, index, r, g, b);
    },
    (index, scaleX, scaleY, scaleZ) => {
      setPackedSplatScales(packedArray, index, scaleX, scaleY, scaleZ);
    },
    (index, quatX, quatY, quatZ, quatW) => {
      setPackedSplatQuat(packedArray, index, quatX, quatY, quatZ, quatW);
    },
    (index, sh1, sh2, sh3) => {
      if (sh1) {
        if (!extra.sh1) {
          extra.sh1 = new Uint32Array(numSplats * 2);
        }
        encodeSh1Rgb(extra.sh1 as Uint32Array, index, sh1);
      }
      if (sh2) {
        if (!extra.sh2) {
          extra.sh2 = new Uint32Array(numSplats * 4);
        }
        encodeSh2Rgb(extra.sh2 as Uint32Array, index, sh2);
      }
      if (sh3) {
        if (!extra.sh3) {
          extra.sh3 = new Uint32Array(numSplats * 4);
        }
        encodeSh3Rgb(extra.sh3 as Uint32Array, index, sh3);
      }
    },
  );
  return { packedArray, numSplats, extra };
}

function unpackAntiSplat(fileBytes: Uint8Array): {
  packedArray: Uint32Array;
  numSplats: number;
} {
  const numSplats = Math.floor(fileBytes.length / 32); // 32 bytes per splat
  if (numSplats * 32 !== fileBytes.length) {
    throw new Error("Invalid .splat file size");
  }
  const maxSplats = computeMaxSplats(numSplats);
  const packedArray = new Uint32Array(maxSplats * 4);
  const f32 = new Float32Array(fileBytes.buffer);

  for (let i = 0; i < numSplats; ++i) {
    const i32 = i * 32;
    const i8 = i * 8;
    const x = f32[i8 + 0];
    const y = f32[i8 + 1];
    const z = f32[i8 + 2];
    const scaleX = f32[i8 + 3];
    const scaleY = f32[i8 + 4];
    const scaleZ = f32[i8 + 5];
    const r = fileBytes[i32 + 24] / 255;
    const g = fileBytes[i32 + 25] / 255;
    const b = fileBytes[i32 + 26] / 255;
    const opacity = fileBytes[i32 + 27] / 255;
    const quatW = (fileBytes[i32 + 28] - 128) / 128;
    const quatX = (fileBytes[i32 + 29] - 128) / 128;
    const quatY = (fileBytes[i32 + 30] - 128) / 128;
    const quatZ = (fileBytes[i32 + 31] - 128) / 128;
    setPackedSplat(
      packedArray,
      i,
      x,
      y,
      z,
      scaleX,
      scaleY,
      scaleZ,
      quatX,
      quatY,
      quatZ,
      quatW,
      opacity,
      r,
      g,
      b,
    );
  }
  return { packedArray, numSplats };
}

type KsplatCompression = {
  bytesPerCenter: number;
  bytesPerScale: number;
  bytesPerRotation: number;
  bytesPerColor: number;
  bytesPerSphericalHarmonicsComponent: number;
  scaleOffsetBytes: number;
  rotationOffsetBytes: number;
  colorOffsetBytes: number;
  sphericalHarmonicsOffsetBytes: number;
  scaleRange: number;
};

const KSPLAT_COMPRESSION: Record<number, KsplatCompression> = {
  0: {
    bytesPerCenter: 12,
    bytesPerScale: 12,
    bytesPerRotation: 16,
    bytesPerColor: 4,
    bytesPerSphericalHarmonicsComponent: 4,
    scaleOffsetBytes: 12,
    rotationOffsetBytes: 24,
    colorOffsetBytes: 40,
    sphericalHarmonicsOffsetBytes: 44,
    scaleRange: 1,
  },
  1: {
    bytesPerCenter: 6,
    bytesPerScale: 6,
    bytesPerRotation: 8,
    bytesPerColor: 4,
    bytesPerSphericalHarmonicsComponent: 2,
    scaleOffsetBytes: 6,
    rotationOffsetBytes: 12,
    colorOffsetBytes: 20,
    sphericalHarmonicsOffsetBytes: 24,
    scaleRange: 32767,
  },
  2: {
    bytesPerCenter: 6,
    bytesPerScale: 6,
    bytesPerRotation: 8,
    bytesPerColor: 4,
    bytesPerSphericalHarmonicsComponent: 1,
    scaleOffsetBytes: 6,
    rotationOffsetBytes: 12,
    colorOffsetBytes: 20,
    sphericalHarmonicsOffsetBytes: 24,
    scaleRange: 32767,
  },
};

const KSPLAT_SH_DEGREE_TO_COMPONENTS: Record<number, number> = {
  0: 0,
  1: 9,
  2: 24,
  3: 45,
};

function unpackKsplat(fileBytes: Uint8Array): {
  packedArray: Uint32Array;
  numSplats: number;
  extra: Record<string, unknown>;
} {
  const HEADER_BYTES = 4096;
  const SECTION_BYTES = 1024;

  let headerOffset = 0;
  const header = new DataView(fileBytes.buffer, headerOffset, HEADER_BYTES);
  headerOffset += HEADER_BYTES;

  const versionMajor = header.getUint8(0);
  const versionMinor = header.getUint8(1);
  if (versionMajor !== 0 || versionMinor < 1) {
    throw new Error(
      `Unsupported .ksplat version: ${versionMajor}.${versionMinor}`,
    );
  }
  const maxSectionCount = header.getUint32(4, true);
  // const sectionCount = header.getUint32(8, true);
  // const maxSplatCount = header.getUint32(12, true);
  const splatCount = header.getUint32(16, true);
  const compressionLevel = header.getUint16(20, true);
  if (compressionLevel < 0 || compressionLevel > 2) {
    throw new Error(`Invalid .ksplat compression level: ${compressionLevel}`);
  }
  // const sceneCenterX = header.getFloat32(24, true);
  // const sceneCenterY = header.getFloat32(28, true);
  // const sceneCenterZ = header.getFloat32(32, true);
  const minSphericalHarmonicsCoeff = header.getFloat32(36, true) || -1.5;
  const maxSphericalHarmonicsCoeff = header.getFloat32(40, true) || 1.5;

  const numSplats = splatCount;
  const maxSplats = computeMaxSplats(numSplats);
  const packedArray = new Uint32Array(maxSplats * 4);
  const extra: Record<string, unknown> = {};

  let sectionBase = HEADER_BYTES + maxSectionCount * SECTION_BYTES;

  for (let section = 0; section < maxSectionCount; ++section) {
    const section = new DataView(fileBytes.buffer, headerOffset, SECTION_BYTES);
    headerOffset += SECTION_BYTES;

    const sectionSplatCount = section.getUint32(0, true);
    const sectionMaxSplatCount = section.getUint32(4, true);
    const bucketSize = section.getUint32(8, true);
    const bucketCount = section.getUint32(12, true);
    const bucketBlockSize = section.getFloat32(16, true);
    const bucketStorageSizeBytes = section.getUint16(20, true);
    const compressionScaleRange =
      (section.getUint32(24, true) ||
        KSPLAT_COMPRESSION[compressionLevel]?.scaleRange) ??
      1;
    // const fullBucketCount = section.getUint32(32, true);
    const partiallyFilledBucketCount = section.getUint32(36, true);
    const bucketsMetaDataSizeBytes = partiallyFilledBucketCount * 4;
    const bucketsStorageSizeBytes =
      bucketStorageSizeBytes * bucketCount + bucketsMetaDataSizeBytes;
    const sphericalHarmonicsDegree = section.getUint16(40, true);
    const shComponents =
      KSPLAT_SH_DEGREE_TO_COMPONENTS[sphericalHarmonicsDegree];

    const {
      bytesPerCenter,
      bytesPerScale,
      bytesPerRotation,
      bytesPerColor,
      bytesPerSphericalHarmonicsComponent,
      scaleOffsetBytes,
      rotationOffsetBytes,
      colorOffsetBytes,
      sphericalHarmonicsOffsetBytes,
    } = KSPLAT_COMPRESSION[compressionLevel];
    const bytesPerSplat =
      bytesPerCenter +
      bytesPerScale +
      bytesPerRotation +
      bytesPerColor +
      shComponents * bytesPerSphericalHarmonicsComponent;
    const splatDataStorageSizeBytes = bytesPerSplat * sectionMaxSplatCount;
    const storageSizeBytes =
      splatDataStorageSizeBytes + bucketsStorageSizeBytes;

    const sh1Index = [0, 3, 6, 1, 4, 7, 2, 5, 8];
    const sh2Index = [
      9, 14, 19, 10, 15, 20, 11, 16, 21, 12, 17, 22, 13, 18, 23,
    ];
    const sh3Index = [
      24, 31, 38, 25, 32, 39, 26, 33, 40, 27, 34, 41, 28, 35, 42, 29, 36, 43,
      30, 37, 44,
    ];
    const sh1 =
      sphericalHarmonicsDegree >= 1 ? new Float32Array(3 * 3) : undefined;
    const sh2 =
      sphericalHarmonicsDegree >= 2 ? new Float32Array(5 * 3) : undefined;
    const sh3 =
      sphericalHarmonicsDegree >= 3 ? new Float32Array(7 * 3) : undefined;

    const compressionScaleFactor = bucketBlockSize / 2 / compressionScaleRange;
    const bucketsBase = sectionBase + bucketsMetaDataSizeBytes;
    const dataBase = sectionBase + bucketsStorageSizeBytes;
    const data = new DataView(
      fileBytes.buffer,
      dataBase,
      splatDataStorageSizeBytes,
    );
    const bucketArray = new Float32Array(
      fileBytes.buffer,
      bucketsBase,
      bucketCount * 3,
    );

    function getSh(splatOffset: number, component: number) {
      if (compressionLevel === 0) {
        return data.getFloat32(
          splatOffset + sphericalHarmonicsOffsetBytes + component * 4,
          true,
        );
      }
      if (compressionLevel === 1) {
        return fromHalf(
          data.getUint16(
            splatOffset + sphericalHarmonicsOffsetBytes + component * 2,
            true,
          ),
        );
      }
      const t =
        data.getUint8(splatOffset + sphericalHarmonicsOffsetBytes + component) /
        255;
      return (
        minSphericalHarmonicsCoeff +
        t * (maxSphericalHarmonicsCoeff - minSphericalHarmonicsCoeff)
      );
    }

    for (let i = 0; i < sectionSplatCount; ++i) {
      const splatOffset = i * bytesPerSplat;
      const bucketIndex = Math.floor(i / bucketSize);

      const x =
        compressionLevel === 0
          ? data.getFloat32(splatOffset + 0, true)
          : (data.getUint16(splatOffset + 0, true) - compressionScaleRange) *
              compressionScaleFactor +
            bucketArray[3 * bucketIndex + 0];
      const y =
        compressionLevel === 0
          ? data.getFloat32(splatOffset + 4, true)
          : (data.getUint16(splatOffset + 2, true) - compressionScaleRange) *
              compressionScaleFactor +
            bucketArray[3 * bucketIndex + 1];
      const z =
        compressionLevel === 0
          ? data.getFloat32(splatOffset + 8, true)
          : (data.getUint16(splatOffset + 4, true) - compressionScaleRange) *
              compressionScaleFactor +
            bucketArray[3 * bucketIndex + 2];

      const scaleX =
        compressionLevel === 0
          ? data.getFloat32(splatOffset + scaleOffsetBytes + 0, true)
          : fromHalf(data.getUint16(splatOffset + scaleOffsetBytes + 0, true));
      const scaleY =
        compressionLevel === 0
          ? data.getFloat32(splatOffset + scaleOffsetBytes + 4, true)
          : fromHalf(data.getUint16(splatOffset + scaleOffsetBytes + 2, true));
      const scaleZ =
        compressionLevel === 0
          ? data.getFloat32(splatOffset + scaleOffsetBytes + 8, true)
          : fromHalf(data.getUint16(splatOffset + scaleOffsetBytes + 4, true));

      const quatW =
        compressionLevel === 0
          ? data.getFloat32(splatOffset + rotationOffsetBytes + 0, true)
          : fromHalf(
              data.getUint16(splatOffset + rotationOffsetBytes + 0, true),
            );
      const quatX =
        compressionLevel === 0
          ? data.getFloat32(splatOffset + rotationOffsetBytes + 4, true)
          : fromHalf(
              data.getUint16(splatOffset + rotationOffsetBytes + 2, true),
            );
      const quatY =
        compressionLevel === 0
          ? data.getFloat32(splatOffset + rotationOffsetBytes + 8, true)
          : fromHalf(
              data.getUint16(splatOffset + rotationOffsetBytes + 4, true),
            );
      const quatZ =
        compressionLevel === 0
          ? data.getFloat32(splatOffset + rotationOffsetBytes + 12, true)
          : fromHalf(
              data.getUint16(splatOffset + rotationOffsetBytes + 6, true),
            );

      const r = data.getUint8(splatOffset + colorOffsetBytes + 0) / 255;
      const g = data.getUint8(splatOffset + colorOffsetBytes + 1) / 255;
      const b = data.getUint8(splatOffset + colorOffsetBytes + 2) / 255;
      const opacity = data.getUint8(splatOffset + colorOffsetBytes + 3) / 255;

      setPackedSplat(
        packedArray,
        i,
        x,
        y,
        z,
        scaleX,
        scaleY,
        scaleZ,
        quatX,
        quatY,
        quatZ,
        quatW,
        opacity,
        r,
        g,
        b,
      );

      if (sphericalHarmonicsDegree >= 1) {
        if (sh1) {
          if (!extra.sh1) {
            extra.sh1 = new Uint32Array(numSplats * 2);
          }
          for (const [i, key] of sh1Index.entries()) {
            sh1[i] = getSh(splatOffset, key);
          }
          encodeSh1Rgb(extra.sh1 as Uint32Array, i, sh1);
        }
        if (sh2) {
          if (!extra.sh2) {
            extra.sh2 = new Uint32Array(numSplats * 4);
          }
          for (const [i, key] of sh2Index.entries()) {
            sh2[i] = getSh(splatOffset, key);
          }
          encodeSh2Rgb(extra.sh2 as Uint32Array, i, sh2);
        }
        if (sh3) {
          if (!extra.sh3) {
            extra.sh3 = new Uint32Array(numSplats * 4);
          }
          for (const [i, key] of sh3Index.entries()) {
            sh3[i] = getSh(splatOffset, key);
          }
          encodeSh3Rgb(extra.sh3 as Uint32Array, i, sh3);
        }
      }
    }
    sectionBase += storageSizeBytes;
  }
  return { packedArray, numSplats, extra };
}

// Array of buckets for sorting float16 distances with range [0, DEPTH_INFINITY].
const DEPTH_INFINITY = 0x7c00;
const DEPTH_SIZE = DEPTH_INFINITY + 1;
let depthArray: Uint32Array | null = null;

function oldSortSplats({
  totalSplats,
  readback,
  ordering,
}: { totalSplats: number; readback: Uint8Array[]; ordering: Uint32Array }): {
  activeSplats: number;
  ordering: Uint32Array;
} {
  // Sort totalSplats Gsplats, each with 4 bytes of readback, and outputs Uint32Array
  // of indices from most distant to nearest. Each 4 bytes encode a float16 distance
  // and unused high bytes.
  if (!depthArray) {
    depthArray = new Uint32Array(DEPTH_SIZE);
  }
  depthArray.fill(0);

  const readbackUint32 = readback.map((layer) => new Uint32Array(layer.buffer));
  const layerSize = readbackUint32[0].length;
  const numLayers = Math.ceil(totalSplats / layerSize);

  let layerBase = 0;
  for (let layer = 0; layer < numLayers; ++layer) {
    const readbackLayer = readbackUint32[layer];
    const layerSplats = Math.min(readbackLayer.length, totalSplats - layerBase);
    for (let i = 0; i < layerSplats; ++i) {
      const pri = readbackLayer[i] & 0x7fff;
      if (pri < DEPTH_INFINITY) {
        depthArray[pri] += 1;
      }
    }
    layerBase += layerSplats;
  }

  let activeSplats = 0;
  for (let j = 0; j < DEPTH_SIZE; ++j) {
    const nextIndex = activeSplats + depthArray[j];
    depthArray[j] = activeSplats;
    activeSplats = nextIndex;
  }

  layerBase = 0;
  for (let layer = 0; layer < numLayers; ++layer) {
    const readbackLayer = readbackUint32[layer];
    const layerSplats = Math.min(readbackLayer.length, totalSplats - layerBase);
    for (let i = 0; i < layerSplats; ++i) {
      const pri = readbackLayer[i] & 0x7fff;
      if (pri < DEPTH_INFINITY) {
        ordering[depthArray[pri]] = layerBase + i;
        depthArray[pri] += 1;
      }
    }
    layerBase += layerSplats;
  }
  if (depthArray[DEPTH_SIZE - 1] !== activeSplats) {
    throw new Error(
      `Expected ${activeSplats} active splats but got ${depthArray[DEPTH_SIZE - 1]}`,
    );
  }

  return { activeSplats, ordering };
}

// Sort numSplats splats, each with 2 bytes of float16 readback for distance metric,
// using one bucket sort pass, outputting Uint32Array of indices.
function sortSplats({
  numSplats,
  readback,
  ordering,
}: { numSplats: number; readback: Uint16Array; ordering: Uint32Array }): {
  activeSplats: number;
  ordering: Uint32Array;
} {
  // Ensure depthArray is allocated and zeroed out for our buckets.
  if (!depthArray) {
    depthArray = new Uint32Array(DEPTH_SIZE);
  }
  depthArray.fill(0);

  // Count the number of splats in each bucket (cull Gsplats at infinity).
  for (let i = 0; i < numSplats; ++i) {
    const pri = readback[i];
    if (pri < DEPTH_INFINITY) {
      depthArray[pri] += 1;
    }
  }

  // Compute the beginning index of each bucket in the output array and the
  // total number of active (non-infinity) splats, going in reverse order
  // because we want most distant Gsplats to be first in the output array.
  let activeSplats = 0;
  for (let j = DEPTH_INFINITY - 1; j >= 0; --j) {
    const nextIndex = activeSplats + depthArray[j];
    depthArray[j] = activeSplats;
    activeSplats = nextIndex;
  }

  // Write out the sorted indices into the output array according
  // bucket order.
  for (let i = 0; i < numSplats; ++i) {
    const pri = readback[i];
    if (pri < DEPTH_INFINITY) {
      ordering[depthArray[pri]] = i;
      depthArray[pri] += 1;
    }
  }
  // Sanity check that the end of the closest bucket is the same as
  // our total count of active splats (not at infinity).
  if (depthArray[0] !== activeSplats) {
    throw new Error(
      `Expected ${activeSplats} active splats but got ${depthArray[0]}`,
    );
  }

  return { activeSplats, ordering };
}

// Buffer to queue any messages received while initializing, for example
// early messages to unpack a Gsplat file while still initializing the WASM code.
const messageBuffer: MessageEvent[] = [];

function bufferMessage(event: MessageEvent) {
  messageBuffer.push(event);
}

async function initialize() {
  // Hold any messages received while initializing
  self.addEventListener("message", bufferMessage);

  await init_wasm();

  self.removeEventListener("message", bufferMessage);
  self.addEventListener("message", onMessage);

  // Process any buffered messages
  for (const event of messageBuffer) {
    onMessage(event);
  }
  messageBuffer.length = 0;
}

initialize().catch(console.error);
