import { FileLoader, Loader, type LoadingManager } from "three";
import { PackedSplats } from "./PackedSplats";
import { SplatMesh } from "./SplatMesh";
import { PlyReader } from "./ply";
import { withWorker } from "./splatWorker";
import { decompressPartialGzip, getTextureSize } from "./utils";

// SplatLoader implements the THREE.Loader interface and supports loading a variety
// of differeng Gsplat file formats. Formats .PLY and .SPZ can be auto-detected
// from the file contents, while .SPLAT and .KSPLAT require either having the
// appropriate file extension as part of the path, or it can be explicitly set
// in the loader using the fileType property.

export class SplatLoader extends Loader {
  fileLoader: FileLoader;
  fileType?: SplatFileType;

  constructor(manager?: LoadingManager) {
    super(manager);
    this.fileLoader = new FileLoader(manager);
  }

  load(
    url: string,
    onLoad?: (decoded: PackedSplats) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (error: unknown) => void,
  ) {
    this.fileLoader.setResponseType("arraybuffer");
    this.fileLoader.setCrossOrigin(this.crossOrigin);
    this.fileLoader.setWithCredentials(this.withCredentials);
    this.fileLoader.setPath(this.path);
    this.fileLoader.setResourcePath(this.resourcePath);
    this.fileLoader.setRequestHeader(this.requestHeader);
    this.fileLoader.load(
      url,
      async (response) => {
        if (onLoad) {
          const input = response as ArrayBuffer;
          const decoded = await unpackSplats({
            input,
            fileType: this.fileType,
            pathOrUrl: url,
          });
          onLoad(new PackedSplats(decoded));
        }
      },
      onProgress,
      onError,
    );
  }

  async loadAsync(
    url: string,
    onProgress?: (event: ProgressEvent) => void,
  ): Promise<PackedSplats> {
    return new Promise((resolve, reject) => {
      this.load(
        url,
        (decoded) => {
          resolve(decoded);
        },
        onProgress,
        reject,
      );
    });
  }

  parse(packedSplats: PackedSplats): SplatMesh {
    return new SplatMesh({ packedSplats });
  }
}

export enum SplatFileType {
  PLY = "ply",
  WLG0 = "wlg0",
  SPZ = "spz",
  SPLAT = "splat",
  KSPLAT = "ksplat",
}

export function getSplatFileType(
  fileBytes: Uint8Array,
): SplatFileType | undefined {
  const view = new DataView(fileBytes.buffer);
  if ((view.getUint32(0, true) & 0x00ffffff) === 0x00796c70) {
    return SplatFileType.PLY;
  }
  if (view.getUint32(0, true) === 0x30474c57) {
    return SplatFileType.WLG0;
  }
  if ((view.getUint32(0, true) & 0x00ffffff) === 0x00088b1f) {
    // Gzipped file, unpack beginning to check magic number
    const header = decompressPartialGzip(fileBytes, 4);
    const gView = new DataView(header.buffer);
    if (gView.getUint32(0, true) === 0x5053474e) {
      return SplatFileType.SPZ;
    }
    // Unknown Gzipped file type
    return undefined;
  }
  // Unknown file type
  return undefined;
}

// Returns the lowercased file extension from a path or URL
export function getFileExtension(pathOrUrl: string): string {
  const noTrailing = pathOrUrl.split(/[?#]/, 1)[0];
  const lastSlash = Math.max(
    noTrailing.lastIndexOf("/"),
    noTrailing.lastIndexOf("\\"),
  );
  const filename = noTrailing.slice(lastSlash + 1);
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === filename.length - 1) {
    return ""; // No extension
  }
  return filename.slice(lastDot + 1).toLowerCase();
}

export async function unpackSplats({
  input,
  fileType,
  pathOrUrl,
}: {
  input: Uint8Array | ArrayBuffer;
  fileType?: SplatFileType;
  pathOrUrl?: string;
}): Promise<{
  packedArray: Uint32Array;
  numSplats: number;
  extra?: Record<string, unknown>;
}> {
  const fileBytes =
    input instanceof ArrayBuffer ? new Uint8Array(input) : input;
  let splatFileType = fileType;
  if (!fileType) {
    splatFileType = getSplatFileType(fileBytes);
    if (!splatFileType && pathOrUrl) {
      const extension = getFileExtension(pathOrUrl);
      if (extension === "ply") {
        splatFileType = SplatFileType.PLY;
      } else if (extension === "wlg") {
        splatFileType = SplatFileType.WLG0;
      } else if (extension === "spz") {
        splatFileType = SplatFileType.SPZ;
      } else if (extension === "splat") {
        splatFileType = SplatFileType.SPLAT;
      } else if (extension === "ksplat") {
        splatFileType = SplatFileType.KSPLAT;
      }
    }
  }

  if (splatFileType === SplatFileType.WLG0) {
    return await withWorker(async (worker) => {
      const { packedArray, numSplats } = (await worker.call("decodeWlg", {
        fileBytes,
      })) as { packedArray: Uint32Array; numSplats: number };
      return { packedArray, numSplats };
    });
  }
  if (splatFileType === SplatFileType.PLY) {
    const ply = new PlyReader({ fileBytes });
    await ply.parseHeader();
    const numSplats = ply.numSplats;
    const maxSplats = getTextureSize(numSplats).maxSplats;
    const args = { fileBytes, packedArray: new Uint32Array(maxSplats * 4) };
    return await withWorker(async (worker) => {
      const { packedArray, numSplats, extra } = (await worker.call(
        "unpackPly",
        args,
      )) as {
        packedArray: Uint32Array;
        numSplats: number;
        extra: Record<string, unknown>;
      };
      return { packedArray, numSplats, extra };
    });
  }
  if (splatFileType === SplatFileType.SPZ) {
    return await withWorker(async (worker) => {
      const { packedArray, numSplats, extra } = (await worker.call(
        "decodeSpz",
        {
          fileBytes,
        },
      )) as {
        packedArray: Uint32Array;
        numSplats: number;
        extra: Record<string, unknown>;
      };
      return { packedArray, numSplats, extra };
    });
  }
  if (splatFileType === SplatFileType.SPLAT) {
    return await withWorker(async (worker) => {
      const { packedArray, numSplats } = (await worker.call("decodeAntiSplat", {
        fileBytes,
      })) as { packedArray: Uint32Array; numSplats: number };
      return { packedArray, numSplats };
    });
  }
  if (splatFileType === SplatFileType.KSPLAT) {
    return await withWorker(async (worker) => {
      const { packedArray, numSplats, extra } = (await worker.call(
        "decodeKsplat",
        { fileBytes },
      )) as {
        packedArray: Uint32Array;
        numSplats: number;
        extra: Record<string, unknown>;
      };
      return { packedArray, numSplats, extra };
    });
  }
  throw new Error("Unknown splat file type");
}
