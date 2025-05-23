import { Dyno } from "./base";
import type { DynoVal } from "./value";

export const transformPos = (
  position: DynoVal<"vec3">,
  {
    scale,
    scales,
    rotate,
    translate,
  }: {
    scale?: DynoVal<"float">;
    scales?: DynoVal<"vec3">;
    rotate?: DynoVal<"vec4">;
    translate?: DynoVal<"vec3">;
  },
): DynoVal<"vec3"> => {
  return new TransformPosition({ position, scale, scales, rotate, translate })
    .outputs.position;
};
export const transformRay = (
  ray: DynoVal<"vec3">,
  {
    scale,
    scales,
    rotate,
  }: {
    scale?: DynoVal<"float">;
    scales?: DynoVal<"vec3">;
    rotate?: DynoVal<"vec4">;
  },
): DynoVal<"vec3"> => {
  return new TransformRay({ ray, scale, scales, rotate }).outputs.ray;
};
export const transformQuat = (
  quaternion: DynoVal<"vec4">,
  { rotate }: { rotate?: DynoVal<"vec4"> },
): DynoVal<"vec4"> => {
  return new TransformQuaternion({ quaternion, rotate }).outputs.quaternion;
};

export class TransformPosition extends Dyno<
  {
    position: "vec3";
    scale: "float";
    scales: "vec3";
    rotate: "vec4";
    translate: "vec3";
  },
  { position: "vec3" }
> {
  constructor({
    position,
    scale,
    scales,
    rotate,
    translate,
  }: {
    position?: DynoVal<"vec3">;
    scale?: DynoVal<"float">;
    scales?: DynoVal<"vec3">;
    rotate?: DynoVal<"vec4">;
    translate?: DynoVal<"vec3">;
  }) {
    super({
      inTypes: {
        position: "vec3",
        scale: "float",
        scales: "vec3",
        rotate: "vec4",
        translate: "vec3",
      },
      outTypes: { position: "vec3" },
      inputs: { position, scale, scales, rotate, translate },
      statements: ({ inputs, outputs }) => {
        const { position } = outputs;
        if (!position) {
          return [];
        }
        const { scale, scales, rotate, translate } = inputs;
        return [
          `${position} = ${inputs.position ?? "vec3(0.0, 0.0, 0.0)"};`,
          !scale ? null : `${position} *= ${scale};`,
          !scales ? null : `${position} *= ${scales};`,
          !rotate ? null : `${position} = quatVec(${rotate}, ${position});`,
          !translate ? null : `${position} += ${translate};`,
        ].filter(Boolean) as string[];
      },
    });
  }
}

export class TransformRay extends Dyno<
  { ray: "vec3"; scale: "float"; scales: "vec3"; rotate: "vec4" },
  { ray: "vec3" }
> {
  constructor({
    ray,
    scale,
    scales,
    rotate,
  }: {
    ray?: DynoVal<"vec3">;
    scale?: DynoVal<"float">;
    scales?: DynoVal<"vec3">;
    rotate?: DynoVal<"vec4">;
  }) {
    super({
      inTypes: { ray: "vec3", scale: "float", scales: "vec3", rotate: "vec4" },
      outTypes: { ray: "vec3" },
      inputs: { ray, scale, scales, rotate },
      statements: ({ inputs, outputs }) => {
        const { ray } = outputs;
        if (!ray) {
          return [];
        }
        const { scale, scales, rotate } = inputs;
        return [
          `${ray} = ${inputs.ray ?? "vec3(0.0, 0.0, 0.0)"};`,
          !scale ? null : `${ray} *= ${scale};`,
          !scales ? null : `${ray} *= ${scales};`,
          !rotate ? null : `${ray} = quatVec(${rotate}, ${ray});`,
        ].filter(Boolean) as string[];
      },
    });
  }
}

export class TransformQuaternion extends Dyno<
  { quaternion: "vec4"; rotate: "vec4" },
  { quaternion: "vec4" }
> {
  constructor({
    quaternion,
    rotate,
  }: { quaternion?: DynoVal<"vec4">; rotate?: DynoVal<"vec4"> }) {
    super({
      inTypes: { quaternion: "vec4", rotate: "vec4" },
      outTypes: { quaternion: "vec4" },
      inputs: { quaternion, rotate },
      statements: ({ inputs, outputs }) => {
        const { quaternion } = outputs;
        if (!quaternion) {
          return [];
        }
        return [
          `${quaternion} = ${inputs.quaternion ?? "vec4(0.0, 0.0, 0.0, 1.0)"};`,
          !rotate
            ? null
            : `${quaternion} = quatQuat(${inputs.rotate}, ${quaternion});`,
        ].filter(Boolean) as string[];
      },
    });
  }
}
