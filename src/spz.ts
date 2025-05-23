import { GunzipReader, fromHalf } from "./utils";

// SPZ file format reader

export class SpzReader {
  fileBytes: Uint8Array;
  reader: GunzipReader;

  version: number;
  numSplats: number;
  shDegree: number;
  fractionalBits: number;
  flags: number;
  flagAntiAlias: boolean;
  reserved: number;
  parsed: boolean;

  constructor({ fileBytes }: { fileBytes: Uint8Array | ArrayBuffer }) {
    this.fileBytes =
      fileBytes instanceof ArrayBuffer ? new Uint8Array(fileBytes) : fileBytes;
    this.reader = new GunzipReader({ fileBytes: this.fileBytes });

    const header = new DataView(this.reader.read(16).buffer);
    if (header.getUint32(0, true) !== 0x5053474e) {
      throw new Error("Invalid SPZ file");
    }
    this.version = header.getUint32(4, true);
    if (this.version < 1 || this.version > 2) {
      throw new Error(`Unsupported SPZ version: ${this.version}`);
    }

    this.numSplats = header.getUint32(8, true);
    this.shDegree = header.getUint8(12);
    this.fractionalBits = header.getUint8(13);
    this.flags = header.getUint8(14);
    this.flagAntiAlias = (this.flags & 0x01) !== 0;
    this.reserved = header.getUint8(15);
    this.parsed = false;
  }

  parseSplats(
    centerCallback: (index: number, x: number, y: number, z: number) => void,
    alphaCallback: (index: number, alpha: number) => void,
    rgbCallback: (index: number, r: number, g: number, b: number) => void,
    scalesCallback: (
      index: number,
      scaleX: number,
      scaleY: number,
      scaleZ: number,
    ) => void,
    quatCallback: (
      index: number,
      quatX: number,
      quatY: number,
      quatZ: number,
      quatW: number,
    ) => void,
    shCallback?: (
      index: number,
      sh1: Float32Array,
      sh2?: Float32Array,
      sh3?: Float32Array,
    ) => void,
  ) {
    if (this.parsed) {
      throw new Error("SPZ file already parsed");
    }
    this.parsed = true;

    if (this.version === 1) {
      // float16 centers
      const centerBytes = this.reader.read(this.numSplats * 3 * 2);
      const centerUint16 = new Uint16Array(centerBytes.buffer);
      for (let i = 0; i < this.numSplats; i++) {
        const i3 = i * 3;
        const x = fromHalf(centerUint16[i3]);
        const y = fromHalf(centerUint16[i3 + 1]);
        const z = fromHalf(centerUint16[i3 + 2]);
        centerCallback(i, x, y, z);
      }
    } else if (this.version === 2) {
      // 24-bit fixed-point centers
      const fixed = 1 << this.fractionalBits;
      const centerBytes = this.reader.read(this.numSplats * 3 * 3);
      for (let i = 0; i < this.numSplats; i++) {
        const i9 = i * 9;
        const x =
          (((centerBytes[i9 + 2] << 24) |
            (centerBytes[i9 + 1] << 16) |
            (centerBytes[i9] << 8)) >>
            8) /
          fixed;
        const y =
          (((centerBytes[i9 + 5] << 24) |
            (centerBytes[i9 + 4] << 16) |
            (centerBytes[i9 + 3] << 8)) >>
            8) /
          fixed;
        const z =
          (((centerBytes[i9 + 8] << 24) |
            (centerBytes[i9 + 7] << 16) |
            (centerBytes[i9 + 6] << 8)) >>
            8) /
          fixed;
        centerCallback(i, x, y, z);
      }
    } else {
      throw new Error("Unreachable");
    }

    {
      const bytes = this.reader.read(this.numSplats);
      for (let i = 0; i < this.numSplats; i++) {
        alphaCallback(i, bytes[i] / 255);
      }
    }
    {
      const rgbBytes = this.reader.read(this.numSplats * 3);
      const scale = SH_C0 / 0.15;
      for (let i = 0; i < this.numSplats; i++) {
        const i3 = i * 3;
        const r = (rgbBytes[i3] / 255 - 0.5) * scale + 0.5;
        const g = (rgbBytes[i3 + 1] / 255 - 0.5) * scale + 0.5;
        const b = (rgbBytes[i3 + 2] / 255 - 0.5) * scale + 0.5;
        rgbCallback(i, r, g, b);
      }
    }
    {
      const scalesBytes = this.reader.read(this.numSplats * 3);
      for (let i = 0; i < this.numSplats; i++) {
        const i3 = i * 3;
        const scaleX = Math.exp(scalesBytes[i3] / 16 - 10);
        const scaleY = Math.exp(scalesBytes[i3 + 1] / 16 - 10);
        const scaleZ = Math.exp(scalesBytes[i3 + 2] / 16 - 10);
        scalesCallback(i, scaleX, scaleY, scaleZ);
      }
    }
    {
      const quatBytes = this.reader.read(this.numSplats * 3);
      for (let i = 0; i < this.numSplats; i++) {
        const i3 = i * 3;
        const quatX = quatBytes[i3] / 127.5 - 1;
        const quatY = quatBytes[i3 + 1] / 127.5 - 1;
        const quatZ = quatBytes[i3 + 2] / 127.5 - 1;
        const quatW = Math.sqrt(
          Math.max(0, 1 - quatX * quatX - quatY * quatY - quatZ * quatZ),
        );
        quatCallback(i, quatX, quatY, quatZ, quatW);
      }
    }

    if (shCallback && this.shDegree >= 1) {
      const sh1 = new Float32Array(3 * 3);
      const sh2 = this.shDegree >= 2 ? new Float32Array(5 * 3) : undefined;
      const sh3 = this.shDegree >= 3 ? new Float32Array(7 * 3) : undefined;
      const shBytes = this.reader.read(
        this.numSplats * SH_DEGREE_TO_VECS[this.shDegree] * 3,
      );

      let offset = 0;
      for (let i = 0; i < this.numSplats; i++) {
        for (let j = 0; j < 9; ++j) {
          sh1[j] = (shBytes[offset + j] - 128) / 128;
        }
        offset += 9;
        if (sh2) {
          for (let j = 0; j < 15; ++j) {
            sh2[j] = (shBytes[offset + j] - 128) / 128;
          }
          offset += 15;
        }
        if (sh3) {
          for (let j = 0; j < 21; ++j) {
            sh3[j] = (shBytes[offset + j] - 128) / 128;
          }
          offset += 21;
        }
        shCallback(i, sh1, sh2, sh3);
      }
    }
  }
}

const SH_DEGREE_TO_VECS: Record<number, number> = { 1: 3, 2: 8, 3: 15 };
const SH_C0 = 0.28209479177387814;
