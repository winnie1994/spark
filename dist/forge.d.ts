declare module "dyno/types" {
    import type * as THREE from "three";
    export type BoolTypes = "bool" | "bvec2" | "bvec3" | "bvec4";
    export type IntTypes = "int" | "ivec2" | "ivec3" | "ivec4";
    export type UintTypes = "uint" | "uvec2" | "uvec3" | "uvec4";
    export type AllIntTypes = IntTypes | UintTypes;
    export type FloatTypes = "float" | "vec2" | "vec3" | "vec4";
    export type ScalarTypes = "uint" | "int" | "float";
    export type Vector2Types = "vec2" | "ivec2" | "uvec2";
    export type Vector3Types = "vec3" | "ivec3" | "uvec3";
    export type Vector4Types = "vec4" | "ivec4" | "uvec4";
    export type VectorTypes = Vector2Types | Vector3Types | Vector4Types;
    export type MatFloatTypes = "mat2" | "mat2x2" | "mat2x3" | "mat2x4" | "mat3" | "mat3x2" | "mat3x3" | "mat3x4" | "mat4" | "mat4x2" | "mat4x3" | "mat4x4";
    export type SquareMatTypes = "mat2" | "mat3" | "mat4" | "mat2x2" | "mat3x3" | "mat4x4";
    export type AllFloatTypes = FloatTypes | MatFloatTypes;
    export type SignedTypes = IntTypes | FloatTypes;
    export type AllSignedTypes = SignedTypes | MatFloatTypes;
    export type ValueTypes = FloatTypes | IntTypes | UintTypes;
    export type AllValueTypes = AllFloatTypes | IntTypes | UintTypes;
    export type SimpleTypes = BoolTypes | AllValueTypes;
    export type VectorElementType<A extends VectorTypes> = A extends FloatTypes ? "float" : A extends IntTypes ? "int" : A extends UintTypes ? "uint" : never;
    export type SameSizeVec<T extends ValueTypes> = T extends ScalarTypes ? "float" : T extends "vec2" | "ivec2" | "uvec2" ? "vec2" : T extends "vec3" | "ivec3" | "uvec3" ? "vec3" : T extends "vec4" | "ivec4" | "uvec4" ? "vec4" : never;
    export type SameSizeUvec<T extends ValueTypes> = T extends ScalarTypes ? "uint" : T extends "vec2" | "ivec2" | "uvec2" ? "uvec2" : T extends "vec3" | "ivec3" | "uvec3" ? "uvec3" : T extends "vec4" | "ivec4" | "uvec4" ? "uvec4" : never;
    export type SameSizeIvec<T extends ValueTypes> = T extends ScalarTypes ? "int" : T extends "vec2" | "ivec2" | "uvec2" ? "ivec2" : T extends "vec3" | "ivec3" | "uvec3" ? "ivec3" : T extends "vec4" | "ivec4" | "uvec4" ? "ivec4" : never;
    export type SamplerTypes = "sampler2D" | "sampler2DArray" | "sampler3D" | "samplerCube";
    export type UsamplerTypes = "usampler2D" | "usampler2DArray" | "usampler3D" | "usamplerCube";
    export type IsamplerTypes = "isampler2D" | "isampler2DArray" | "isampler3D" | "isamplerCube";
    export type NormalSamplerTypes = SamplerTypes | UsamplerTypes | IsamplerTypes;
    export type SamplerShadowTypes = "sampler2DShadow" | "sampler2DArrayShadow" | "samplerCubeShadow";
    export type AllSamplerTypes = NormalSamplerTypes | SamplerShadowTypes;
    export type Sampler2DTypes = "sampler2D" | "usampler2D" | "isampler2D" | "sampler2DShadow";
    export type Sampler2DArrayTypes = "sampler2DArray" | "usampler2DArray" | "isampler2DArray" | "sampler2DArrayShadow";
    export type Sampler3DTypes = "sampler3D" | "usampler3D" | "isampler3D";
    export type SamplerCubeTypes = "samplerCube" | "usamplerCube" | "isamplerCube" | "samplerCubeShadow";
    export function isBoolType(type: DynoType): boolean;
    export function isScalarType(type: DynoType): boolean;
    export function isIntType(type: DynoType): boolean;
    export function isUintType(type: DynoType): boolean;
    export function isFloatType(type: DynoType): boolean;
    export function isMatFloatType(type: DynoType): boolean;
    export function isAllFloatType(type: DynoType): boolean;
    export function isVector2Type(type: DynoType): boolean;
    export function isVector3Type(type: DynoType): boolean;
    export function isVector4Type(type: DynoType): boolean;
    export function isVectorType(type: DynoType): boolean;
    export function isMat2(type: DynoType): boolean;
    export function isMat3(type: DynoType): boolean;
    export function isMat4(type: DynoType): boolean;
    export function vectorElementType<A extends VectorTypes>(type: A): VectorElementType<A>;
    export function vectorDim<A extends VectorTypes>(type: A): number;
    export function sameSizeVec<T extends ValueTypes>(type: T): SameSizeVec<T>;
    export function sameSizeUvec<T extends ValueTypes>(type: T): SameSizeUvec<T>;
    export function sameSizeIvec<T extends ValueTypes>(type: T): SameSizeIvec<T>;
    export type BaseType = SimpleTypes | AllSamplerTypes;
    export type UserType = {
        type: string;
    };
    export type DynoType = BaseType | UserType;
    export type DynoJsType<T extends DynoType> = T extends "bool" ? boolean : T extends "uint" ? number : T extends "int" ? number : T extends "float" ? number : T extends "bvec2" ? [boolean, boolean] : T extends "uvec2" ? THREE.Vector2 | [number, number] | Uint32Array : T extends "ivec2" ? THREE.Vector2 | [number, number] | Int32Array : T extends "vec2" ? THREE.Vector2 | [number, number] | Float32Array : T extends "bvec3" ? [boolean, boolean, boolean] : T extends "uvec3" ? THREE.Vector3 | [number, number, number] | Uint32Array : T extends "ivec3" ? THREE.Vector3 | [number, number, number] | Int32Array : T extends "vec3" ? THREE.Vector3 | THREE.Color | [number, number, number] | Float32Array : T extends "bvec4" ? [boolean, boolean, boolean, boolean] : T extends "uvec4" ? THREE.Vector4 | [number, number, number, number] | Uint32Array : T extends "ivec4" ? THREE.Vector4 | [number, number, number, number] | Int32Array : T extends "vec4" ? THREE.Vector4 | THREE.Quaternion | [number, number, number, number] | Float32Array : T extends "mat2" ? THREE.Matrix2 | Float32Array : T extends "mat2x2" ? THREE.Matrix2 | Float32Array : T extends "mat2x3" ? Float32Array : T extends "mat2x4" ? Float32Array : T extends "mat3" ? THREE.Matrix3 | Float32Array : T extends "mat3x2" ? Float32Array : T extends "mat3x3" ? THREE.Matrix3 | Float32Array : T extends "mat3x4" ? Float32Array : T extends "mat4" ? THREE.Matrix4 | Float32Array : T extends "mat4x2" ? Float32Array : T extends "mat4x3" ? Float32Array : T extends "mat4x4" ? THREE.Matrix4 | Float32Array : T extends "usampler2D" ? THREE.Texture : T extends "isampler2D" ? THREE.Texture : T extends "sampler2D" ? THREE.Texture : T extends "sampler2DShadow" ? THREE.Texture : T extends "usampler2DArray" ? THREE.DataArrayTexture : T extends "isampler2DArray" ? THREE.DataArrayTexture : T extends "sampler2DArray" ? THREE.DataArrayTexture : T extends "sampler2DArrayShadow" ? THREE.Texture : T extends "usampler3D" ? THREE.DataArrayTexture : T extends "isampler3D" ? THREE.DataArrayTexture : T extends "sampler3D" ? THREE.DataArrayTexture : T extends "usamplerCube" ? THREE.DataArrayTexture : T extends "isamplerCube" ? THREE.DataArrayTexture : T extends "samplerCube" ? THREE.DataArrayTexture : T extends "samplerCubeShadow" ? THREE.Texture : unknown;
    export function typeLiteral(type: DynoType): string;
    export function numberAsInt(value: number): string;
    export function numberAsUint(value: number): string;
    export function numberAsFloat(value: number): string;
}
declare module "dyno/value" {
    import type { Dyno, IOTypes } from "dyno/base";
    import { type DynoJsType, type DynoType, type SimpleTypes } from "dyno/types";
    export type DynoVal<T extends DynoType> = DynoValue<T> | HasDynoOut<T>;
    export function valType<T extends DynoType>(val: DynoVal<T>): T;
    export interface HasDynoOut<T extends DynoType> {
        dynoOut(): DynoValue<T>;
    }
    export class DynoValue<T extends DynoType> {
        type: T;
        private __isDynoValue;
        constructor(type: T);
    }
    export class DynoOutput<T extends DynoType, InTypes extends IOTypes, OutTypes extends IOTypes> extends DynoValue<T> {
        dyno: Dyno<InTypes, OutTypes>;
        key: string;
        constructor(dyno: Dyno<InTypes, OutTypes>, key: string);
    }
    export class DynoLiteral<T extends DynoType> extends DynoValue<T> {
        literal: string;
        constructor(type: T, literal: string);
        getLiteral(): string;
    }
    export function dynoLiteral<T extends DynoType>(type: T, literal: string): DynoLiteral<T>;
    export class DynoConst<T extends DynoType> extends DynoLiteral<T> {
        value: DynoJsType<T>;
        constructor(type: T, value: DynoJsType<T>);
        getLiteral(): string;
    }
    export function dynoConst<T extends DynoType>(type: T, value: DynoJsType<T>): DynoConst<T>;
    export function literalZero(type: SimpleTypes): string;
    export function literalOne(type: SimpleTypes): string;
    export function literalNegOne(type: SimpleTypes): string;
}
declare module "dyno/base" {
    import type { IUniform } from "three";
    import type { DynoType } from "dyno/types";
    import { type DynoVal, DynoValue, type HasDynoOut } from "dyno/value";
    export class Compilation {
        globals: Set<string>;
        statements: string[];
        uniforms: Record<string, IUniform>;
        declares: Set<string>;
        updaters: (() => void)[];
        sequence: number;
        indent: string;
        constructor({ indent }?: {
            indent?: string;
        });
        nextSequence(): number;
    }
    export type IOTypes = Record<string, DynoType>;
    type GenerateContext<InTypes extends IOTypes, OutTypes extends IOTypes> = {
        inputs: {
            [K in keyof InTypes]?: string;
        };
        outputs: {
            [K in keyof OutTypes]?: string;
        };
        compile: Compilation;
    };
    export class Dyno<InTypes extends IOTypes, OutTypes extends IOTypes> {
        inTypes: InTypes;
        outTypes: OutTypes;
        inputs: {
            [K in keyof InTypes]?: DynoVal<InTypes[K]>;
        };
        update?: () => void;
        globals?: ({ inputs, outputs, compile, }: GenerateContext<InTypes, OutTypes>) => string[];
        statements?: ({ inputs, outputs, compile, }: GenerateContext<InTypes, OutTypes>) => string[];
        generate: ({ inputs, outputs, compile, }: GenerateContext<InTypes, OutTypes>) => {
            globals?: string[];
            statements?: string[];
            uniforms?: Record<string, IUniform>;
        };
        constructor({ inTypes, outTypes, inputs, update, globals, statements, generate, }: {
            inTypes?: InTypes;
            outTypes?: OutTypes;
            inputs?: {
                [K in keyof InTypes]?: DynoVal<InTypes[K]>;
            };
            update?: () => void;
            globals?: ({ inputs, outputs, compile, }: GenerateContext<InTypes, OutTypes>) => string[];
            statements?: ({ inputs, outputs, compile, }: GenerateContext<InTypes, OutTypes>) => string[];
            generate?: ({ inputs, outputs, compile, }: GenerateContext<InTypes, OutTypes>) => {
                globals?: string[];
                statements?: string[];
                uniforms?: Record<string, IUniform>;
            };
        });
        get outputs(): {
            [K in keyof OutTypes]: DynoVal<OutTypes[K]>;
        };
        apply(inputs: {
            [K in keyof InTypes]?: DynoVal<InTypes[K]>;
        }): {
            [K in keyof OutTypes]: DynoVal<OutTypes[K]>;
        };
        compile({ inputs, outputs, compile, }: {
            inputs: {
                [K in keyof InTypes]?: string;
            };
            outputs: {
                [K in keyof OutTypes]?: string;
            };
            compile: Compilation;
        }): string[];
    }
    export type DynoBlockType<InTypes extends IOTypes, OutTypes extends IOTypes> = (inputs: {
        [K in keyof InTypes]?: DynoVal<InTypes[K]>;
    }, outputs: {
        [K in keyof OutTypes]?: DynoVal<OutTypes[K]>;
    }, { roots }: {
        roots: Dyno<InTypes, OutTypes>[];
    }) => {
        [K in keyof OutTypes]?: DynoVal<OutTypes[K]>;
    } | undefined;
    export class DynoBlock<InTypes extends IOTypes, OutTypes extends IOTypes> extends Dyno<InTypes, OutTypes> {
        construct: DynoBlockType<InTypes, OutTypes>;
        constructor({ inTypes, outTypes, inputs, update, globals, construct, }: {
            inTypes?: InTypes;
            outTypes?: OutTypes;
            inputs?: {
                [K in keyof InTypes]?: DynoVal<InTypes[K]>;
            };
            update?: () => void;
            globals?: ({ inputs, outputs, compile, }: GenerateContext<InTypes, OutTypes>) => string[];
            construct: DynoBlockType<InTypes, OutTypes>;
        });
        generateBlock({ inputs, outputs, compile, }: {
            inputs: {
                [K in keyof InTypes]?: string;
            };
            outputs: {
                [K in keyof OutTypes]?: string;
            };
            compile: Compilation;
        }): {
            statements: string[];
        };
    }
    export function dynoBlock<InTypes extends Record<string, DynoType>, OutTypes extends Record<string, DynoType>>(inTypes: InTypes, outTypes: OutTypes, construct: DynoBlockType<InTypes, OutTypes>, { update, globals }?: {
        update?: () => void;
        globals?: () => string[];
    }): DynoBlock<InTypes, OutTypes>;
    export function dyno<InTypes extends Record<string, DynoType>, OutTypes extends Record<string, DynoType>>({ inTypes, outTypes, inputs, update, globals, statements, generate, }: {
        inTypes: InTypes;
        outTypes: OutTypes;
        inputs?: {
            [K in keyof InTypes]?: DynoVal<InTypes[K]>;
        };
        update?: () => void;
        globals?: ({ inputs, outputs, compile, }: GenerateContext<InTypes, OutTypes>) => string[];
        statements?: ({ inputs, outputs, compile, }: GenerateContext<InTypes, OutTypes>) => string[];
        generate?: ({ inputs, outputs, compile, }: GenerateContext<InTypes, OutTypes>) => {
            globals?: string[];
            statements?: string[];
            uniforms?: Record<string, IUniform>;
        };
    }): Dyno<InTypes, OutTypes>;
    export function dynoDeclare(name: string, type: DynoType, count?: number): string;
    export function unindentLines(s: string): string[];
    export function unindent(s: string): string;
    export class UnaryOp<A extends DynoType, OutType extends DynoType, OutKey extends string> extends Dyno<{
        a: A;
    }, {
        [key in OutKey]: OutType;
    }> implements HasDynoOut<OutType> {
        constructor({ a, outKey, outTypeFunc, }: {
            a: DynoVal<A>;
            outKey: OutKey;
            outTypeFunc: (aType: A) => OutType;
        });
        outKey: OutKey;
        dynoOut(): DynoValue<OutType>;
    }
    export class BinaryOp<A extends DynoType, B extends DynoType, OutType extends DynoType, OutKey extends string> extends Dyno<{
        a: A;
        b: B;
    }, {
        [key in OutKey]: OutType;
    }> implements HasDynoOut<OutType> {
        constructor({ a, b, outKey, outTypeFunc, }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
            outKey: OutKey;
            outTypeFunc: (aType: A, bType: B) => OutType;
        });
        outKey: OutKey;
        dynoOut(): DynoValue<OutType>;
    }
    export class TrinaryOp<A extends DynoType, B extends DynoType, C extends DynoType, OutType extends DynoType, OutKey extends string> extends Dyno<{
        a: A;
        b: B;
        c: C;
    }, {
        [key in OutKey]: OutType;
    }> implements HasDynoOut<OutType> {
        constructor({ a, b, c, outKey, outTypeFunc, }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
            c: DynoVal<C>;
            outKey: OutKey;
            outTypeFunc: (aType: A, bType: B, cType: C) => OutType;
        });
        outKey: OutKey;
        dynoOut(): DynoValue<OutType>;
    }
}
declare module "dyno/splats" {
    import { Dyno, UnaryOp } from "dyno/base";
    import { type DynoVal, type DynoValue, type HasDynoOut } from "dyno/value";
    export const Gsplat: {
        type: "Gsplat";
    };
    export const TPackedSplats: {
        type: "PackedSplats";
    };
    export const numPackedSplats: (packedSplats: DynoVal<typeof TPackedSplats>) => DynoVal<"int">;
    export const readPackedSplat: (packedSplats: DynoVal<typeof TPackedSplats>, index: DynoVal<"int">) => DynoVal<typeof Gsplat>;
    export const readPackedSplatRange: (packedSplats: DynoVal<typeof TPackedSplats>, index: DynoVal<"int">, base: DynoVal<"int">, count: DynoVal<"int">) => DynoVal<typeof Gsplat>;
    export const splitGsplat: (gsplat: DynoVal<typeof Gsplat>) => SplitGsplat;
    export const combineGsplat: ({ gsplat, flags, index, center, scales, quaternion, rgba, rgb, opacity, x, y, z, r, g, b, }: {
        gsplat?: DynoVal<typeof Gsplat>;
        flags?: DynoVal<"uint">;
        index?: DynoVal<"int">;
        center?: DynoVal<"vec3">;
        scales?: DynoVal<"vec3">;
        quaternion?: DynoVal<"vec4">;
        rgba?: DynoVal<"vec4">;
        rgb?: DynoVal<"vec3">;
        opacity?: DynoVal<"float">;
        x?: DynoVal<"float">;
        y?: DynoVal<"float">;
        z?: DynoVal<"float">;
        r?: DynoVal<"float">;
        g?: DynoVal<"float">;
        b?: DynoVal<"float">;
    }) => DynoVal<typeof Gsplat>;
    export const gsplatNormal: (gsplat: DynoVal<typeof Gsplat>) => DynoVal<"vec3">;
    export const transformGsplat: (gsplat: DynoVal<typeof Gsplat>, { scale, rotate, translate, recolor, }: {
        scale?: DynoVal<"float">;
        rotate?: DynoVal<"vec4">;
        translate?: DynoVal<"vec3">;
        recolor?: DynoVal<"vec4">;
    }) => DynoVal<typeof Gsplat>;
    export const defineGsplat: string;
    export const definePackedSplats: string;
    export class NumPackedSplats extends UnaryOp<typeof TPackedSplats, "int", "numSplats"> {
        constructor({ packedSplats, }: {
            packedSplats: DynoVal<typeof TPackedSplats>;
        });
    }
    export class ReadPackedSplat extends Dyno<{
        packedSplats: typeof TPackedSplats;
        index: "int";
    }, {
        gsplat: typeof Gsplat;
    }> implements HasDynoOut<typeof Gsplat> {
        constructor({ packedSplats, index, }: {
            packedSplats?: DynoVal<typeof TPackedSplats>;
            index?: DynoVal<"int">;
        });
        dynoOut(): DynoValue<typeof Gsplat>;
    }
    export class ReadPackedSplatRange extends Dyno<{
        packedSplats: typeof TPackedSplats;
        index: "int";
        base: "int";
        count: "int";
    }, {
        gsplat: typeof Gsplat;
    }> implements HasDynoOut<typeof Gsplat> {
        constructor({ packedSplats, index, base, count, }: {
            packedSplats?: DynoVal<typeof TPackedSplats>;
            index?: DynoVal<"int">;
            base?: DynoVal<"int">;
            count?: DynoVal<"int">;
        });
        dynoOut(): DynoValue<typeof Gsplat>;
    }
    export class SplitGsplat extends Dyno<{
        gsplat: typeof Gsplat;
    }, {
        flags: "uint";
        active: "bool";
        index: "int";
        center: "vec3";
        scales: "vec3";
        quaternion: "vec4";
        rgba: "vec4";
        rgb: "vec3";
        opacity: "float";
        x: "float";
        y: "float";
        z: "float";
        r: "float";
        g: "float";
        b: "float";
    }> {
        constructor({ gsplat }: {
            gsplat?: DynoVal<typeof Gsplat>;
        });
    }
    export class CombineGsplat extends Dyno<{
        gsplat: typeof Gsplat;
        flags: "uint";
        index: "int";
        center: "vec3";
        scales: "vec3";
        quaternion: "vec4";
        rgba: "vec4";
        rgb: "vec3";
        opacity: "float";
        x: "float";
        y: "float";
        z: "float";
        r: "float";
        g: "float";
        b: "float";
    }, {
        gsplat: typeof Gsplat;
    }> implements HasDynoOut<typeof Gsplat> {
        constructor({ gsplat, flags, index, center, scales, quaternion, rgba, rgb, opacity, x, y, z, r, g, b, }: {
            gsplat?: DynoVal<typeof Gsplat>;
            flags?: DynoVal<"uint">;
            index?: DynoVal<"int">;
            center?: DynoVal<"vec3">;
            scales?: DynoVal<"vec3">;
            quaternion?: DynoVal<"vec4">;
            rgba?: DynoVal<"vec4">;
            rgb?: DynoVal<"vec3">;
            opacity?: DynoVal<"float">;
            x?: DynoVal<"float">;
            y?: DynoVal<"float">;
            z?: DynoVal<"float">;
            r?: DynoVal<"float">;
            g?: DynoVal<"float">;
            b?: DynoVal<"float">;
        });
        dynoOut(): DynoValue<typeof Gsplat>;
    }
    export const defineGsplatNormal: string;
    export class GsplatNormal extends UnaryOp<typeof Gsplat, "vec3", "normal"> {
        constructor({ gsplat }: {
            gsplat: DynoVal<typeof Gsplat>;
        });
    }
    export class TransformGsplat extends Dyno<{
        gsplat: typeof Gsplat;
        scale: "float";
        rotate: "vec4";
        translate: "vec3";
        recolor: "vec4";
    }, {
        gsplat: typeof Gsplat;
    }> implements HasDynoOut<typeof Gsplat> {
        constructor({ gsplat, scale, rotate, translate, recolor, }: {
            gsplat?: DynoVal<typeof Gsplat>;
            scale?: DynoVal<"float">;
            rotate?: DynoVal<"vec4">;
            translate?: DynoVal<"vec3">;
            recolor?: DynoVal<"vec4">;
        });
        dynoOut(): DynoValue<typeof Gsplat>;
    }
}
declare module "dyno/output" {
    import { Dyno } from "dyno/base";
    import { Gsplat } from "dyno/splats";
    import { type DynoVal, type DynoValue, type HasDynoOut } from "dyno/value";
    export const outputPackedSplat: (gsplat: DynoVal<typeof Gsplat>) => OutputPackedSplat;
    export const outputRgba8: (rgba8: DynoVal<"vec4">) => OutputRgba8;
    export class OutputPackedSplat extends Dyno<{
        gsplat: typeof Gsplat;
    }, {
        output: "uvec4";
    }> implements HasDynoOut<"uvec4"> {
        constructor({ gsplat }: {
            gsplat?: DynoVal<typeof Gsplat>;
        });
        dynoOut(): DynoValue<"uvec4">;
    }
    export class OutputRgba8 extends Dyno<{
        rgba8: "vec4";
    }, {
        rgba8: "vec4";
    }> implements HasDynoOut<"vec4"> {
        constructor({ rgba8 }: {
            rgba8?: DynoVal<"vec4">;
        });
        dynoOut(): DynoValue<"vec4">;
    }
}
declare module "dyno/uniforms" {
    import { Dyno } from "dyno/base";
    import type { DynoJsType, DynoType } from "dyno/types";
    import { type DynoValue, type HasDynoOut } from "dyno/value";
    export const uniform: <V extends DynoJsType<DynoType>>(key: string, type: DynoType, value: V) => DynoUniform<DynoType, string, V>;
    export const dynoBool: (value?: boolean, key?: string) => DynoBool<string>;
    export const dynoUint: (value?: number, key?: string) => DynoUint<string>;
    export const dynoInt: (value?: number, key?: string) => DynoInt<string>;
    export const dynoFloat: (value?: number, key?: string) => DynoFloat<string>;
    export const dynoBvec2: <V extends DynoJsType<"bvec2">>(value: V, key?: string) => DynoBvec2<string, V>;
    export const dynoUvec2: <V extends DynoJsType<"uvec2">>(value: V, key?: string) => DynoUvec2<string, V>;
    export const dynoIvec2: <V extends DynoJsType<"ivec2">>(value: V, key?: string) => DynoIvec2<string, V>;
    export const dynoVec2: <V extends DynoJsType<"vec2">>(value: V, key?: string) => DynoVec2<string, V>;
    export const dynoBvec3: <V extends DynoJsType<"bvec3">>(value: V, key?: string) => DynoBvec3<string, V>;
    export const dynoUvec3: <V extends DynoJsType<"uvec3">>(value: V, key?: string) => DynoUvec3<V, string>;
    export const dynoIvec3: <V extends DynoJsType<"ivec3">>(value: V, key?: string) => DynoIvec3<V, string>;
    export const dynoVec3: <V extends DynoJsType<"vec3">>(value: V, key?: string) => DynoVec3<V, string>;
    export const dynoBvec4: <V extends DynoJsType<"bvec4">>(value: V, key?: string) => DynoBvec4<string, V>;
    export const dynoUvec4: <V extends DynoJsType<"uvec4">>(value: V, key?: string) => DynoUvec4<string, V>;
    export const dynoIvec4: <V extends DynoJsType<"ivec4">>(value: V, key?: string) => DynoIvec4<string, V>;
    export const dynoVec4: <V extends DynoJsType<"vec4">>(value: V, key?: string) => DynoVec4<V, string>;
    export const dynoMat2: <V extends DynoJsType<"mat2">>(value: V, key?: string) => DynoMat2<string, V>;
    export const dynoMat2x2: <V extends DynoJsType<"mat2x2">>(value: V, key?: string) => DynoMat2x2<string, V>;
    export const dynoMat2x3: <V extends DynoJsType<"mat2x3">>(value: V, key?: string) => DynoMat2x3<string, V>;
    export const dynoMat2x4: <V extends DynoJsType<"mat2x4">>(value: V, key?: string) => DynoMat2x4<string, V>;
    export const dynoMat3: <V extends DynoJsType<"mat3">>(value: V, key?: string) => DynoMat3<string, V>;
    export const dynoMat3x2: <V extends DynoJsType<"mat3x2">>(value: V, key?: string) => DynoMat3x2<string, V>;
    export const dynoMat3x3: <V extends DynoJsType<"mat3x3">>(value: V, key?: string) => DynoMat3x3<string, V>;
    export const dynoMat3x4: <V extends DynoJsType<"mat3x4">>(value: V, key?: string) => DynoMat3x4<string, V>;
    export const dynoMat4: <V extends DynoJsType<"mat4">>(value: V, key?: string) => DynoMat4<string, V>;
    export const dynoMat4x2: <V extends DynoJsType<"mat4x2">>(value: V, key?: string) => DynoMat4x2<string, V>;
    export const dynoMat4x3: <V extends DynoJsType<"mat4x3">>(value: V, key?: string) => DynoMat4x3<string, V>;
    export const dynoMat4x4: <V extends DynoJsType<"mat4x4">>(value: V, key?: string) => DynoMat4x4<string, V>;
    export const dynoUsampler2D: <V extends DynoJsType<"usampler2D">>(value: V, key?: string) => DynoUsampler2D<string, V>;
    export const dynoIsampler2D: <V extends DynoJsType<"isampler2D">>(value: V, key?: string) => DynoIsampler2D<string, V>;
    export const dynoSampler2D: <V extends DynoJsType<"sampler2D">>(value: V, key?: string) => DynoSampler2D<string, V>;
    export const dynoUsampler2DArray: <V extends DynoJsType<"usampler2DArray">>(value: V, key?: string) => DynoUsampler2DArray<string, V>;
    export const dynoIsampler2DArray: <V extends DynoJsType<"isampler2DArray">>(key: string, value: V) => DynoIsampler2DArray<string, V>;
    export const dynoSampler2DArray: <V extends DynoJsType<"sampler2DArray">>(value: V, key?: string) => DynoSampler2DArray<string, V>;
    export const dynoUsampler3D: <V extends DynoJsType<"usampler3D">>(value: V, key?: string) => DynoUsampler3D<string, V>;
    export const dynoIsampler3D: <V extends DynoJsType<"isampler3D">>(value: V, key?: string) => DynoIsampler3D<string, V>;
    export const dynoSampler3D: <V extends DynoJsType<"sampler3D">>(value: V, key?: string) => DynoSampler3D<string, V>;
    export const dynoUsamplerCube: <V extends DynoJsType<"usamplerCube">>(value: V, key?: string) => DynoUsamplerCube<string, V>;
    export const dynoIsamplerCube: <V extends DynoJsType<"isamplerCube">>(value: V, key?: string) => DynoIsamplerCube<string, V>;
    export const dynoSamplerCube: <V extends DynoJsType<"samplerCube">>(value: V, key?: string) => DynoSamplerCube<string, V>;
    export const dynoSampler2DShadow: <V extends DynoJsType<"sampler2DShadow">>(value: V, key?: string) => DynoSampler2DShadow<string, V>;
    export const dynoSampler2DArrayShadow: <V extends DynoJsType<"sampler2DArrayShadow">>(value: V, key?: string) => DynoSampler2DArrayShadow<string, V>;
    export const dynoSamplerCubeShadow: <V extends DynoJsType<"samplerCubeShadow">>(value: V, key?: string) => DynoSamplerCubeShadow<string, V>;
    export class DynoUniform<T extends DynoType, K extends string = "value", V extends DynoJsType<T> = DynoJsType<T>> extends Dyno<Record<string, never>, {
        [key in K]: T;
    }> implements HasDynoOut<T> {
        type: T;
        count?: number;
        outKey: K;
        value: V;
        uniform: {
            value: V;
            type?: string;
        };
        constructor({ key, type, count, value, update, globals, }: {
            key?: K;
            type: T;
            count?: number;
            value: V;
            update?: (value: V) => V | undefined;
            globals?: ({ inputs, outputs, }: {
                inputs: unknown;
                outputs: {
                    [key in K]?: string;
                };
            }) => string[];
        });
        dynoOut(): DynoValue<T>;
    }
    export class DynoBool<K extends string> extends DynoUniform<"bool", K, boolean> {
        constructor({ key, value, update, }: {
            key?: K;
            value: boolean;
            update?: (value: boolean) => boolean | undefined;
        });
    }
    export class DynoUint<K extends string> extends DynoUniform<"uint", K, number> {
        constructor({ key, value, update, }: {
            key?: K;
            value: number;
            update?: (value: number) => number | undefined;
        });
    }
    export class DynoInt<K extends string> extends DynoUniform<"int", K, number> {
        constructor({ key, value, update, }: {
            key?: K;
            value: number;
            update?: (value: number) => number | undefined;
        });
    }
    export class DynoFloat<K extends string = "value"> extends DynoUniform<"float", K, number> {
        constructor({ key, value, update, }: {
            key?: K;
            value: number;
            update?: (value: number) => number | undefined;
        });
    }
    export class DynoBvec2<K extends string, V extends DynoJsType<"bvec2">> extends DynoUniform<"bvec2", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoUvec2<K extends string, V extends DynoJsType<"uvec2">> extends DynoUniform<"uvec2", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoIvec2<K extends string, V extends DynoJsType<"ivec2">> extends DynoUniform<"ivec2", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoVec2<K extends string, V extends DynoJsType<"vec2">> extends DynoUniform<"vec2", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoBvec3<K extends string, V extends DynoJsType<"bvec3">> extends DynoUniform<"bvec3", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoUvec3<V extends DynoJsType<"uvec3">, K extends string = "value"> extends DynoUniform<"uvec3", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoIvec3<V extends DynoJsType<"ivec3">, K extends string = "value"> extends DynoUniform<"ivec3", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoVec3<V extends DynoJsType<"vec3">, K extends string = "value"> extends DynoUniform<"vec3", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoBvec4<K extends string, V extends DynoJsType<"bvec4">> extends DynoUniform<"bvec4", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoUvec4<K extends string, V extends DynoJsType<"uvec4">> extends DynoUniform<"uvec4", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoIvec4<K extends string, V extends DynoJsType<"ivec4">> extends DynoUniform<"ivec4", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoVec4<V extends DynoJsType<"vec4">, K extends string = "value"> extends DynoUniform<"vec4", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat2<K extends string, V extends DynoJsType<"mat2">> extends DynoUniform<"mat2", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat2x2<K extends string, V extends DynoJsType<"mat2x2">> extends DynoUniform<"mat2x2", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat2x3<K extends string, V extends DynoJsType<"mat2x3">> extends DynoUniform<"mat2x3", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat2x4<K extends string, V extends DynoJsType<"mat2x4">> extends DynoUniform<"mat2x4", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat3<K extends string, V extends DynoJsType<"mat3">> extends DynoUniform<"mat3", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat3x2<K extends string, V extends DynoJsType<"mat3x2">> extends DynoUniform<"mat3x2", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat3x3<K extends string, V extends DynoJsType<"mat3x3">> extends DynoUniform<"mat3x3", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat3x4<K extends string, V extends DynoJsType<"mat3x4">> extends DynoUniform<"mat3x4", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat4<K extends string, V extends DynoJsType<"mat4">> extends DynoUniform<"mat4", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat4x2<K extends string, V extends DynoJsType<"mat4x2">> extends DynoUniform<"mat4x2", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat4x3<K extends string, V extends DynoJsType<"mat4x3">> extends DynoUniform<"mat4x3", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoMat4x4<K extends string, V extends DynoJsType<"mat4x4">> extends DynoUniform<"mat4x4", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoUsampler2D<K extends string, V extends DynoJsType<"usampler2D">> extends DynoUniform<"usampler2D", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoIsampler2D<K extends string, V extends DynoJsType<"isampler2D">> extends DynoUniform<"isampler2D", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoSampler2D<K extends string, V extends DynoJsType<"sampler2D">> extends DynoUniform<"sampler2D", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoUsampler2DArray<K extends string, V extends DynoJsType<"usampler2DArray">> extends DynoUniform<"usampler2DArray", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoIsampler2DArray<K extends string, V extends DynoJsType<"isampler2DArray">> extends DynoUniform<"isampler2DArray", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoSampler2DArray<K extends string, V extends DynoJsType<"sampler2DArray">> extends DynoUniform<"sampler2DArray", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoUsampler3D<K extends string, V extends DynoJsType<"usampler3D">> extends DynoUniform<"usampler3D", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoIsampler3D<K extends string, V extends DynoJsType<"isampler3D">> extends DynoUniform<"isampler3D", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoSampler3D<K extends string, V extends DynoJsType<"sampler3D">> extends DynoUniform<"sampler3D", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoUsamplerCube<K extends string, V extends DynoJsType<"usamplerCube">> extends DynoUniform<"usamplerCube", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoIsamplerCube<K extends string, V extends DynoJsType<"isamplerCube">> extends DynoUniform<"isamplerCube", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoSamplerCube<K extends string, V extends DynoJsType<"samplerCube">> extends DynoUniform<"samplerCube", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoSampler2DShadow<K extends string, V extends DynoJsType<"sampler2DShadow">> extends DynoUniform<"sampler2DShadow", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoSampler2DArrayShadow<K extends string, V extends DynoJsType<"sampler2DArrayShadow">> extends DynoUniform<"sampler2DArrayShadow", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
    export class DynoSamplerCubeShadow<K extends string, V extends DynoJsType<"samplerCubeShadow">> extends DynoUniform<"samplerCubeShadow", K, V> {
        constructor({ key, value, update, }: {
            key?: K;
            value: V;
            update?: (value: V) => V | undefined;
        });
    }
}
declare module "defines" {
    export const LN_SCALE_MIN = -9;
    export const LN_SCALE_MAX = 9;
    export const LN_RESCALE: number;
    export const SCALE_MIN: number;
    export const SCALE_MAX: number;
    export const SPLAT_TEX_WIDTH_BITS = 11;
    export const SPLAT_TEX_HEIGHT_BITS = 11;
    export const SPLAT_TEX_DEPTH_BITS = 11;
    export const SPLAT_TEX_LAYER_BITS: number;
    export const SPLAT_TEX_WIDTH: number;
    export const SPLAT_TEX_HEIGHT: number;
    export const SPLAT_TEX_DEPTH: number;
    export const SPLAT_TEX_MIN_HEIGHT = 1;
    export const SPLAT_TEX_WIDTH_MASK: number;
    export const SPLAT_TEX_HEIGHT_MASK: number;
    export const SPLAT_TEX_DEPTH_MASK: number;
    export const WASM_SPLAT_SORT = true;
}
declare module "utils" {
    import { Gunzip } from "fflate";
    import * as THREE from "three";
    export function floatBitsToUint(f: number): number;
    export function uintBitsToFloat(u: number): number;
    export function toHalf(f: number): number;
    export function fromHalf(h: number): number;
    export function floatToUint8(v: number): number;
    export function floatToSint8(v: number): number;
    export function Uint8ToFloat(v: number): number;
    export function Sint8ToFloat(v: number): number;
    export class DataCache {
        maxItems: number;
        asyncFetch: (key: string) => Promise<unknown>;
        items: {
            key: string;
            data: unknown;
        }[];
        constructor({ asyncFetch, maxItems, }: {
            asyncFetch: (key: string) => Promise<unknown>;
            maxItems?: number;
        });
        getFetch(key: string): Promise<unknown>;
    }
    export function mapObject(obj: Record<string, unknown>, fn: (value: unknown, key: string) => unknown): Record<string, unknown>;
    export function mapFilterObject(obj: Record<string, unknown>, fn: (value: unknown, key: string) => unknown): Record<string, unknown>;
    export function getArrayBuffers(ctx: unknown): Transferable[];
    export function newArray<T>(n: number, initFunction: (index: number) => T): T[];
    export class FreeList<T, Args> {
        items: T[];
        allocate: (args: Args) => T;
        dispose?: (item: T) => void;
        valid: (item: T, args: Args) => boolean;
        constructor({ allocate, dispose, valid, }: {
            allocate: (args: Args) => T;
            dispose?: (item: T) => void;
            valid: (item: T, args: Args) => boolean;
        });
        alloc(args: Args): T;
        free(item: T): void;
        disposeAll(): void;
    }
    export function setPackedSplat(packedSplats: Uint32Array, index: number, x: number, y: number, z: number, scaleX: number, scaleY: number, scaleZ: number, quatX: number, quatY: number, quatZ: number, quatW: number, opacity: number, r: number, g: number, b: number): void;
    export function setPackedSplatCenter(packedSplats: Uint32Array, index: number, x: number, y: number, z: number): void;
    export function setPackedSplatScales(packedSplats: Uint32Array, index: number, scaleX: number, scaleY: number, scaleZ: number): void;
    export function setPackedSplatQuat(packedSplats: Uint32Array, index: number, quatX: number, quatY: number, quatZ: number, quatW: number): void;
    export function setPackedSplatRgb(packedSplats: Uint32Array, index: number, r: number, g: number, b: number): void;
    export function setPackedSplatOpacity(packedSplats: Uint32Array, index: number, opacity: number): void;
    export function unpackSplat(packedSplats: Uint32Array, index: number): {
        center: THREE.Vector3;
        scales: THREE.Vector3;
        quaternion: THREE.Quaternion;
        color: THREE.Color;
        opacity: number;
    };
    export function getTextureSize(numSplats: number): {
        width: number;
        height: number;
        depth: number;
        maxSplats: number;
    };
    export function isMobile(): boolean;
    export function isAndroid(): boolean;
    export function isOculus(): boolean;
    export function flipPixels(pixels: Uint8Array, width: number, height: number): Uint8Array;
    export function pixelsToPngUrl(pixels: Uint8Array, width: number, height: number): string;
    export function cloneClock(clock: THREE.Clock): THREE.Clock;
    export function omitUndefined<T extends object>(obj: T): Partial<T>;
    export const IDENT_VERTEX_SHADER: string;
    export function averagePositions(positions: THREE.Vector3[]): THREE.Vector3;
    export function averageQuaternions(quaternions: THREE.Quaternion[]): THREE.Quaternion;
    export function coinciDist(matrix1: THREE.Matrix4, matrix2: THREE.Matrix4): {
        distance: number;
        coincidence: number;
    };
    export function withinDist({ matrix1, matrix2, maxDistance, }: {
        matrix1: THREE.Matrix4;
        matrix2: THREE.Matrix4;
        maxDistance: number;
    }): boolean;
    export function withinCoinciDist({ matrix1, matrix2, maxDistance, minCoincidence, }: {
        matrix1: THREE.Matrix4;
        matrix2: THREE.Matrix4;
        maxDistance: number;
        minCoincidence?: number;
    }): boolean;
    export function coorientDist(matrix1: THREE.Matrix4, matrix2: THREE.Matrix4): {
        distance: number;
        coorient: number;
    };
    export function withinCoorientDist({ matrix1, matrix2, maxDistance, minCoorient, }: {
        matrix1: THREE.Matrix4;
        matrix2: THREE.Matrix4;
        maxDistance: number;
        minCoorient?: number;
    }): boolean;
    export function epsilonSign(value: number, epsilon?: number): number;
    export function encodeQuatXyz888(q: THREE.Quaternion): number;
    export function decodeQuatXyz888(encoded: number, out: THREE.Quaternion): THREE.Quaternion;
    /**
     * Encodes a THREE.Quaternion into a 24‐bit integer.
     *
     * Bit layout (LSB → MSB):
     *   - Bits  0–7:  quantized U (8 bits)
     *   - Bits  8–15: quantized V (8 bits)
     *   - Bits 16–23: quantized angle θ (8 bits) from [0,π]
     *
     * This version uses folded octahedral mapping (all inline).
     */
    export function encodeQuatOctXy88R8(q: THREE.Quaternion): number;
    /**
     * Decodes a 24‐bit encoded quaternion (packed in a number) back to a THREE.Quaternion.
     *
     * Assumes the same bit layout as in encodeQuatOctXy88R8.
     */
    export function decodeQuatOctXy88R8(encoded: number, out: THREE.Quaternion): THREE.Quaternion;
    /**
     * Encodes a THREE.Quaternion into a 24‑bit unsigned integer
     * by converting it to Euler angles (roll, pitch, yaw).
     * The Euler angles are assumed to be in radians in the range [-π, π].
     * Each angle is normalized to [0,1] and quantized to 8 bits.
     * Bit layout (LSB→MSB):
     *   - Bits 0–7:   roll (quantized)
     *   - Bits 8–15:  pitch (quantized)
     *   - Bits 16–23: yaw (quantized)
     */
    export function encodeQuatEulerXyz888(q: THREE.Quaternion): number;
    /**
     * Decodes a 24‑bit unsigned integer into a THREE.Quaternion
     * by unpacking three 8‑bit values (roll, pitch, yaw) in the range [0,255]
     * and then converting them back to Euler angles in [-π, π] and to a quaternion.
     */
    export function decodeQuatEulerXyz888(encoded: number, out: THREE.Quaternion): THREE.Quaternion;
    export function encodeSh1Rgb(sh1Array: Uint32Array, index: number, sh1Rgb: Float32Array): void;
    export function encodeSh2Rgb(sh2Array: Uint32Array, index: number, sh2Rgb: Float32Array): void;
    export function encodeSh3Rgb(sh3Array: Uint32Array, index: number, sh3Rgb: Float32Array): void;
    export function decompressPartialGzip(fileBytes: Uint8Array, numBytes: number): Uint8Array;
    export class GunzipReader {
        fileBytes: Uint8Array;
        chunkBytes: number;
        offset: number;
        chunks: Uint8Array[];
        totalBytes: number;
        gunzip: Gunzip;
        constructor({ fileBytes, chunkBytes, }: {
            fileBytes: Uint8Array;
            chunkBytes?: number;
        });
        read(numBytes: number): Uint8Array;
    }
}
declare module "dyno/program" {
    import * as THREE from "three";
    import { type Dyno, type IOTypes } from "dyno/base";
    export class DynoProgram {
        graph: Dyno<IOTypes, IOTypes>;
        template: DynoProgramTemplate;
        inputs: Record<string, string>;
        outputs: Record<string, string>;
        shader: string;
        uniforms: Record<string, THREE.IUniform>;
        updaters: (() => void)[];
        constructor({ graph, inputs, outputs, template, }: {
            graph: Dyno<IOTypes, IOTypes>;
            inputs?: Record<string, string>;
            outputs?: Record<string, string>;
            template: DynoProgramTemplate;
        });
        prepareMaterial(): THREE.RawShaderMaterial;
        update(): void;
    }
    export class DynoProgramTemplate {
        before: string;
        between: string;
        after: string;
        indent: string;
        constructor(template: string);
        generate({ globals, statements, }: {
            globals: Set<string>;
            statements: string[];
        }): string;
    }
}
declare module "dyno/mathTypes" {
    import { type AllFloatTypes, type AllIntTypes, type AllSignedTypes, type AllValueTypes, type BaseType, type BoolTypes, type FloatTypes, type IntTypes, type SignedTypes, type UintTypes, type ValueTypes } from "dyno/types";
    export type AddOutput<A extends AllValueTypes, B extends AllValueTypes> = BaseType & (A extends B ? A : A extends "int" ? B extends IntTypes ? B : never : B extends "int" ? A extends IntTypes ? A : never : A extends "uint" ? B extends UintTypes ? B : never : B extends "uint" ? A extends UintTypes ? A : never : A extends "float" ? B extends AllFloatTypes ? B : never : B extends "float" ? A extends AllFloatTypes ? A : never : never);
    export type SubOutput<A extends AllValueTypes, B extends AllValueTypes> = AddOutput<A, B>;
    export type MulOutput<A extends AllValueTypes, B extends AllValueTypes> = BaseType & (A extends "int" ? B extends IntTypes ? B : never : B extends "int" ? A extends IntTypes ? A : never : A extends "uint" ? B extends UintTypes ? B : never : B extends "uint" ? A extends UintTypes ? A : never : A extends "float" ? B extends AllFloatTypes ? B : never : B extends "float" ? A extends AllFloatTypes ? A : never : A extends IntTypes ? B extends A ? A : never : B extends IntTypes ? A extends B ? A : never : A extends UintTypes ? B extends A ? A : never : B extends UintTypes ? A extends B ? A : never : A extends "vec2" ? B extends "vec2" | "mat2" | "mat2x2" ? "vec2" : B extends "mat3x2" ? "vec3" : B extends "mat4x2" ? "vec4" : never : A extends "vec3" ? B extends "mat2x3" ? "vec2" : B extends "vec3" | "mat3" | "mat3x3" ? "vec3" : B extends "mat4x3" ? "vec4" : never : A extends "vec4" ? B extends "mat2x4" ? "vec2" : B extends "mat3x4" ? "vec3" : B extends "vec4" | "mat4" | "mat4x4" ? "vec4" : never : B extends "vec2" ? A extends "mat2" | "mat2x2" ? "vec2" : A extends "mat2x3" ? "vec3" : A extends "mat2x4" ? "vec4" : never : B extends "vec3" ? A extends "mat3x2" ? "vec2" : A extends "mat3" | "mat3x3" ? "vec3" : A extends "mat3x4" ? "vec4" : never : B extends "vec4" ? A extends "mat4x2" ? "vec2" : A extends "mat4x3" ? "vec3" : A extends "mat4" | "mat4x4" ? "vec4" : never : A extends "mat2" | "mat2x2" ? B extends "mat2" | "mat2x2" ? "mat2" : B extends "mat3x2" ? "mat3x2" : B extends "mat4x2" ? "mat4x2" : never : A extends "mat2x3" ? B extends "mat2" | "mat2x2" ? "mat2x3" : B extends "mat3x2" ? "mat3" : B extends "mat4x2" ? "mat4x3" : never : A extends "mat2x4" ? B extends "mat2" | "mat2x2" ? "mat2x4" : B extends "mat3x2" ? "mat3x4" : B extends "mat4x2" ? "mat4" : never : A extends "mat3x2" ? B extends "mat2x3" ? "mat2" : B extends "mat3" | "mat3x3" ? "mat3x2" : B extends "mat4x3" ? "mat4x2" : never : A extends "mat3" | "mat3x3" ? B extends "mat2x3" ? "mat2x3" : B extends "mat3" | "mat3x3" ? "mat3" : B extends "mat4x3" ? "mat4x3" : never : A extends "mat3x4" ? B extends "mat2x3" ? "mat2x4" : B extends "mat3" | "mat3x3" ? "mat3x4" : B extends "mat4x3" ? "mat4" : never : A extends "mat4x2" ? B extends "mat2x4" ? "mat2" : B extends "mat3x4" ? "mat3x2" : B extends "mat4" | "mat4x4" ? "mat4x2" : never : A extends "mat4x3" ? B extends "mat2x4" ? "mat2x3" : B extends "mat3x4" ? "mat3" : B extends "mat4" | "mat4x4" ? "mat4x3" : never : A extends "mat4" | "mat4x4" ? B extends "mat2x4" ? "mat2x4" : B extends "mat3x4" ? "mat3x4" : B extends "mat4" | "mat4x4" ? "mat4" : never : never);
    export type DivOutput<A extends AllValueTypes, B extends AllValueTypes> = AddOutput<A, B>;
    export type IModOutput<A extends AllIntTypes, B extends AllIntTypes> = BaseType & (A extends B ? A : A extends "int" ? B extends IntTypes ? B : never : B extends "int" ? A extends IntTypes ? A : never : A extends "uint" ? B extends UintTypes ? B : never : B extends "uint" ? A extends UintTypes ? A : never : never);
    export type ModOutput<A extends FloatTypes, B extends FloatTypes> = BaseType & (A extends B ? A : B extends "float" ? A : never);
    export type PowOutput<A extends FloatTypes, B extends FloatTypes> = BaseType & (A extends B ? A : never);
    export type MinOutput<A extends ValueTypes, B extends ValueTypes> = BaseType & (A extends B ? A : B extends "float" ? A extends FloatTypes ? A : never : B extends "int" ? A extends IntTypes ? A : never : B extends "uint" ? A extends UintTypes ? A : never : never);
    export type MaxOutput<A extends ValueTypes, B extends ValueTypes> = MinOutput<A, B>;
    export type ClampOutput<A extends ValueTypes, B extends ValueTypes> = BaseType & (B extends "float" ? A extends FloatTypes ? A : never : B extends "int" ? A extends IntTypes ? A : never : B extends "uint" ? A extends UintTypes ? A : never : never);
    export type MixOutput<A extends FloatTypes, T extends FloatTypes | BoolTypes> = BaseType & (T extends A ? A : T extends "float" ? A : T extends "bool" ? A extends "float" ? A : never : T extends "bvec2" ? A extends "vec2" ? A : never : T extends "bvec3" ? A extends "vec3" ? A : never : T extends "bvec4" ? A extends "vec4" ? A : never : never);
    export type StepOutput<A extends FloatTypes, B extends FloatTypes> = BaseType & (A extends B ? B : A extends "float" ? B : never);
    export type SmoothstepOutput<A extends FloatTypes, B extends FloatTypes, C extends FloatTypes> = BaseType & (A extends B ? (A extends C ? C : A extends "float" ? C : never) : never);
    export type IsNanOutput<A extends FloatTypes> = BaseType & (A extends "float" ? "bool" : A extends "vec2" ? "bvec2" : A extends "vec3" ? "bvec3" : A extends "vec4" ? "bvec4" : never);
    export type IsInfOutput<A extends FloatTypes> = IsNanOutput<A>;
    export function addOutputType<A extends AllValueTypes, B extends AllValueTypes>(a: A, b: B, operation?: string): AddOutput<A, B>;
    export function subOutputType<A extends AllValueTypes, B extends AllValueTypes>(a: A, b: B): SubOutput<A, B>;
    export function mulOutputType<A extends AllValueTypes, B extends AllValueTypes>(a: A, b: B): MulOutput<A, B>;
    export function divOutputType<A extends AllValueTypes, B extends AllValueTypes>(a: A, b: B): DivOutput<A, B>;
    export function imodOutputType<A extends AllIntTypes, B extends AllIntTypes>(a: A, b: B): IModOutput<A, B>;
    export function modOutputType<A extends FloatTypes, B extends FloatTypes>(a: A, b: B): ModOutput<A, B>;
    export function modfOutputType<A extends FloatTypes>(a: A): A;
    export function negOutputType<A extends AllSignedTypes>(a: A): A;
    export function absOutputType<A extends SignedTypes>(a: A): A;
    export function signOutputType<A extends SignedTypes>(a: A): A;
    export function floorOutputType<A extends FloatTypes>(a: A): A;
    export function ceilOutputType<A extends FloatTypes>(a: A): A;
    export function truncOutputType<A extends FloatTypes>(a: A): A;
    export function roundOutputType<A extends FloatTypes>(a: A): A;
    export function fractOutputType<A extends FloatTypes>(a: A): A;
    export function powOutputType<A extends FloatTypes>(a: A): A;
    export function expOutputType<A extends FloatTypes>(a: A): A;
    export function exp2OutputType<A extends FloatTypes>(a: A): A;
    export function logOutputType<A extends FloatTypes>(a: A): A;
    export function log2OutputType<A extends FloatTypes>(a: A): A;
    export function sqrOutputType<A extends ValueTypes>(a: A): A;
    export function sqrtOutputType<A extends FloatTypes>(a: A): A;
    export function inversesqrtOutputType<A extends FloatTypes>(a: A): A;
    export function minOutputType<A extends ValueTypes, B extends ValueTypes>(a: A, b: B, operation?: string): MinOutput<A, B>;
    export function maxOutputType<A extends ValueTypes, B extends ValueTypes>(a: A, b: B): MaxOutput<A, B>;
    export function clampOutputType<A extends ValueTypes, B extends ValueTypes>(a: A, b: B, _c: B): ClampOutput<A, B>;
    export function mixOutputType<A extends FloatTypes, C extends FloatTypes | BoolTypes>(a: A, b: A, c: C): MixOutput<A, C>;
    export function stepOutputType<A extends FloatTypes, B extends FloatTypes>(a: A, b: B): StepOutput<A, B>;
    export function smoothstepOutputType<A extends FloatTypes, B extends FloatTypes, C extends FloatTypes>(a: A, b: B, c: C): SmoothstepOutput<A, B, C>;
    export function isNanOutputType<A extends FloatTypes>(a: A, operation?: string): IsNanOutput<A>;
    export function isInfOutputType<A extends FloatTypes>(a: A): IsInfOutput<A>;
}
declare module "dyno/math" {
    import { BinaryOp, Dyno, TrinaryOp, UnaryOp } from "dyno/base";
    import { type AddOutput, type ClampOutput, type DivOutput, type IModOutput, type IsInfOutput, type IsNanOutput, type MaxOutput, type MinOutput, type MixOutput, type ModOutput, type MulOutput, type SmoothstepOutput, type StepOutput, type SubOutput } from "dyno/mathTypes";
    import type { AllIntTypes, AllSignedTypes, AllValueTypes, BoolTypes, FloatTypes, SignedTypes, ValueTypes } from "dyno/types";
    import { type DynoVal } from "dyno/value";
    export const add: <A extends AllValueTypes, B extends AllValueTypes>(a: DynoVal<A>, b: DynoVal<B>) => DynoVal<AddOutput<A, B>>;
    export const sub: <A extends AllValueTypes, B extends AllValueTypes>(a: DynoVal<A>, b: DynoVal<B>) => DynoVal<SubOutput<A, B>>;
    export const mul: <A extends AllValueTypes, B extends AllValueTypes>(a: DynoVal<A>, b: DynoVal<B>) => DynoVal<MulOutput<A, B>>;
    export const div: <A extends AllValueTypes, B extends AllValueTypes>(a: DynoVal<A>, b: DynoVal<B>) => DynoVal<DivOutput<A, B>>;
    export const imod: <A extends AllIntTypes, B extends AllIntTypes>(a: DynoVal<A>, b: DynoVal<B>) => DynoVal<IModOutput<A, B>>;
    export const mod: <A extends FloatTypes, B extends FloatTypes>(a: DynoVal<A>, b: DynoVal<B>) => DynoVal<ModOutput<A, B>>;
    export const modf: <A extends FloatTypes>(a: DynoVal<A>) => {
        fract: DynoVal<A>;
        integer: DynoVal<A>;
    };
    export const neg: <A extends AllSignedTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const abs: <A extends SignedTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const sign: <A extends SignedTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const floor: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const ceil: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const trunc: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const round: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const fract: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const pow: <A extends FloatTypes>(a: DynoVal<A>, b: DynoVal<A>) => DynoVal<A>;
    export const exp: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const exp2: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const log: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const log2: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const sqr: <A extends ValueTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const sqrt: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const inversesqrt: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export const min: <A extends ValueTypes, B extends ValueTypes>(a: DynoVal<A>, b: DynoVal<B>) => DynoVal<MinOutput<A, B>>;
    export const max: <A extends ValueTypes, B extends ValueTypes>(a: DynoVal<A>, b: DynoVal<B>) => DynoVal<MaxOutput<A, B>>;
    export const clamp: <A extends ValueTypes, MinMax extends ValueTypes>(a: DynoVal<A>, min: DynoVal<MinMax>, max: DynoVal<MinMax>) => DynoVal<ClampOutput<A, MinMax>>;
    export const mix: <A extends FloatTypes, T extends FloatTypes | BoolTypes>(a: DynoVal<A>, b: DynoVal<A>, t: DynoVal<T>) => DynoVal<MixOutput<A, T>>;
    export const step: <A extends FloatTypes, B extends FloatTypes>(edge: DynoVal<A>, x: DynoVal<B>) => DynoVal<StepOutput<A, B>>;
    export const smoothstep: <X extends FloatTypes, Edge extends X | "float">(edge0: DynoVal<Edge>, edge1: DynoVal<Edge>, x: DynoVal<X>) => DynoVal<SmoothstepOutput<Edge, Edge, X>>;
    export const isNan: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<IsNanOutput<A>>;
    export const isInf: <A extends FloatTypes>(a: DynoVal<A>) => DynoVal<IsInfOutput<A>>;
    export class Add<A extends AllValueTypes, B extends AllValueTypes> extends BinaryOp<A, B, AddOutput<A, B>, "sum"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
        });
    }
    export class Sub<A extends AllValueTypes, B extends AllValueTypes> extends BinaryOp<A, B, SubOutput<A, B>, "difference"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
        });
    }
    export class Mul<A extends AllValueTypes, B extends AllValueTypes> extends BinaryOp<A, B, MulOutput<A, B>, "product"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
        });
    }
    export class Div<A extends AllValueTypes, B extends AllValueTypes> extends BinaryOp<A, B, DivOutput<A, B>, "quotient"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
        });
    }
    export class IMod<A extends AllIntTypes, B extends AllIntTypes> extends BinaryOp<A, B, IModOutput<A, B>, "remainder"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
        });
    }
    export class Mod<A extends FloatTypes, B extends FloatTypes> extends BinaryOp<A, B, ModOutput<A, B>, "remainder"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
        });
    }
    export class Modf<A extends FloatTypes> extends Dyno<{
        a: A;
    }, {
        fract: A;
        integer: A;
    }> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Neg<A extends AllSignedTypes> extends UnaryOp<A, A, "neg"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Abs<A extends SignedTypes> extends UnaryOp<A, A, "abs"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Sign<A extends SignedTypes> extends UnaryOp<A, A, "sign"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Floor<A extends FloatTypes> extends UnaryOp<A, A, "floor"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Ceil<A extends FloatTypes> extends UnaryOp<A, A, "ceil"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Trunc<A extends FloatTypes> extends UnaryOp<A, A, "trunc"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Round<A extends FloatTypes> extends UnaryOp<A, A, "round"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Fract<A extends FloatTypes> extends UnaryOp<A, A, "fract"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Pow<A extends FloatTypes> extends BinaryOp<A, A, A, "power"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<A>;
        });
    }
    export class Exp<A extends FloatTypes> extends UnaryOp<A, A, "exp"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Exp2<A extends FloatTypes> extends UnaryOp<A, A, "exp2"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Log<A extends FloatTypes> extends UnaryOp<A, A, "log"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Log2<A extends FloatTypes> extends UnaryOp<A, A, "log2"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Sqr<A extends ValueTypes> extends UnaryOp<A, A, "sqr"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Sqrt<A extends FloatTypes> extends UnaryOp<A, A, "sqrt"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class InverseSqrt<A extends FloatTypes> extends UnaryOp<A, A, "inversesqrt"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Min<A extends ValueTypes, B extends ValueTypes> extends BinaryOp<A, B, MinOutput<A, B>, "min"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
        });
    }
    export class Max<A extends ValueTypes, B extends ValueTypes> extends BinaryOp<A, B, MaxOutput<A, B>, "max"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
        });
    }
    export class Clamp<A extends ValueTypes, MinMax extends ValueTypes> extends TrinaryOp<A, MinMax, MinMax, ClampOutput<A, MinMax>, "clamp"> {
        constructor({ a, min, max, }: {
            a: DynoVal<A>;
            min: DynoVal<MinMax>;
            max: DynoVal<MinMax>;
        });
    }
    export class Mix<A extends FloatTypes, T extends FloatTypes | BoolTypes> extends TrinaryOp<A, A, T, MixOutput<A, T>, "mix"> {
        constructor({ a, b, t }: {
            a: DynoVal<A>;
            b: DynoVal<A>;
            t: DynoVal<T>;
        });
    }
    export class Step<Edge extends FloatTypes, X extends FloatTypes> extends BinaryOp<Edge, X, StepOutput<Edge, X>, "step"> {
        constructor({ edge, x }: {
            edge: DynoVal<Edge>;
            x: DynoVal<X>;
        });
    }
    export class Smoothstep<X extends FloatTypes, Edge extends X | "float"> extends TrinaryOp<Edge, Edge, X, SmoothstepOutput<Edge, Edge, X>, "smoothstep"> {
        constructor({ edge0, edge1, x, }: {
            edge0: DynoVal<Edge>;
            edge1: DynoVal<Edge>;
            x: DynoVal<X>;
        });
    }
    export class IsNan<A extends FloatTypes> extends UnaryOp<A, IsNanOutput<A>, "isNan"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class IsInf<A extends FloatTypes> extends UnaryOp<A, IsInfOutput<A>, "isInf"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
}
declare module "dyno/logic" {
    import { BinaryOp, TrinaryOp, UnaryOp } from "dyno/base";
    import { type AllIntTypes, type BoolTypes, type IntTypes, type ScalarTypes, type SimpleTypes, type UintTypes, type ValueTypes } from "dyno/types";
    import { type DynoVal } from "dyno/value";
    export const and: <T extends "bool" | AllIntTypes>(a: DynoVal<T>, b: DynoVal<T>) => DynoVal<T>;
    export const or: <T extends "bool" | AllIntTypes>(a: DynoVal<T>, b: DynoVal<T>) => DynoVal<T>;
    export const xor: <T extends "bool" | AllIntTypes>(a: DynoVal<T>, b: DynoVal<T>) => DynoVal<T>;
    export const not: <T extends BoolTypes | AllIntTypes>(a: DynoVal<T>) => DynoVal<T>;
    export const lessThan: <T extends ValueTypes>(a: DynoVal<T>, b: DynoVal<T>) => DynoVal<CompareOutput<T>>;
    export const lessThanEqual: <T extends ValueTypes>(a: DynoVal<T>, b: DynoVal<T>) => DynoVal<CompareOutput<T>>;
    export const greaterThan: <T extends ValueTypes>(a: DynoVal<T>, b: DynoVal<T>) => DynoVal<CompareOutput<T>>;
    export const greaterThanEqual: <T extends ValueTypes>(a: DynoVal<T>, b: DynoVal<T>) => DynoVal<CompareOutput<T>>;
    export const equal: <T extends ValueTypes | BoolTypes>(a: DynoVal<T>, b: DynoVal<T>) => DynoVal<EqualOutput<T>>;
    export const notEqual: <T extends ValueTypes | BoolTypes>(a: DynoVal<T>, b: DynoVal<T>) => DynoVal<NotEqualOutput<T>>;
    export const any: <T extends "bvec2" | "bvec3" | "bvec4">(a: DynoVal<T>) => DynoVal<"bool">;
    export const all: <T extends "bvec2" | "bvec3" | "bvec4">(a: DynoVal<T>) => DynoVal<"bool">;
    export const select: <T extends SimpleTypes>(cond: DynoVal<"bool">, t: DynoVal<T>, f: DynoVal<T>) => DynoVal<T>;
    export const compXor: <T extends BoolTypes | AllIntTypes>(a: DynoVal<T>) => DynoVal<CompXorOutput<T>>;
    export class And<T extends "bool" | AllIntTypes> extends BinaryOp<T, T, T, "and"> {
        constructor({ a, b }: {
            a: DynoVal<T>;
            b: DynoVal<T>;
        });
    }
    export class Or<T extends "bool" | AllIntTypes> extends BinaryOp<T, T, T, "or"> {
        constructor({ a, b }: {
            a: DynoVal<T>;
            b: DynoVal<T>;
        });
    }
    export class Xor<T extends "bool" | AllIntTypes> extends BinaryOp<T, T, T, "xor"> {
        constructor({ a, b }: {
            a: DynoVal<T>;
            b: DynoVal<T>;
        });
    }
    export class Not<T extends BoolTypes | AllIntTypes> extends UnaryOp<T, T, "not"> {
        constructor({ a }: {
            a: DynoVal<T>;
        });
    }
    export class LessThan<T extends ValueTypes> extends BinaryOp<T, T, CompareOutput<T>, "lessThan"> {
        constructor({ a, b }: {
            a: DynoVal<T>;
            b: DynoVal<T>;
        });
    }
    export class LessThanEqual<T extends ValueTypes> extends BinaryOp<T, T, CompareOutput<T>, "lessThanEqual"> {
        constructor({ a, b }: {
            a: DynoVal<T>;
            b: DynoVal<T>;
        });
    }
    export class GreaterThan<T extends ValueTypes> extends BinaryOp<T, T, CompareOutput<T>, "greaterThan"> {
        constructor({ a, b }: {
            a: DynoVal<T>;
            b: DynoVal<T>;
        });
    }
    export class GreaterThanEqual<T extends ValueTypes> extends BinaryOp<T, T, CompareOutput<T>, "greaterThanEqual"> {
        constructor({ a, b }: {
            a: DynoVal<T>;
            b: DynoVal<T>;
        });
    }
    export class Equal<T extends ValueTypes | BoolTypes> extends BinaryOp<T, T, EqualOutput<T>, "equal"> {
        constructor({ a, b }: {
            a: DynoVal<T>;
            b: DynoVal<T>;
        });
    }
    export class NotEqual<T extends ValueTypes | BoolTypes> extends BinaryOp<T, T, NotEqualOutput<T>, "notEqual"> {
        constructor({ a, b }: {
            a: DynoVal<T>;
            b: DynoVal<T>;
        });
    }
    export class Any<T extends BoolTypes> extends UnaryOp<T, "bool", "any"> {
        constructor({ a }: {
            a: DynoVal<T>;
        });
    }
    export class All<T extends BoolTypes> extends UnaryOp<T, "bool", "all"> {
        constructor({ a }: {
            a: DynoVal<T>;
        });
    }
    export class Select<T extends SimpleTypes> extends TrinaryOp<"bool", T, T, T, "select"> {
        constructor({ cond, t, f, }: {
            cond: DynoVal<"bool">;
            t: DynoVal<T>;
            f: DynoVal<T>;
        });
    }
    type CompareOutput<T extends ValueTypes> = T extends ScalarTypes ? "bool" : T extends "ivec2" | "uvec2" | "vec2" ? "bvec2" : T extends "ivec3" | "uvec3" | "vec3" ? "bvec3" : T extends "ivec4" | "uvec4" | "vec4" ? "bvec4" : never;
    type EqualOutput<A extends ValueTypes | BoolTypes> = A extends ScalarTypes ? "bool" : A extends BoolTypes ? A : A extends "ivec2" | "uvec2" | "vec2" ? "bvec2" : A extends "ivec3" | "uvec3" | "vec3" ? "bvec3" : A extends "ivec4" | "uvec4" | "vec4" ? "bvec4" : never;
    type NotEqualOutput<A extends ValueTypes | BoolTypes> = EqualOutput<A>;
    type CompXorOutput<A extends BoolTypes | AllIntTypes> = A extends BoolTypes ? "bool" : A extends IntTypes ? "int" : A extends UintTypes ? "uint" : never;
    export class CompXor<T extends BoolTypes | AllIntTypes> extends UnaryOp<T, CompXorOutput<T>, "compXor"> {
        constructor({ a }: {
            a: DynoVal<T>;
        });
    }
}
declare module "dyno/convert" {
    import { UnaryOp } from "dyno/base";
    import { type SimpleTypes } from "dyno/types";
    import type { DynoVal } from "dyno/value";
    export const bool: <T extends "bool" | "int" | "uint" | "float">(value: DynoVal<T>) => DynoVal<"bool">;
    export const int: <T extends "bool" | "int" | "uint" | "float">(value: DynoVal<T>) => DynoVal<"int">;
    export const uint: <T extends "bool" | "int" | "uint" | "float">(value: DynoVal<T>) => DynoVal<"uint">;
    export const float: <T extends "bool" | "int" | "uint" | "float">(value: DynoVal<T>) => DynoVal<"float">;
    export const bvec2: <T extends "bool" | "bvec2" | "ivec2" | "uvec2" | "vec2">(value: DynoVal<T>) => DynoVal<"bvec2">;
    export const bvec3: <T extends "bool" | "bvec3" | "ivec3" | "uvec3" | "vec3">(value: DynoVal<T>) => DynoVal<"bvec3">;
    export const bvec4: <T extends "bool" | "bvec4" | "ivec4" | "uvec4" | "vec4">(value: DynoVal<T>) => DynoVal<"bvec4">;
    export const ivec2: <T extends "int" | "bvec2" | "ivec2" | "uvec2" | "vec2">(value: DynoVal<T>) => DynoVal<"ivec2">;
    export const ivec3: <T extends "int" | "bvec3" | "ivec3" | "uvec3" | "vec3">(value: DynoVal<T>) => DynoVal<"ivec3">;
    export const ivec4: <T extends "int" | "bvec4" | "ivec4" | "uvec4" | "vec4">(value: DynoVal<T>) => DynoVal<"ivec4">;
    export const uvec2: <T extends "uint" | "bvec2" | "ivec2" | "uvec2" | "vec2">(value: DynoVal<T>) => DynoVal<"uvec2">;
    export const uvec3: <T extends "uint" | "bvec3" | "ivec3" | "uvec3" | "vec3">(value: DynoVal<T>) => DynoVal<"uvec3">;
    export const uvec4: <T extends "uint" | "bvec4" | "ivec4" | "uvec4" | "vec4">(value: DynoVal<T>) => DynoVal<"uvec4">;
    export const vec2: <T extends "float" | "bvec2" | "ivec2" | "uvec2" | "vec2" | "vec3" | "vec4">(value: DynoVal<T>) => DynoVal<"vec2">;
    export const vec3: <T extends "float" | "bvec3" | "ivec3" | "uvec3" | "vec3" | "vec4">(value: DynoVal<T>) => DynoVal<"vec3">;
    export const vec4: <T extends "float" | "bvec4" | "ivec4" | "uvec4" | "vec4">(value: DynoVal<T>) => DynoVal<"vec4">;
    export const mat2: <T extends "float" | "mat2" | "mat3" | "mat4">(value: DynoVal<T>) => DynoVal<"mat2">;
    export const mat3: <T extends "float" | "mat2" | "mat3" | "mat4">(value: DynoVal<T>) => DynoVal<"mat3">;
    export const mat4: <T extends "float" | "mat2" | "mat3" | "mat4">(value: DynoVal<T>) => DynoVal<"mat4">;
    export const floatBitsToInt: (value: DynoVal<"float">) => DynoVal<"int">;
    export const floatBitsToUint: (value: DynoVal<"float">) => DynoVal<"uint">;
    export const intBitsToFloat: (value: DynoVal<"int">) => DynoVal<"float">;
    export const uintBitsToFloat: (value: DynoVal<"uint">) => DynoVal<"float">;
    export const packSnorm2x16: (value: DynoVal<"vec2">) => DynoVal<"uint">;
    export const unpackSnorm2x16: (value: DynoVal<"uint">) => DynoVal<"vec2">;
    export const packUnorm2x16: (value: DynoVal<"vec2">) => DynoVal<"uint">;
    export const unpackUnorm2x16: (value: DynoVal<"uint">) => DynoVal<"vec2">;
    export const packHalf2x16: (value: DynoVal<"vec2">) => DynoVal<"uint">;
    export const unpackHalf2x16: (value: DynoVal<"uint">) => DynoVal<"vec2">;
    export const uintToRgba8: (value: DynoVal<"uint">) => DynoVal<"vec4">;
    export class SimpleCast<Allowed extends SimpleTypes, OutType extends SimpleTypes, OutKey extends string> extends UnaryOp<Allowed, OutType, OutKey> {
        constructor({ value, outType, outKey, }: {
            value: DynoVal<Allowed>;
            outType: OutType;
            outKey: OutKey;
        });
    }
    export class Bool extends SimpleCast<"bool" | "int" | "uint" | "float", "bool", "bool"> {
        constructor({ value, }: {
            value: DynoVal<"bool" | "int" | "uint" | "float">;
        });
    }
    export class Int extends SimpleCast<"bool" | "int" | "uint" | "float", "int", "int"> {
        constructor({ value, }: {
            value: DynoVal<"bool" | "int" | "uint" | "float">;
        });
    }
    export class Uint extends SimpleCast<"bool" | "int" | "uint" | "float", "uint", "uint"> {
        constructor({ value, }: {
            value: DynoVal<"bool" | "int" | "uint" | "float">;
        });
    }
    export class Float extends SimpleCast<"bool" | "int" | "uint" | "float", "float", "float"> {
        constructor({ value, }: {
            value: DynoVal<"bool" | "int" | "uint" | "float">;
        });
    }
    export class BVec2 extends SimpleCast<"bool" | "bvec2" | "ivec2" | "uvec2" | "vec2", "bvec2", "bvec2"> {
        constructor({ value, }: {
            value: DynoVal<"bool" | "bvec2" | "ivec2" | "uvec2" | "vec2">;
        });
    }
    export class BVec3 extends SimpleCast<"bool" | "bvec3" | "ivec3" | "uvec3" | "vec3", "bvec3", "bvec3"> {
        constructor({ value, }: {
            value: DynoVal<"bool" | "bvec3" | "ivec3" | "uvec3" | "vec3">;
        });
    }
    export class BVec4 extends SimpleCast<"bool" | "bvec4" | "ivec4" | "uvec4" | "vec4", "bvec4", "bvec4"> {
        constructor({ value, }: {
            value: DynoVal<"bool" | "bvec4" | "ivec4" | "uvec4" | "vec4">;
        });
    }
    export class IVec2 extends SimpleCast<"int" | "bvec2" | "ivec2" | "uvec2" | "vec2", "ivec2", "ivec2"> {
        constructor({ value, }: {
            value: DynoVal<"int" | "bvec2" | "ivec2" | "uvec2" | "vec2">;
        });
    }
    export class IVec3 extends SimpleCast<"int" | "bvec3" | "ivec3" | "uvec3" | "vec3", "ivec3", "ivec3"> {
        constructor({ value, }: {
            value: DynoVal<"int" | "bvec3" | "ivec3" | "uvec3" | "vec3">;
        });
    }
    export class IVec4 extends SimpleCast<"int" | "bvec4" | "ivec4" | "uvec4" | "vec4", "ivec4", "ivec4"> {
        constructor({ value, }: {
            value: DynoVal<"int" | "bvec4" | "ivec4" | "uvec4" | "vec4">;
        });
    }
    export class UVec2 extends SimpleCast<"uint" | "ivec2" | "bvec2" | "uvec2" | "vec2", "uvec2", "uvec2"> {
        constructor({ value, }: {
            value: DynoVal<"uint" | "ivec2" | "bvec2" | "uvec2" | "vec2">;
        });
    }
    export class UVec3 extends SimpleCast<"uint" | "ivec3" | "bvec3" | "uvec3" | "vec3", "uvec3", "uvec3"> {
        constructor({ value, }: {
            value: DynoVal<"uint" | "ivec3" | "bvec3" | "uvec3" | "vec3">;
        });
    }
    export class UVec4 extends SimpleCast<"uint" | "ivec4" | "bvec4" | "uvec4" | "vec4", "uvec4", "uvec4"> {
        constructor({ value, }: {
            value: DynoVal<"uint" | "ivec4" | "bvec4" | "uvec4" | "vec4">;
        });
    }
    export class Vec2 extends SimpleCast<"float" | "bvec2" | "ivec2" | "uvec2" | "vec2" | "vec3" | "vec4", "vec2", "vec2"> {
        constructor({ value, }: {
            value: DynoVal<"float" | "bvec2" | "ivec2" | "uvec2" | "vec2" | "vec3" | "vec4">;
        });
    }
    export class Vec3 extends SimpleCast<"float" | "bvec3" | "ivec3" | "uvec3" | "vec3" | "vec2" | "vec4", "vec3", "vec3"> {
        constructor({ value, }: {
            value: DynoVal<"float" | "bvec3" | "ivec3" | "uvec3" | "vec3" | "vec2" | "vec4">;
        });
    }
    export class Vec4 extends SimpleCast<"float" | "bvec4" | "ivec4" | "uvec4" | "vec4", "vec4", "vec4"> {
        constructor({ value, }: {
            value: DynoVal<"float" | "bvec4" | "ivec4" | "uvec4" | "vec4">;
        });
    }
    export class Mat2 extends SimpleCast<"float" | "mat2" | "mat3" | "mat4", "mat2", "mat2"> {
        constructor({ value, }: {
            value: DynoVal<"float" | "mat2" | "mat3" | "mat4">;
        });
    }
    export class Mat3 extends SimpleCast<"float" | "mat2" | "mat3" | "mat4", "mat3", "mat3"> {
        constructor({ value, }: {
            value: DynoVal<"float" | "mat2" | "mat3" | "mat4">;
        });
    }
    export class Mat4 extends SimpleCast<"float" | "mat2" | "mat3" | "mat4", "mat4", "mat4"> {
        constructor({ value, }: {
            value: DynoVal<"float" | "mat2" | "mat3" | "mat4">;
        });
    }
    export class FloatBitsToInt extends UnaryOp<"float", "int", "int"> {
        constructor({ value }: {
            value: DynoVal<"float">;
        });
    }
    export class FloatBitsToUint extends UnaryOp<"float", "uint", "uint"> {
        constructor({ value }: {
            value: DynoVal<"float">;
        });
    }
    export class IntBitsToFloat extends UnaryOp<"int", "float", "float"> {
        constructor({ value }: {
            value: DynoVal<"int">;
        });
    }
    export class UintBitsToFloat extends UnaryOp<"uint", "float", "float"> {
        constructor({ value }: {
            value: DynoVal<"uint">;
        });
    }
    export class PackSnorm2x16 extends UnaryOp<"vec2", "uint", "uint"> {
        constructor({ value }: {
            value: DynoVal<"vec2">;
        });
    }
    export class UnpackSnorm2x16 extends UnaryOp<"uint", "vec2", "vec2"> {
        constructor({ value }: {
            value: DynoVal<"uint">;
        });
    }
    export class PackUnorm2x16 extends UnaryOp<"vec2", "uint", "uint"> {
        constructor({ value }: {
            value: DynoVal<"vec2">;
        });
    }
    export class UnpackUnorm2x16 extends UnaryOp<"uint", "vec2", "vec2"> {
        constructor({ value }: {
            value: DynoVal<"uint">;
        });
    }
    export class PackHalf2x16 extends UnaryOp<"vec2", "uint", "uint"> {
        constructor({ value }: {
            value: DynoVal<"vec2">;
        });
    }
    export class UnpackHalf2x16 extends UnaryOp<"uint", "vec2", "vec2"> {
        constructor({ value }: {
            value: DynoVal<"uint">;
        });
    }
    export class UintToRgba8 extends UnaryOp<"uint", "vec4", "rgba8"> {
        constructor({ value }: {
            value: DynoVal<"uint">;
        });
    }
}
declare module "dyno/vecmat" {
    import { BinaryOp, Dyno, TrinaryOp, UnaryOp } from "dyno/base";
    import { type FloatTypes, type IntTypes, type MatFloatTypes, type SquareMatTypes, type UintTypes, type VectorElementType, type VectorTypes } from "dyno/types";
    import { type DynoVal, type DynoValue, type HasDynoOut } from "dyno/value";
    export const length: <A extends "vec2" | "vec3" | "vec4">(a: DynoVal<A>) => DynoVal<"float">;
    export const distance: <A extends "vec2" | "vec3" | "vec4">(a: DynoVal<A>, b: DynoVal<A>) => DynoVal<"float">;
    export const dot: <A extends "vec2" | "vec3" | "vec4">(a: DynoVal<A>, b: DynoVal<A>) => DynoVal<"float">;
    export const cross: (a: DynoVal<"vec3">, b: DynoVal<"vec3">) => DynoVal<"vec3">;
    export const normalize: <A extends "vec2" | "vec3" | "vec4">(a: DynoVal<A>) => DynoVal<A>;
    export const faceforward: <A extends "vec2" | "vec3" | "vec4">(a: DynoVal<A>, b: DynoVal<A>, c: DynoVal<A>) => DynoVal<A>;
    export const reflectVec: <A extends "vec2" | "vec3" | "vec4">(incident: DynoVal<A>, normal: DynoVal<A>) => DynoVal<A>;
    export const refractVec: <A extends "vec2" | "vec3" | "vec4">(incident: DynoVal<A>, normal: DynoVal<A>, eta: DynoVal<"float">) => DynoVal<A>;
    export const split: <V extends VectorTypes>(vector: DynoVal<V>) => Split<V>;
    export const combine: <V extends VectorTypes, T extends VectorElementType<V>>({ vector, vectorType, x, y, z, w, r, g, b, a, }: {
        vector?: DynoVal<V>;
        vectorType?: V;
        x?: DynoVal<T>;
        y?: DynoVal<T>;
        z?: DynoVal<T>;
        w?: DynoVal<T>;
        r?: DynoVal<T>;
        g?: DynoVal<T>;
        b?: DynoVal<T>;
        a?: DynoVal<T>;
    }) => DynoVal<V>;
    export const projectH: <A extends "vec3" | "vec4">(a: DynoVal<A>) => DynoVal<ProjectHOutput<A>>;
    export const extendVec: <A extends "float" | "vec2" | "vec3">(a: DynoVal<A>, b: DynoVal<"float">) => DynoVal<ExtendVecOutput<A>>;
    export const swizzle: <A extends VectorTypes, S extends SwizzleSelect>(a: DynoVal<A>, select: S) => DynoVal<SwizzleOutput<A, SwizzleSelectLen<S>>>;
    export const compMult: <A extends MatFloatTypes>(a: DynoVal<A>, b: DynoVal<A>) => DynoVal<A>;
    export const outer: <A extends "vec2" | "vec3" | "vec4", B extends "vec2" | "vec3" | "vec4">(a: DynoVal<A>, b: DynoVal<B>) => DynoVal<OuterOutput<A, B>>;
    export const transpose: <A extends MatFloatTypes>(a: DynoVal<A>) => DynoVal<TransposeOutput<A>>;
    export const determinant: <A extends SquareMatTypes>(a: DynoVal<A>) => DynoVal<"float">;
    export const inverse: <A extends SquareMatTypes>(a: DynoVal<A>) => DynoVal<A>;
    export class Length<A extends "vec2" | "vec3" | "vec4"> extends UnaryOp<A, "float", "length"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Distance<A extends "vec2" | "vec3" | "vec4"> extends BinaryOp<A, A, "float", "distance"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<A>;
        });
    }
    export class Dot<A extends "vec2" | "vec3" | "vec4"> extends BinaryOp<A, A, "float", "dot"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<A>;
        });
    }
    export class Cross extends BinaryOp<"vec3", "vec3", "vec3", "cross"> {
        constructor({ a, b }: {
            a: DynoVal<"vec3">;
            b: DynoVal<"vec3">;
        });
    }
    export class Normalize<A extends "vec2" | "vec3" | "vec4"> extends UnaryOp<A, A, "normalize"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    type ProjectHOutput<A extends "vec3" | "vec4"> = A extends "vec3" ? "vec2" : A extends "vec4" ? "vec3" : never;
    export class ProjectH<A extends "vec3" | "vec4"> extends UnaryOp<A, ProjectHOutput<A>, "projected"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    type ExtendVecOutput<A extends "float" | "vec2" | "vec3"> = A extends "float" ? "vec2" : A extends "vec2" ? "vec3" : A extends "vec3" ? "vec4" : never;
    export class ExtendVec<A extends "float" | "vec2" | "vec3"> extends BinaryOp<A, "float", ExtendVecOutput<A>, "extend"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<"float">;
        });
    }
    export class FaceForward<A extends "vec2" | "vec3" | "vec4"> extends TrinaryOp<A, A, A, A, "forward"> {
        constructor({ a, b, c }: {
            a: DynoVal<A>;
            b: DynoVal<A>;
            c: DynoVal<A>;
        });
    }
    export class ReflectVec<A extends "vec2" | "vec3" | "vec4"> extends BinaryOp<A, A, A, "reflection"> {
        constructor({ incident, normal, }: {
            incident: DynoVal<A>;
            normal: DynoVal<A>;
        });
    }
    export class RefractVec<A extends "vec2" | "vec3" | "vec4"> extends TrinaryOp<A, A, "float", A, "refraction"> {
        constructor({ incident, normal, eta, }: {
            incident: DynoVal<A>;
            normal: DynoVal<A>;
            eta: DynoVal<"float">;
        });
    }
    export class CompMult<A extends MatFloatTypes> extends BinaryOp<A, A, A, "product"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<A>;
        });
    }
    type OuterOutput<A extends "vec2" | "vec3" | "vec4", B extends "vec2" | "vec3" | "vec4"> = A extends "vec2" ? B extends "vec2" ? "mat2" : B extends "vec3" ? "mat3x2" : B extends "vec4" ? "mat4x2" : never : A extends "vec3" ? B extends "vec2" ? "mat2x3" : B extends "vec3" ? "mat3" : B extends "vec4" ? "mat4x3" : never : A extends "vec4" ? B extends "vec2" ? "mat2x4" : B extends "vec3" ? "mat3x4" : B extends "vec4" ? "mat4" : never : never;
    export class Outer<A extends "vec2" | "vec3" | "vec4", B extends "vec2" | "vec3" | "vec4"> extends BinaryOp<A, B, OuterOutput<A, B>, "outer"> {
        constructor({ a, b }: {
            a: DynoVal<A>;
            b: DynoVal<B>;
        });
    }
    type TransposeOutput<A extends MatFloatTypes> = A extends SquareMatTypes ? A : A extends "mat2x3" ? "mat3x2" : A extends "mat2x4" ? "mat4x2" : A extends "mat3x2" ? "mat2x3" : A extends "mat3x4" ? "mat4x3" : A extends "mat4x2" ? "mat2x4" : A extends "mat4x3" ? "mat3x4" : never;
    export class Transpose<A extends MatFloatTypes> extends UnaryOp<A, TransposeOutput<A>, "transpose"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Determinant<A extends SquareMatTypes> extends UnaryOp<A, "float", "det"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    export class Inverse<A extends SquareMatTypes> extends UnaryOp<A, A, "inverse"> {
        constructor({ a }: {
            a: DynoVal<A>;
        });
    }
    type SplitOutTypes<A extends VectorTypes> = A extends "vec2" ? {
        x: "float";
        y: "float";
        r: "float";
        g: "float";
    } : A extends "vec3" ? {
        x: "float";
        y: "float";
        z: "float";
        r: "float";
        g: "float";
        b: "float";
    } : A extends "vec4" ? {
        x: "float";
        y: "float";
        z: "float";
        w: "float";
        r: "float";
        g: "float";
        b: "float";
        a: "float";
    } : A extends "ivec2" ? {
        x: "int";
        y: "int";
        r: "int";
        g: "int";
    } : A extends "ivec3" ? {
        x: "int";
        y: "int";
        z: "int";
        r: "int";
        g: "int";
        b: "int";
    } : A extends "ivec4" ? {
        x: "int";
        y: "int";
        z: "int";
        w: "int";
        r: "int";
        g: "int";
        b: "int";
        a: "int";
    } : A extends "uvec2" ? {
        x: "uint";
        y: "uint";
        r: "uint";
        g: "uint";
    } : A extends "uvec3" ? {
        x: "uint";
        y: "uint";
        z: "uint";
        r: "uint";
        g: "uint";
        b: "uint";
    } : A extends "uvec4" ? {
        x: "uint";
        y: "uint";
        z: "uint";
        w: "uint";
        r: "uint";
        g: "uint";
        b: "uint";
        a: "uint";
    } : never;
    export class Split<V extends VectorTypes> extends Dyno<{
        vector: V;
    }, SplitOutTypes<V>> {
        constructor({ vector }: {
            vector: DynoVal<V>;
        });
    }
    export class Combine<V extends VectorTypes, T extends VectorElementType<V>> extends Dyno<SplitOutTypes<V> & {
        vector: V;
    }, {
        vector: V;
    }> implements HasDynoOut<V> {
        constructor({ vector, vectorType, x, y, z, w, r, g, b, a, }: {
            vector?: DynoVal<V>;
            vectorType?: V;
            x?: DynoVal<T>;
            y?: DynoVal<T>;
            z?: DynoVal<T>;
            w?: DynoVal<T>;
            r?: DynoVal<T>;
            g?: DynoVal<T>;
            b?: DynoVal<T>;
            a?: DynoVal<T>;
        });
        dynoOut(): DynoValue<V>;
    }
    type SwizzleOutput<A extends VectorTypes, Len extends number> = A extends FloatTypes ? Len extends 1 ? "float" : Len extends 2 ? "vec2" : Len extends 3 ? "vec3" : Len extends 4 ? "vec4" : never : A extends IntTypes ? Len extends 1 ? "int" : Len extends 2 ? "ivec2" : Len extends 3 ? "ivec3" : Len extends 4 ? "ivec4" : never : A extends UintTypes ? Len extends 1 ? "uint" : Len extends 2 ? "uvec2" : Len extends 3 ? "uvec3" : Len extends 4 ? "uvec4" : never : never;
    type SwizzleSelectLen<S extends SwizzleSelect> = S extends Swizzle1Select ? 1 : S extends Swizzle2Select ? 2 : S extends Swizzle3Select ? 3 : S extends Swizzle4Select ? 4 : never;
    type Swizzle1Select = `${"x" | "y" | "z" | "w"}|${"r" | "g" | "b" | "a"}`;
    type Swizzle2Select = `${"x" | "y" | "z" | "w"}${"x" | "y" | "z" | "w"}` | `${"r" | "g" | "b" | "a"}${"r" | "g" | "b" | "a"}`;
    type Swizzle3Select = `${"x" | "y" | "z" | "w"}${"x" | "y" | "z" | "w"}${"x" | "y" | "z" | "w"}` | `${"r" | "g" | "b" | "a"}${"r" | "g" | "b" | "a"}${"r" | "g" | "b" | "a"}`;
    type Swizzle4Select = `${"x" | "y" | "z" | "w"}${"x" | "y" | "z" | "w"}${"x" | "y" | "z" | "w"}${"x" | "y" | "z" | "w"}` | `${"r" | "g" | "b" | "a"}${"r" | "g" | "b" | "a"}${"r" | "g" | "b" | "a"}${"r" | "g" | "b" | "a"}`;
    type SwizzleSelect = Swizzle1Select | Swizzle2Select | Swizzle3Select | Swizzle4Select;
    export class Swizzle<A extends VectorTypes, S extends SwizzleSelect> extends UnaryOp<A, SwizzleOutput<A, SwizzleSelectLen<S>>, "swizzle"> {
        constructor({ vector, select }: {
            vector: DynoVal<A>;
            select: S;
        });
    }
}
declare module "dyno/util" {
    import { Dyno, DynoBlock } from "dyno/base";
    import { type ValueTypes } from "dyno/types";
    import { type DynoVal, type DynoValue, type HasDynoOut } from "dyno/value";
    export const remapIndex: (index: DynoVal<"int">, from: DynoVal<"int">, to: DynoVal<"int">) => DynoVal<"int">;
    export const pcgMix: <T extends ValueTypes>(value: DynoVal<T>) => DynoVal<"uint">;
    export const pcgNext: (state: DynoVal<"uint">) => DynoVal<"uint">;
    export const pcgHash: (state: DynoVal<"uint">) => DynoVal<"uint">;
    export const hash: <T extends ValueTypes>(value: DynoVal<T>) => DynoVal<"uint">;
    export const hash2: <T extends ValueTypes>(value: DynoVal<T>) => DynoVal<"uvec2">;
    export const hash3: <T extends ValueTypes>(value: DynoVal<T>) => DynoVal<"uvec3">;
    export const hash4: <T extends ValueTypes>(value: DynoVal<T>) => DynoVal<"uvec4">;
    export const hashFloat: <T extends ValueTypes>(value: DynoVal<T>) => DynoVal<"float">;
    export const hashVec2: <T extends ValueTypes>(value: DynoVal<T>) => DynoVal<"vec2">;
    export const hashVec3: <T extends ValueTypes>(value: DynoVal<T>) => DynoVal<"vec3">;
    export const hashVec4: <T extends ValueTypes>(value: DynoVal<T>) => DynoVal<"vec4">;
    export class DynoRemapIndex extends Dyno<{
        from: "int";
        to: "int";
        index: "int";
    }, {
        index: "int";
    }> implements HasDynoOut<"int"> {
        constructor({ from, to, index, }: {
            from: DynoVal<"int">;
            to: DynoVal<"int">;
            index: DynoVal<"int">;
        });
        dynoOut(): DynoValue<"int">;
    }
    export class PcgNext<T extends "uint" | "int" | "float"> extends Dyno<{
        state: T;
    }, {
        state: "uint";
    }> implements HasDynoOut<"uint"> {
        constructor({ state }: {
            state: DynoVal<T>;
        });
        dynoOut(): DynoValue<"uint">;
    }
    export class PcgHash extends Dyno<{
        state: "uint";
    }, {
        hash: "uint";
    }> implements HasDynoOut<"uint"> {
        constructor({ state }: {
            state: DynoVal<"uint">;
        });
        dynoOut(): DynoValue<"uint">;
    }
    export class PcgMix<T extends ValueTypes> extends Dyno<{
        value: T;
    }, {
        state: "uint";
    }> implements HasDynoOut<"uint"> {
        constructor({ value }: {
            value: DynoVal<T>;
        });
        dynoOut(): DynoValue<"uint">;
    }
    export class Hash<T extends ValueTypes> extends DynoBlock<{
        value: T;
    }, {
        hash: "uint";
    }> implements HasDynoOut<"uint"> {
        constructor({ value }: {
            value: DynoVal<T>;
        });
        dynoOut(): DynoValue<"uint">;
    }
    export class Hash2<T extends ValueTypes> extends DynoBlock<{
        value: T;
    }, {
        hash: "uvec2";
    }> implements HasDynoOut<"uvec2"> {
        constructor({ value }: {
            value: DynoVal<T>;
        });
        dynoOut(): DynoValue<"uvec2">;
    }
    export class Hash3<T extends ValueTypes> extends DynoBlock<{
        value: T;
    }, {
        hash: "uvec3";
    }> implements HasDynoOut<"uvec3"> {
        constructor({ value }: {
            value: DynoVal<T>;
        });
        dynoOut(): DynoValue<"uvec3">;
    }
    export class Hash4<T extends ValueTypes> extends DynoBlock<{
        value: T;
    }, {
        hash: "uvec4";
    }> implements HasDynoOut<"uvec4"> {
        constructor({ value }: {
            value: DynoVal<T>;
        });
        dynoOut(): DynoValue<"uvec4">;
    }
    export class HashFloat<T extends ValueTypes> extends DynoBlock<{
        value: T;
    }, {
        hash: "float";
    }> implements HasDynoOut<"float"> {
        constructor({ value }: {
            value: DynoVal<T>;
        });
        dynoOut(): DynoValue<"float">;
    }
    export class HashVec2<T extends ValueTypes> extends DynoBlock<{
        value: T;
    }, {
        hash: "vec2";
    }> implements HasDynoOut<"vec2"> {
        constructor({ value }: {
            value: DynoVal<T>;
        });
        dynoOut(): DynoValue<"vec2">;
    }
    export class HashVec3<T extends ValueTypes> extends DynoBlock<{
        value: T;
    }, {
        hash: "vec3";
    }> implements HasDynoOut<"vec3"> {
        constructor({ value }: {
            value: DynoVal<T>;
        });
        dynoOut(): DynoValue<"vec3">;
    }
    export class HashVec4<T extends ValueTypes> extends DynoBlock<{
        value: T;
    }, {
        hash: "vec4";
    }> implements HasDynoOut<"vec4"> {
        constructor({ value }: {
            value: DynoVal<T>;
        });
        dynoOut(): DynoValue<"vec4">;
    }
}
declare module "dyno/transform" {
    import { Dyno } from "dyno/base";
    import type { DynoVal } from "dyno/value";
    export const transformPos: (position: DynoVal<"vec3">, { scale, scales, rotate, translate, }: {
        scale?: DynoVal<"float">;
        scales?: DynoVal<"vec3">;
        rotate?: DynoVal<"vec4">;
        translate?: DynoVal<"vec3">;
    }) => DynoVal<"vec3">;
    export const transformRay: (ray: DynoVal<"vec3">, { scale, scales, rotate, }: {
        scale?: DynoVal<"float">;
        scales?: DynoVal<"vec3">;
        rotate?: DynoVal<"vec4">;
    }) => DynoVal<"vec3">;
    export const transformQuat: (quaternion: DynoVal<"vec4">, { rotate }: {
        rotate?: DynoVal<"vec4">;
    }) => DynoVal<"vec4">;
    export class TransformPosition extends Dyno<{
        position: "vec3";
        scale: "float";
        scales: "vec3";
        rotate: "vec4";
        translate: "vec3";
    }, {
        position: "vec3";
    }> {
        constructor({ position, scale, scales, rotate, translate, }: {
            position?: DynoVal<"vec3">;
            scale?: DynoVal<"float">;
            scales?: DynoVal<"vec3">;
            rotate?: DynoVal<"vec4">;
            translate?: DynoVal<"vec3">;
        });
    }
    export class TransformRay extends Dyno<{
        ray: "vec3";
        scale: "float";
        scales: "vec3";
        rotate: "vec4";
    }, {
        ray: "vec3";
    }> {
        constructor({ ray, scale, scales, rotate, }: {
            ray?: DynoVal<"vec3">;
            scale?: DynoVal<"float">;
            scales?: DynoVal<"vec3">;
            rotate?: DynoVal<"vec4">;
        });
    }
    export class TransformQuaternion extends Dyno<{
        quaternion: "vec4";
        rotate: "vec4";
    }, {
        quaternion: "vec4";
    }> {
        constructor({ quaternion, rotate, }: {
            quaternion?: DynoVal<"vec4">;
            rotate?: DynoVal<"vec4">;
        });
    }
}
declare module "dyno/control" {
    export const dynoIf: () => never;
    export const dynoSwitch: () => never;
    export const dynoFor: () => never;
    export const comment: () => never;
    export const arrayIndex: () => never;
    export const arrayLength: () => never;
}
declare module "dyno/texture" {
    import { Dyno } from "dyno/base";
    import type { AllSamplerTypes, IsamplerTypes, NormalSamplerTypes, Sampler2DArrayTypes, Sampler2DTypes, Sampler3DTypes, SamplerCubeTypes, SamplerShadowTypes, SamplerTypes, UsamplerTypes } from "dyno/types";
    import { type DynoVal, type DynoValue, type HasDynoOut } from "dyno/value";
    export const textureSize: <T extends AllSamplerTypes>(texture: DynoVal<T>, lod?: DynoVal<"int">) => DynoVal<TextureSizeType<T>>;
    export const texture: <T extends AllSamplerTypes>(texture: DynoVal<T>, coord: DynoVal<TextureCoordType<T>>, bias?: DynoVal<"float">) => DynoVal<TextureReturnType<T>>;
    export const texelFetch: <T extends NormalSamplerTypes>(texture: DynoVal<T>, coord: DynoVal<TextureSizeType<T>>, lod?: DynoVal<"int">) => DynoVal<TextureReturnType<T>>;
    export class TextureSize<T extends AllSamplerTypes> extends Dyno<{
        texture: T;
        lod: "int";
    }, {
        size: TextureSizeType<T>;
    }> implements HasDynoOut<TextureSizeType<T>> {
        constructor({ texture, lod }: {
            texture: DynoVal<T>;
            lod?: DynoVal<"int">;
        });
        dynoOut(): DynoValue<TextureSizeType<T>>;
    }
    export class Texture<T extends AllSamplerTypes> extends Dyno<{
        texture: T;
        coord: TextureCoordType<T>;
        bias: "float";
    }, {
        sample: TextureReturnType<T>;
    }> implements HasDynoOut<TextureReturnType<T>> {
        constructor({ texture, coord, bias, }: {
            texture: DynoVal<T>;
            coord: DynoVal<TextureCoordType<T>>;
            bias?: DynoVal<"float">;
        });
        dynoOut(): DynoValue<TextureReturnType<T>>;
    }
    export class TexelFetch<T extends NormalSamplerTypes> extends Dyno<{
        texture: T;
        coord: TextureSizeType<T>;
        lod: "int";
    }, {
        texel: TextureReturnType<T>;
    }> implements HasDynoOut<TextureReturnType<T>> {
        constructor({ texture, coord, lod, }: {
            texture: DynoVal<T>;
            coord: DynoVal<TextureSizeType<T>>;
            lod?: DynoVal<"int">;
        });
        dynoOut(): DynoValue<TextureReturnType<T>>;
    }
    type TextureSizeType<T extends AllSamplerTypes> = T extends Sampler2DTypes | SamplerCubeTypes ? "ivec2" : T extends Sampler3DTypes | Sampler2DArrayTypes ? "ivec3" : never;
    type TextureCoordType<T extends AllSamplerTypes> = T extends Sampler2DTypes ? "vec2" : T extends Sampler3DTypes | Sampler2DArrayTypes | SamplerCubeTypes | Sampler2DArrayTypes ? "vec3" : T extends "samperCubeShadow" | "sampler2DArrayShadow" ? "vec4" : never;
    type TextureReturnType<T extends AllSamplerTypes> = T extends SamplerTypes ? "vec4" : T extends UsamplerTypes ? "uvec4" : T extends IsamplerTypes ? "ivec4" : T extends SamplerShadowTypes ? "float" : never;
}
declare module "dyno/trig" {
    import { BinaryOp, UnaryOp } from "dyno/base";
    import type { FloatTypes } from "dyno/types";
    import type { DynoVal } from "dyno/value";
    export const radians: <A extends FloatTypes>(degrees: DynoVal<A>) => DynoVal<A>;
    export const degrees: <A extends FloatTypes>(radians: DynoVal<A>) => DynoVal<A>;
    export const sin: <A extends FloatTypes>(radians: DynoVal<A>) => DynoVal<A>;
    export const cos: <A extends FloatTypes>(radians: DynoVal<A>) => DynoVal<A>;
    export const tan: <A extends FloatTypes>(radians: DynoVal<A>) => DynoVal<A>;
    export const asin: <A extends FloatTypes>(sin: DynoVal<A>) => DynoVal<A>;
    export const acos: <A extends FloatTypes>(cos: DynoVal<A>) => DynoVal<A>;
    export const atan: <A extends FloatTypes>(tan: DynoVal<A>) => DynoVal<A>;
    export const atan2: <A extends FloatTypes>(y: DynoVal<A>, x: DynoVal<A>) => DynoVal<A>;
    export const sinh: <A extends FloatTypes>(x: DynoVal<A>) => DynoVal<A>;
    export const cosh: <A extends FloatTypes>(x: DynoVal<A>) => DynoVal<A>;
    export const tanh: <A extends FloatTypes>(x: DynoVal<A>) => DynoVal<A>;
    export const asinh: <A extends FloatTypes>(x: DynoVal<A>) => DynoVal<A>;
    export const acosh: <A extends FloatTypes>(x: DynoVal<A>) => DynoVal<A>;
    export const atanh: <A extends FloatTypes>(x: DynoVal<A>) => DynoVal<A>;
    export class Radians<A extends FloatTypes> extends UnaryOp<A, A, "radians"> {
        constructor({ degrees }: {
            degrees: DynoVal<A>;
        });
    }
    export class Degrees<A extends FloatTypes> extends UnaryOp<A, A, "degrees"> {
        constructor({ radians }: {
            radians: DynoVal<A>;
        });
    }
    export class Sin<A extends FloatTypes> extends UnaryOp<A, A, "sin"> {
        constructor({ radians }: {
            radians: DynoVal<A>;
        });
    }
    export class Cos<A extends FloatTypes> extends UnaryOp<A, A, "cos"> {
        constructor({ radians }: {
            radians: DynoVal<A>;
        });
    }
    export class Tan<A extends FloatTypes> extends UnaryOp<A, A, "tan"> {
        constructor({ radians }: {
            radians: DynoVal<A>;
        });
    }
    export class Asin<A extends FloatTypes> extends UnaryOp<A, A, "asin"> {
        constructor({ sin }: {
            sin: DynoVal<A>;
        });
    }
    export class Acos<A extends FloatTypes> extends UnaryOp<A, A, "acos"> {
        constructor({ cos }: {
            cos: DynoVal<A>;
        });
    }
    export class Atan<A extends FloatTypes> extends UnaryOp<A, A, "atan"> {
        constructor({ tan }: {
            tan: DynoVal<A>;
        });
    }
    export class Atan2<A extends FloatTypes> extends BinaryOp<A, A, A, "atan2"> {
        constructor({ y, x }: {
            y: DynoVal<A>;
            x: DynoVal<A>;
        });
    }
    export class Sinh<A extends FloatTypes> extends UnaryOp<A, A, "sinh"> {
        constructor({ x }: {
            x: DynoVal<A>;
        });
    }
    export class Cosh<A extends FloatTypes> extends UnaryOp<A, A, "cosh"> {
        constructor({ x }: {
            x: DynoVal<A>;
        });
    }
    export class Tanh<A extends FloatTypes> extends UnaryOp<A, A, "tanh"> {
        constructor({ x }: {
            x: DynoVal<A>;
        });
    }
    export class Asinh<A extends FloatTypes> extends UnaryOp<A, A, "asinh"> {
        constructor({ x }: {
            x: DynoVal<A>;
        });
    }
    export class Acosh<A extends FloatTypes> extends UnaryOp<A, A, "acosh"> {
        constructor({ x }: {
            x: DynoVal<A>;
        });
    }
    export class Atanh<A extends FloatTypes> extends UnaryOp<A, A, "atanh"> {
        constructor({ x }: {
            x: DynoVal<A>;
        });
    }
}
declare module "dyno" {
    export * from "dyno/types";
    export * from "dyno/base";
    export * from "dyno/value";
    export * from "dyno/output";
    export * from "dyno/uniforms";
    export * from "dyno/program";
    export * from "dyno/math";
    export * from "dyno/logic";
    export * from "dyno/util";
    export * from "dyno/splats";
    export * from "dyno/transform";
    export * from "dyno/control";
    export * from "dyno/convert";
    export * from "dyno/texture";
    export * from "dyno/trig";
    export * from "dyno/vecmat";
}
declare module "SplatEdit" {
    import * as THREE from "three";
    import { DynoUniform, type DynoVal, Gsplat } from "dyno";
    export enum SplatEditSdfType {
        ALL = "all",
        PLANE = "plane",
        SPHERE = "sphere",
        BOX = "box",
        ELLIPSOID = "ellipsoid",
        CYLINDER = "cylinder",
        CAPSULE = "capsule",
        INFINITE_CONE = "infinite_cone"
    }
    export enum SplatEditRgbaBlendMode {
        MULTIPLY = "multiply",
        SET_RGB = "set_rgb",
        ADD_RGBA = "add_rgba"
    }
    export type SplatEditSdfOptions = {
        type?: SplatEditSdfType;
        invert?: boolean;
        opacity?: number;
        color?: THREE.Color;
        displace?: THREE.Vector3;
        radius?: number;
    };
    export class SplatEditSdf extends THREE.Object3D {
        type: SplatEditSdfType;
        invert: boolean;
        opacity: number;
        color: THREE.Color;
        displace: THREE.Vector3;
        radius: number;
        constructor(options?: SplatEditSdfOptions);
    }
    export type SplatEditOptions = {
        name?: string;
        rgbaBlendMode?: SplatEditRgbaBlendMode;
        sdfSmooth?: number;
        softEdge?: number;
        invert?: boolean;
        sdfs?: SplatEditSdf[];
    };
    export class SplatEdit extends THREE.Object3D {
        ordering: number;
        rgbaBlendMode: SplatEditRgbaBlendMode;
        sdfSmooth: number;
        softEdge: number;
        invert: boolean;
        sdfs: SplatEditSdf[] | null;
        static nextOrdering: number;
        constructor(options?: SplatEditOptions);
        addSdf(sdf: SplatEditSdf): void;
        removeSdf(sdf: SplatEditSdf): void;
    }
    export class SplatEdits {
        maxSdfs: number;
        numSdfs: number;
        sdfData: Uint32Array;
        sdfFloatData: Float32Array;
        sdfTexture: THREE.DataTexture;
        dynoSdfArray: DynoUniform<typeof SdfArray, "sdfArray">;
        maxEdits: number;
        numEdits: number;
        editData: Uint32Array;
        editFloatData: Float32Array;
        dynoNumEdits: DynoUniform<"int", "numEdits">;
        dynoEdits: DynoUniform<"uvec4", "edits">;
        constructor({ maxSdfs, maxEdits }: {
            maxSdfs?: number;
            maxEdits?: number;
        });
        private newSdfTexture;
        private newEdits;
        private ensureCapacity;
        private updateEditData;
        private updateEditFloatData;
        private encodeEdit;
        private updateSdfData;
        private updateSdfFloatData;
        private encodeSdf;
        update(edits: {
            edit: SplatEdit;
            sdfs: SplatEditSdf[];
        }[]): {
            updated: boolean;
            dynoUpdated: boolean;
        };
        modify(gsplat: DynoVal<typeof Gsplat>): DynoVal<typeof Gsplat>;
    }
    export const SdfArray: {
        type: "SdfArray";
    };
    export const defineSdfArray: string;
    export const defineEdit: string;
}
declare module "SplatGenerator" {
    import * as THREE from "three";
    import type { SplatEdit } from "SplatEdit";
    import { type Dyno, DynoFloat, type DynoVal, DynoVec3, DynoVec4, Gsplat } from "dyno";
    export type GsplatGenerator = Dyno<{
        index: "int";
    }, {
        gsplat: typeof Gsplat;
    }>;
    export type GsplatModifier = Dyno<{
        gsplat: typeof Gsplat;
    }, {
        gsplat: typeof Gsplat;
    }>;
    export class SplatModifier {
        modifier: GsplatModifier;
        cache: Map<GsplatGenerator, GsplatGenerator>;
        constructor(modifier: GsplatModifier);
        apply(generator: GsplatGenerator): GsplatGenerator;
    }
    export class SplatTransformer {
        scale: DynoFloat;
        rotate: DynoVec4<THREE.Quaternion>;
        translate: DynoVec3<THREE.Vector3>;
        constructor();
        modify(gsplat: DynoVal<typeof Gsplat>): DynoVal<typeof Gsplat>;
        updateFromMatrix(transform: THREE.Matrix4): boolean;
        update(object: THREE.Object3D): boolean;
    }
    export class SplatGenerator extends THREE.Object3D {
        numSplats: number;
        generator?: GsplatGenerator;
        generatorError?: unknown;
        frameUpdate?: ({ object, time, deltaTime, viewToWorld, globalEdits, }: {
            object: SplatGenerator;
            time: number;
            deltaTime: number;
            viewToWorld: THREE.Matrix4;
            globalEdits: SplatEdit[];
        }) => void;
        version: number;
        constructor({ numSplats, generator, construct, update, }: {
            numSplats?: number;
            generator?: GsplatGenerator;
            construct?: (object: SplatGenerator) => {
                generator?: GsplatGenerator;
                numSplats?: number;
                frameUpdate?: (object: SplatGenerator) => void;
            };
            update?: ({ object, time, deltaTime, viewToWorld, globalEdits, }: {
                object: SplatGenerator;
                time: number;
                deltaTime: number;
                viewToWorld: THREE.Matrix4;
                globalEdits: SplatEdit[];
            }) => void;
        });
        updateVersion(): void;
        set needsUpdate(value: boolean);
    }
}
declare module "Readback" {
    import * as THREE from "three";
    import { type Dyno } from "dyno";
    import { DynoProgram, DynoProgramTemplate } from "dyno/program";
    export type Rgba8Readback = Dyno<{
        index: "int";
    }, {
        rgba8: "vec4";
    }>;
    export type ReadbackBuffer = ArrayBuffer | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | Float32Array;
    export class Readback {
        renderer?: THREE.WebGLRenderer;
        target?: THREE.WebGLArrayRenderTarget;
        capacity: number;
        count: number;
        constructor({ renderer }?: {
            renderer?: THREE.WebGLRenderer;
        });
        dispose(): void;
        ensureBuffer<B extends ReadbackBuffer>(count: number, buffer: B): B;
        ensureCapacity(capacity: number): void;
        prepareProgramMaterial(reader: Rgba8Readback): {
            program: DynoProgram;
            material: THREE.RawShaderMaterial;
        };
        private saveRenderState;
        private resetRenderState;
        private process;
        private read;
        render({ reader, count, renderer, }: {
            reader: Rgba8Readback;
            count: number;
            renderer?: THREE.WebGLRenderer;
        }): void;
        readback<B extends ReadbackBuffer>({ readback, }: {
            readback: B;
        }): Promise<B>;
        renderReadback<B extends ReadbackBuffer>({ reader, count, renderer, readback, }: {
            reader: Rgba8Readback;
            count: number;
            renderer?: THREE.WebGLRenderer;
            readback: B;
        }): Promise<B>;
        getTexture(): THREE.DataArrayTexture | undefined;
        static programTemplate: DynoProgramTemplate | null;
        static readbackProgram: Map<Rgba8Readback, DynoProgram>;
        static geometry: THREE.PlaneGeometry;
        static mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial, THREE.Object3DEventMap>;
        static scene: THREE.Scene;
        static camera: THREE.Camera;
    }
}
declare module "RgbaArray" {
    import * as THREE from "three";
    import { type PackedSplats } from "PackedSplats";
    import { Readback, type Rgba8Readback } from "Readback";
    import { DynoUniform, type DynoVal } from "dyno";
    export type RgbaArrayOptions = {
        capacity?: number;
        array?: Uint8Array;
        count?: number;
    };
    export class RgbaArray {
        capacity: number;
        count: number;
        array: Uint8Array | null;
        readback: Readback | null;
        source: THREE.DataArrayTexture | null;
        needsUpdate: boolean;
        dyno: DynoUniform<typeof TRgbaArray, "rgbaArray">;
        constructor(options?: RgbaArrayOptions);
        dispose(): void;
        ensureCapacity(capacity: number): Uint8Array;
        getTexture(): THREE.DataArrayTexture;
        private maybeUpdateSource;
        render({ reader, count, renderer, }: {
            reader: Rgba8Readback;
            count: number;
            renderer: THREE.WebGLRenderer;
        }): void;
        fromPackedSplats({ packedSplats, base, count, renderer, }: {
            packedSplats: PackedSplats;
            base: number;
            count: number;
            renderer: THREE.WebGLRenderer;
        }): this;
        read(): Promise<Uint8Array>;
        private static emptySource;
        static getEmpty(): THREE.DataArrayTexture;
        private static dynos;
        private static makeDynos;
    }
    export const TRgbaArray: {
        type: "RgbaArray";
    };
    export const defineRgbaArray: string;
    export function readRgbaArray(rgba: DynoVal<typeof TRgbaArray>, index: DynoVal<"int">): DynoVal<"vec4">;
}
declare module "SplatSkinning" {
    import * as THREE from "three";
    import type { SplatMesh } from "SplatMesh";
    import { DynoUniform, type DynoVal, Gsplat } from "dyno";
    export type SplatSkinningOptions = {
        mesh: SplatMesh;
        numSplats?: number;
        numBones?: number;
    };
    export class SplatSkinning {
        mesh: SplatMesh;
        numSplats: number;
        skinData: Uint16Array;
        skinTexture: THREE.DataArrayTexture;
        numBones: number;
        boneData: Float32Array;
        boneTexture: THREE.DataTexture;
        uniform: DynoUniform<typeof GsplatSkinning, "skinning">;
        constructor(options: SplatSkinningOptions);
        modify(gsplat: DynoVal<typeof Gsplat>): DynoVal<typeof Gsplat>;
        setRestQuatPos(boneIndex: number, quat: THREE.Quaternion, pos: THREE.Vector3): void;
        setBoneQuatPos(boneIndex: number, quat: THREE.Quaternion, pos: THREE.Vector3): void;
        setSplatBones(splatIndex: number, boneIndices: THREE.Vector4, weights: THREE.Vector4): void;
        updateBones(): void;
    }
    export const GsplatSkinning: {
        type: "GsplatSkinning";
    };
    export const defineGsplatSkinning: string;
    export const defineApplyGsplatSkinning: string;
}
declare module "SplatMesh" {
    import * as THREE from "three";
    import { PackedSplats } from "PackedSplats";
    import { type RgbaArray } from "RgbaArray";
    import { SplatEdit } from "SplatEdit";
    import { type GsplatModifier, SplatGenerator, SplatTransformer } from "SplatGenerator";
    import type { SplatFileType } from "SplatLoader";
    import type { SplatSkinning } from "SplatSkinning";
    import { DynoFloat, DynoUsampler2DArray, type DynoVal, DynoVec4, Gsplat } from "dyno";
    export type SplatMeshOptions = {
        url?: string;
        fileBytes?: Uint8Array | ArrayBuffer;
        fileType?: SplatFileType;
        packedSplats?: PackedSplats;
        maxSplats?: number;
        constructSplats?: (splats: PackedSplats) => Promise<void> | void;
        onLoad?: (mesh: SplatMesh) => Promise<void> | void;
        editable?: boolean;
        onFrame?: ({ mesh, time, deltaTime, }: {
            mesh: SplatMesh;
            time: number;
            deltaTime: number;
        }) => void;
        objectModifier?: GsplatModifier;
        worldModifier?: GsplatModifier;
    };
    export type SplatMeshContext = {
        transform: SplatTransformer;
        viewToWorld: SplatTransformer;
        worldToView: SplatTransformer;
        viewToObject: SplatTransformer;
        recolor: DynoVec4<THREE.Vector4>;
        time: DynoFloat;
        deltaTime: DynoFloat;
    };
    export class SplatMesh extends SplatGenerator {
        initialized: Promise<SplatMesh>;
        isInitialized: boolean;
        packedSplats: PackedSplats;
        recolor: THREE.Color;
        opacity: number;
        context: SplatMeshContext;
        onFrame?: ({ mesh, time, deltaTime, }: {
            mesh: SplatMesh;
            time: number;
            deltaTime: number;
        }) => void;
        objectModifier?: GsplatModifier;
        worldModifier?: GsplatModifier;
        enableViewToObject: boolean;
        enableViewToWorld: boolean;
        enableWorldToView: boolean;
        skinning: SplatSkinning | null;
        edits: SplatEdit[] | null;
        editable: boolean;
        private rgbaDisplaceEdits;
        splatRgba: RgbaArray | null;
        maxSh: number;
        constructor(options?: SplatMeshOptions);
        asyncInitialize(options: SplatMeshOptions): Promise<void>;
        static staticInitialized: Promise<void>;
        static isStaticInitialized: boolean;
        static dynoTime: DynoFloat<"value">;
        static staticInitialize(): Promise<void>;
        pushSplat(center: THREE.Vector3, scales: THREE.Vector3, quaternion: THREE.Quaternion, opacity: number, color: THREE.Color): void;
        forEachSplat(callback: (index: number, center: THREE.Vector3, scales: THREE.Vector3, quaternion: THREE.Quaternion, opacity: number, color: THREE.Color) => void): void;
        dispose(): void;
        constructGenerator({ transform, viewToObject, recolor }: SplatMeshContext): void;
        updateGenerator(): void;
        update({ time, viewToWorld, deltaTime, globalEdits, }: {
            time: number;
            viewToWorld: THREE.Matrix4;
            deltaTime: number;
            globalEdits: SplatEdit[];
        }): void;
        raycast(raycaster: THREE.Raycaster, intersects: {
            distance: number;
            point: THREE.Vector3;
            object: THREE.Object3D;
        }[]): void;
        private ensureShTextures;
    }
    export function evaluateSH1(gsplat: DynoVal<typeof Gsplat>, sh1: DynoUsampler2DArray<"sh1", THREE.DataArrayTexture>, viewDir: DynoVal<"vec3">): DynoVal<"vec3">;
    export function evaluateSH2(gsplat: DynoVal<typeof Gsplat>, sh2: DynoVal<"usampler2DArray">, viewDir: DynoVal<"vec3">): DynoVal<"vec3">;
    export function evaluateSH3(gsplat: DynoVal<typeof Gsplat>, sh3: DynoVal<"usampler2DArray">, viewDir: DynoVal<"vec3">): DynoVal<"vec3">;
}
declare module "ply" {
    export type PlyPropertyType = "char" | "uchar" | "short" | "ushort" | "int" | "uint" | "float" | "double";
    export type PlyElement = {
        name: string;
        count: number;
        properties: Record<string, PlyProperty>;
    };
    export type PlyProperty = {
        isList: boolean;
        type: PlyPropertyType;
        countType?: PlyPropertyType;
    };
    export type SplatCallback = (index: number, x: number, y: number, z: number, scaleX: number, scaleY: number, scaleZ: number, quatX: number, quatY: number, quatZ: number, quatW: number, opacity: number, r: number, g: number, b: number) => void;
    export type SplatShCallback = (index: number, sh1: Float32Array, sh2?: Float32Array, sh3?: Float32Array) => void;
    export class PlyReader {
        fileBytes: Uint8Array;
        header: string;
        littleEndian: boolean;
        elements: Record<string, PlyElement>;
        comments: string[];
        data: DataView | null;
        static defaultPointScale: number;
        numSplats: number;
        constructor({ fileBytes }: {
            fileBytes: Uint8Array | ArrayBuffer;
        });
        parseHeader(): Promise<void>;
        parseData(elementCallback: (element: PlyElement) => null | ((index: number, item: Record<string, number | number[]>) => void)): void;
        parseSplats(splatCallback: SplatCallback, shCallback?: SplatShCallback): void;
        injectRgba(rgba: Uint8Array): void;
    }
    export const SH_C0 = 0.28209479177387814;
}
declare module "splatWorker" {
    export class SplatWorker {
        worker: Worker;
        messages: Record<number, {
            resolve: (value: unknown) => void;
            reject: (reason?: unknown) => void;
        }>;
        messageIdNext: number;
        constructor();
        makeMessageId(): number;
        makeMessagePromiseId(): {
            id: number;
            promise: Promise<unknown>;
        };
        onMessage(event: MessageEvent): void;
        call(name: string, args: unknown): Promise<unknown>;
    }
    export function setWorkerPool(count?: number): void;
    export function allocWorker(): Promise<SplatWorker>;
    export function freeWorker(worker: SplatWorker): void;
    export function withWorker<T>(callback: (worker: SplatWorker) => Promise<T>): Promise<T>;
}
declare module "SplatLoader" {
    import { FileLoader, Loader, type LoadingManager } from "three";
    import { PackedSplats } from "PackedSplats";
    import { SplatMesh } from "SplatMesh";
    export class SplatLoader extends Loader {
        fileLoader: FileLoader;
        fileType?: SplatFileType;
        constructor(manager?: LoadingManager);
        load(url: string, onLoad?: (decoded: PackedSplats) => void, onProgress?: (event: ProgressEvent) => void, onError?: (error: unknown) => void): void;
        loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<PackedSplats>;
        parse(packedSplats: PackedSplats): SplatMesh;
    }
    export enum SplatFileType {
        PLY = "ply",
        WLG0 = "wlg0",
        SPZ = "spz",
        SPLAT = "splat",
        KSPLAT = "ksplat"
    }
    export function getSplatFileType(fileBytes: Uint8Array): SplatFileType | undefined;
    export function getFileExtension(pathOrUrl: string): string;
    export function unpackSplats({ input, fileType, pathOrUrl, }: {
        input: Uint8Array | ArrayBuffer;
        fileType?: SplatFileType;
        pathOrUrl?: string;
    }): Promise<{
        packedArray: Uint32Array;
        numSplats: number;
        extra?: Record<string, unknown>;
    }>;
}
declare module "PackedSplats" {
    import * as THREE from "three";
    import type { GsplatGenerator } from "SplatGenerator";
    import { type SplatFileType } from "SplatLoader";
    import { DynoProgram, DynoProgramTemplate, DynoUniform } from "dyno";
    import { TPackedSplats } from "dyno/splats";
    export type PackedSplatsOptions = {
        url?: string;
        fileBytes?: Uint8Array | ArrayBuffer;
        fileType?: SplatFileType;
        maxSplats?: number;
        packedArray?: Uint32Array;
        numSplats?: number;
        construct?: (splats: PackedSplats) => Promise<void> | void;
        extra?: Record<string, unknown>;
    };
    export class PackedSplats {
        maxSplats: number;
        numSplats: number;
        packedArray: Uint32Array | null;
        extra: Record<string, unknown>;
        initialized: Promise<PackedSplats>;
        isInitialized: boolean;
        target: THREE.WebGLArrayRenderTarget | null;
        source: THREE.DataArrayTexture | null;
        needsUpdate: boolean;
        dyno: DynoUniform<typeof TPackedSplats, "packedSplats">;
        constructor(options?: PackedSplatsOptions);
        reinitialize(options: PackedSplatsOptions): void;
        initialize(options: PackedSplatsOptions): void;
        asyncInitialize(options: PackedSplatsOptions): Promise<void>;
        dispose(): void;
        ensureSplats(numSplats: number): Uint32Array;
        ensureSplatsSh(level: number, numSplats: number): Uint32Array;
        getSplat(index: number): {
            center: THREE.Vector3;
            scales: THREE.Vector3;
            quaternion: THREE.Quaternion;
            opacity: number;
            color: THREE.Color;
        };
        setSplat(index: number, center: THREE.Vector3, scales: THREE.Vector3, quaternion: THREE.Quaternion, opacity: number, color: THREE.Color): void;
        pushSplat(center: THREE.Vector3, scales: THREE.Vector3, quaternion: THREE.Quaternion, opacity: number, color: THREE.Color): void;
        forEachSplat(callback: (index: number, center: THREE.Vector3, scales: THREE.Vector3, quaternion: THREE.Quaternion, opacity: number, color: THREE.Color) => void): void;
        ensureGenerate(maxSplats: number): boolean;
        generateMapping(splatCounts: number[]): {
            maxSplats: number;
            mapping: {
                base: number;
                count: number;
            }[];
        };
        getTexture(): THREE.DataArrayTexture;
        private maybeUpdateSource;
        private static emptySource;
        static getEmpty(): THREE.DataArrayTexture;
        prepareProgramMaterial(generator: GsplatGenerator): {
            program: DynoProgram;
            material: THREE.RawShaderMaterial;
        };
        private saveRenderState;
        private resetRenderState;
        generate({ generator, base, count, renderer, }: {
            generator: GsplatGenerator;
            base: number;
            count: number;
            renderer: THREE.WebGLRenderer;
        }): {
            nextBase: number;
        };
        static programTemplate: DynoProgramTemplate | null;
        static generatorProgram: Map<GsplatGenerator, DynoProgram>;
        static geometry: THREE.PlaneGeometry;
        static mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial, THREE.Object3DEventMap>;
        static scene: THREE.Scene;
        static camera: THREE.Camera;
    }
    export const dynoPackedSplats: (packedSplats?: PackedSplats) => DynoPackedSplats;
    export class DynoPackedSplats extends DynoUniform<typeof TPackedSplats, "packedSplats", {
        texture: THREE.DataArrayTexture;
        numSplats: number;
    }> {
        packedSplats?: PackedSplats;
        constructor({ packedSplats }?: {
            packedSplats?: PackedSplats;
        });
    }
}
declare module "SplatAccumulator" {
    import * as THREE from "three";
    import { PackedSplats } from "PackedSplats";
    import type { GsplatGenerator, SplatGenerator, SplatModifier } from "SplatGenerator";
    export type GeneratorMapping = {
        node: SplatGenerator;
        generator?: GsplatGenerator;
        version: number;
        base: number;
        count: number;
    };
    export class SplatAccumulator {
        splats: PackedSplats;
        toWorld: THREE.Matrix4;
        mapping: GeneratorMapping[];
        refCount: number;
        splatsVersion: number;
        mappingVersion: number;
        ensureGenerate(maxSplats: number): void;
        generateSplats({ renderer, modifier, generators, forceUpdate, originToWorld, }: {
            renderer: THREE.WebGLRenderer;
            modifier: SplatModifier;
            generators: GeneratorMapping[];
            forceUpdate?: boolean;
            originToWorld: THREE.Matrix4;
        }): boolean;
        hasCorrespondence(other: SplatAccumulator): boolean;
    }
}
declare module "SplatGeometry" {
    import * as THREE from "three";
    export class SplatGeometry extends THREE.InstancedBufferGeometry {
        ordering: Uint32Array;
        attribute: THREE.InstancedBufferAttribute;
        constructor(ordering: Uint32Array, activeSplats: number);
        update(ordering: Uint32Array, activeSplats: number): void;
    }
}
declare module "ForgeViewpoint" {
    import * as THREE from "three";
    import type { ForgeRenderer } from "ForgeRenderer";
    import type { SplatAccumulator } from "SplatAccumulator";
    import { SplatGeometry } from "SplatGeometry";
    export type ForgeViewpointOptions = {
        autoUpdate?: boolean;
        camera?: THREE.Camera;
        viewToWorld?: THREE.Matrix4;
        target?: {
            width: number;
            height: number;
            doubleBuffer?: boolean;
            superXY?: number;
        };
        onTextureUpdated?: (texture: THREE.Texture) => void;
        sortRadial?: boolean;
        sortDistance?: number;
        sortCoorient?: boolean;
        depthBias?: number;
        sort360?: boolean;
    };
    export class ForgeViewpoint {
        forge: ForgeRenderer;
        autoUpdate: boolean;
        camera?: THREE.Camera;
        viewToWorld: THREE.Matrix4;
        lastTime: number | null;
        target?: THREE.WebGLRenderTarget;
        private back?;
        onTextureUpdated?: (texture: THREE.Texture) => void;
        encodeLinear: boolean;
        superXY: number;
        private superPixels?;
        private pixels?;
        sortRadial: boolean;
        sortDistance?: number;
        sortCoorient?: boolean;
        depthBias?: number;
        sort360?: boolean;
        display: {
            accumulator: SplatAccumulator;
            viewToWorld: THREE.Matrix4;
            geometry: SplatGeometry;
        } | null;
        private sorting;
        private pending;
        private sortingCheck;
        private readback;
        private orderingFreelist;
        constructor(options: ForgeViewpointOptions & {
            forge: ForgeRenderer;
        });
        dispose(): void;
        setAutoUpdate(autoUpdate: boolean): void;
        prepare({ scene, camera, viewToWorld, update, forceOrigin, }: {
            scene: THREE.Scene;
            camera?: THREE.Camera;
            viewToWorld?: THREE.Matrix4;
            update?: boolean;
            forceOrigin?: boolean;
        }): Promise<void>;
        renderTarget({ scene, camera, }: {
            scene: THREE.Scene;
            camera?: THREE.Camera;
        }): void;
        readTarget(): Promise<Uint8Array>;
        prepareRenderPixels({ scene, camera, viewToWorld, update, forceOrigin, }: {
            scene: THREE.Scene;
            camera?: THREE.Camera;
            viewToWorld?: THREE.Matrix4;
            update?: boolean;
            forceOrigin?: boolean;
        }): Promise<Uint8Array<ArrayBufferLike>>;
        autoPoll({ accumulator }: {
            accumulator?: SplatAccumulator;
        }): void;
        private driveSort;
        private sortUpdate;
        private updateDisplay;
        static EMPTY_TEXTURE: THREE.Texture;
        private static dynos;
        private static makeSorter;
    }
}
declare module "shaders" {
    export function getShaders(): Record<string, string>;
}
declare module "ForgeRenderer" {
    import * as THREE from "three";
    import { ForgeViewpoint, type ForgeViewpointOptions } from "ForgeViewpoint";
    import { RgbaArray } from "RgbaArray";
    import { SplatAccumulator } from "SplatAccumulator";
    import { SplatGenerator } from "SplatGenerator";
    export type ForgeRendererOptions = {
        renderer: THREE.WebGLRenderer;
        clock?: THREE.Clock;
        autoUpdate?: boolean;
        preUpdate?: boolean;
        originDistance?: number;
        maxStdDev?: number;
        enable2DGS?: boolean;
        preBlurAmount?: number;
        blurAmount?: number;
        falloff?: number;
        clipXY?: number;
        view?: ForgeViewpointOptions;
    };
    export class ForgeRenderer extends THREE.Mesh {
        renderer: THREE.WebGLRenderer;
        material: THREE.ShaderMaterial;
        uniforms: ReturnType<typeof ForgeRenderer.makeUniforms>;
        autoUpdate: boolean;
        preUpdate: boolean;
        originDistance: number;
        maxStdDev: number;
        enable2DGS: boolean;
        preBlurAmount: number;
        blurAmount: number;
        falloff: number;
        clipXY: number;
        time?: number;
        deltaTime?: number;
        clock: THREE.Clock;
        active: SplatAccumulator;
        private freeAccumulators;
        private accumulatorCount;
        defaultView: ForgeViewpoint;
        autoViewpoints: ForgeViewpoint[];
        private rotateToAccumulator;
        private translateToAccumulator;
        private modifier;
        private lastFrame;
        private lastUpdateTime;
        private defaultCameras;
        viewpoint: ForgeViewpoint;
        private pendingUpdate;
        private envViewpoint;
        private static cubeRender;
        private static pmrem;
        constructor(options: ForgeRendererOptions);
        static makeUniforms(): {
            renderSize: {
                value: THREE.Vector2;
            };
            numSplats: {
                value: number;
            };
            renderToViewQuat: {
                value: THREE.Quaternion;
            };
            renderToViewPos: {
                value: THREE.Vector3;
            };
            maxStdDev: {
                value: number;
            };
            enable2DGS: {
                value: boolean;
            };
            preBlurAmount: {
                value: number;
            };
            blurAmount: {
                value: number;
            };
            falloff: {
                value: number;
            };
            clipXY: {
                value: number;
            };
            packedSplats: {
                type: string;
                value: THREE.DataArrayTexture;
            };
            time: {
                value: number;
            };
            deltaTime: {
                value: number;
            };
            encodeLinear: {
                value: boolean;
            };
            debugFlag: {
                value: boolean;
            };
        };
        private canAllocAccumulator;
        private maybeAllocAccumulator;
        releaseAccumulator(accumulator: SplatAccumulator): void;
        newViewpoint(options: ForgeViewpointOptions): ForgeViewpoint;
        onBeforeRender(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): void;
        prepareViewpoint(viewpoint?: ForgeViewpoint): void;
        update({ scene, viewToWorld, }: {
            scene: THREE.Scene;
            viewToWorld?: THREE.Matrix4;
        }): void;
        updateInternal({ scene, originToWorld, viewToWorld, }: {
            scene: THREE.Scene;
            originToWorld?: THREE.Matrix4;
            viewToWorld?: THREE.Matrix4;
        }): boolean;
        private compileScene;
        renderEnvMap({ renderer, scene, worldCenter, size, near, far, hideObjects, update, }: {
            renderer?: THREE.WebGLRenderer;
            scene: THREE.Scene;
            worldCenter: THREE.Vector3;
            size?: number;
            near?: number;
            far?: number;
            hideObjects?: THREE.Object3D[];
            update?: boolean;
        }): Promise<THREE.Texture>;
        recurseSetEnvMap(root: THREE.Object3D, envMap: THREE.Texture): void;
        getRgba({ generator, rgba, }: {
            generator: SplatGenerator;
            rgba?: RgbaArray;
        }): RgbaArray;
        readRgba({ generator, rgba, }: {
            generator: SplatGenerator;
            rgba?: RgbaArray;
        }): Promise<Uint8Array>;
    }
}
declare module "controls" {
    import * as THREE from "three";
    export class ForgeControls {
        fpsMovement: FpsMovement;
        pointerControls: PointerControls;
        lastTime: number;
        constructor({ canvas }: {
            canvas: HTMLCanvasElement;
        });
        update(control: THREE.Object3D): void;
    }
    export class FpsMovement {
        moveSpeed: number;
        rollSpeed: number;
        stickThreshold: number;
        rotateSpeed: number;
        keycodeMoveMapping: {
            [key: string]: THREE.Vector3;
        };
        keycodeRotateMapping: {
            [key: string]: THREE.Vector3;
        };
        gamepadMapping: {
            [button: number]: "shift" | "ctrl" | "rollLeft" | "rollRight";
        };
        capsMultiplier: number;
        shiftMultiplier: number;
        ctrlMultiplier: number;
        xr?: THREE.WebXRManager;
        enable: boolean;
        keydown: {
            [key: string]: boolean;
        };
        keycode: {
            [key: string]: boolean;
        };
        constructor({ moveSpeed, rollSpeed, stickThreshold, rotateSpeed, keycodeMoveMapping, keycodeRotateMapping, gamepadMapping, capsMultiplier, shiftMultiplier, ctrlMultiplier, xr, }?: {
            moveSpeed?: number;
            rollSpeed?: number;
            stickThreshold?: number;
            rotateSpeed?: number;
            keycodeMoveMapping?: {
                [key: string]: THREE.Vector3;
            };
            keycodeRotateMapping?: {
                [key: string]: THREE.Vector3;
            };
            gamepadMapping?: {
                [button: number]: "shift" | "ctrl" | "rollLeft" | "rollRight";
            };
            capsMultiplier?: number;
            shiftMultiplier?: number;
            ctrlMultiplier?: number;
            xr?: THREE.WebXRManager;
        });
        update(deltaTime: number, control: THREE.Object3D): void;
    }
    type PointerState = {
        initial: THREE.Vector2;
        last: THREE.Vector2;
        position: THREE.Vector2;
        pointerId: number;
        button?: number;
        timeStamp: DOMHighResTimeStamp;
    };
    export class PointerControls {
        canvas: HTMLCanvasElement;
        rotateSpeed: number;
        slideSpeed: number;
        scrollSpeed: number;
        reverseRotate: boolean;
        reverseSlide: boolean;
        reverseSwipe: boolean;
        reverseScroll: boolean;
        moveInertia: number;
        rotateInertia: number;
        enable: boolean;
        doublePress: ({ position, intervalMs, }: {
            position: THREE.Vector2;
            intervalMs: number;
        }) => void;
        doublePressLimitMs: number;
        doublePressDistance: number;
        lastUp: {
            position: THREE.Vector2;
            time: number;
        } | null;
        rotating: PointerState | null;
        sliding: PointerState | null;
        dualPress: boolean;
        scroll: THREE.Vector3;
        rotateVelocity: THREE.Vector3;
        moveVelocity: THREE.Vector3;
        constructor({ canvas, rotateSpeed, slideSpeed, scrollSpeed, reverseRotate, reverseSlide, reverseSwipe, reverseScroll, moveInertia, rotateInertia, doublePress, }: {
            canvas: HTMLCanvasElement;
            rotateSpeed?: number;
            slideSpeed?: number;
            scrollSpeed?: number;
            reverseRotate?: boolean;
            reverseSlide?: boolean;
            reverseSwipe?: boolean;
            reverseScroll?: boolean;
            moveInertia?: number;
            rotateInertia?: number;
            doublePress?: ({ position, intervalMs, }: {
                position: THREE.Vector2;
                intervalMs: number;
            }) => void;
        });
        getPointerPosition(event: PointerEvent): THREE.Vector2;
        update(deltaTime: number, control: THREE.Object3D): void;
    }
}
declare module "generators/static" {
    import * as THREE from "three";
    import { SplatGenerator } from "SplatGenerator";
    export function staticBox({ box, cells, dotScale, color, opacity, }: {
        box: THREE.Box3;
        cells: THREE.Vector3;
        dotScale: number;
        color?: THREE.Color;
        opacity?: number;
    }): SplatGenerator;
}
declare module "generators/snow" {
    import * as THREE from "three";
    import { SplatGenerator } from "SplatGenerator";
    export const DEFAULT_SNOW: {
        box: THREE.Box3;
        density: number;
        fallDirection: THREE.Vector3;
        fallVelocity: number;
        wanderScale: number;
        wanderVariance: number;
        color1: THREE.Color;
        color2: THREE.Color;
        minScale: number;
        maxScale: number;
        anisoScale: THREE.Vector3;
    };
    export const DEFAULT_RAIN: {
        box: THREE.Box3;
        density: number;
        fallDirection: THREE.Vector3;
        fallVelocity: number;
        wanderScale: number;
        wanderVariance: number;
        color1: THREE.Color;
        color2: THREE.Color;
        minScale: number;
        maxScale: number;
        anisoScale: THREE.Vector3;
    };
    export function snowBox({ box, minY, numSplats, density, anisoScale, minScale, maxScale, fallDirection, fallVelocity, wanderScale, wanderVariance, color1, color2, opacity, onFrame, }: {
        box?: THREE.Box3;
        minY?: number;
        numSplats?: number;
        density?: number;
        anisoScale?: THREE.Vector3;
        minScale?: number;
        maxScale?: number;
        fallDirection?: THREE.Vector3;
        fallVelocity?: number;
        wanderScale?: number;
        wanderVariance?: number;
        color1?: THREE.Color;
        color2?: THREE.Color;
        opacity?: number;
        onFrame?: ({ object, time, deltaTime, }: {
            object: SplatGenerator;
            time: number;
            deltaTime: number;
        }) => void;
    }): {
        snow: SplatGenerator;
        min: import("dyno").DynoVec3<THREE.Vector3, string>;
        max: import("dyno").DynoVec3<THREE.Vector3, string>;
        minY: import("dyno").DynoFloat<string>;
        color1: import("dyno").DynoVec3<THREE.Color, string>;
        color2: import("dyno").DynoVec3<THREE.Color, string>;
        opacity: import("dyno").DynoFloat<string>;
        fallVelocity: import("dyno").DynoFloat<string>;
        wanderVariance: import("dyno").DynoFloat<string>;
        wanderScale: import("dyno").DynoFloat<string>;
        fallDirection: import("dyno").DynoVec3<THREE.Vector3, string>;
        minScale: import("dyno").DynoFloat<string>;
        maxScale: import("dyno").DynoFloat<string>;
        anisoScale: import("dyno").DynoVec3<THREE.Vector3, string>;
    };
    export type SNOW_RESULT_TYPE = ReturnType<typeof snowBox>;
}
declare module "generators" {
    export * from "generators/static";
    export * from "generators/snow";
}
declare module "hands" {
    import { type Object3D, Quaternion, Vector3, type WebXRManager } from "three";
    import { SplatMesh } from "SplatMesh";
    export enum JointEnum {
        w = "wrist",
        t0 = "thumb-metacarpal",
        t1 = "thumb-phalanx-proximal",
        t2 = "thumb-phalanx-distal",
        t3 = "thumb-tip",
        i0 = "index-finger-metacarpal",
        i1 = "index-finger-phalanx-proximal",
        i2 = "index-finger-phalanx-intermediate",
        i3 = "index-finger-phalanx-distal",
        i4 = "index-finger-tip",
        m0 = "middle-finger-metacarpal",
        m1 = "middle-finger-phalanx-proximal",
        m2 = "middle-finger-phalanx-intermediate",
        m3 = "middle-finger-phalanx-distal",
        m4 = "middle-finger-tip",
        r0 = "ring-finger-metacarpal",
        r1 = "ring-finger-phalanx-proximal",
        r2 = "ring-finger-phalanx-intermediate",
        r3 = "ring-finger-phalanx-distal",
        r4 = "ring-finger-tip",
        p0 = "pinky-finger-metacarpal",
        p1 = "pinky-finger-phalanx-proximal",
        p2 = "pinky-finger-phalanx-intermediate",
        p3 = "pinky-finger-phalanx-distal",
        p4 = "pinky-finger-tip"
    }
    export type JointId = keyof typeof JointEnum;
    export const JOINT_IDS: JointId[];
    export const NUM_JOINTS: number;
    export const JOINT_INDEX: {
        [key in JointId]: number;
    };
    export const JOINT_RADIUS: {
        [key in JointId]: number;
    };
    export const JOINT_SEGMENTS: JointId[][];
    export const JOINT_SEGMENT_STEPS: number[][];
    export const JOINT_TIPS: JointId[];
    export const FINGER_TIPS: JointId[];
    export enum Hand {
        left = "left",
        right = "right"
    }
    export const HANDS: Hand[];
    export type Joint = {
        position: Vector3;
        quaternion: Quaternion;
        radius: number;
    };
    export type HandJoints = {
        [key in JointId]?: Joint;
    };
    export type HandsJoints = {
        [key in Hand]?: HandJoints;
    };
    export class XrHands {
        hands: HandsJoints;
        last: HandsJoints;
        values: Record<string, number>;
        tests: Record<string, boolean>;
        lastTests: Record<string, boolean>;
        updated: boolean;
        update({ xr, xrFrame }: {
            xr: WebXRManager;
            xrFrame: XRFrame;
        }): void;
        makeGhostMesh(): SplatMesh;
        distance(handA: Hand, jointA: JointId, handB: Hand, jointB: JointId, last?: boolean): number;
        separation(handA: Hand, jointA: JointId, handB: Hand, jointB: JointId, last?: boolean): number;
        touching(handA: Hand, jointA: JointId, handB: Hand, jointB: JointId, last?: boolean): number;
        allTipsTouching(hand: Hand, last?: boolean): number;
        triTipsTouching(hand: Hand, last?: boolean): number;
    }
    export class HandMovement {
        xrHands: XrHands;
        control: Object3D;
        moveInertia: number;
        rotateInertia: number;
        lastGrip: {
            [key in Hand]?: Vector3;
        };
        lastPivot: Vector3;
        rotateVelocity: number;
        velocity: Vector3;
        constructor({ xrHands, control, moveInertia, rotateInertia, }: {
            xrHands: XrHands;
            control: Object3D;
            moveInertia?: number;
            rotateInertia?: number;
        });
        update(deltaTime: number): void;
    }
}
declare module "spz" {
    import { GunzipReader } from "utils";
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
        constructor({ fileBytes }: {
            fileBytes: Uint8Array | ArrayBuffer;
        });
        parseSplats(centerCallback: (index: number, x: number, y: number, z: number) => void, alphaCallback: (index: number, alpha: number) => void, rgbCallback: (index: number, r: number, g: number, b: number) => void, scalesCallback: (index: number, scaleX: number, scaleY: number, scaleZ: number) => void, quatCallback: (index: number, quatX: number, quatY: number, quatZ: number, quatW: number) => void, shCallback?: (index: number, sh1: Float32Array, sh2?: Float32Array, sh3?: Float32Array) => void): void;
    }
}
declare module "splatConstructors" {
    import * as THREE from "three";
    import { PackedSplats } from "PackedSplats";
    import { SplatMesh } from "SplatMesh";
    export function constructGrid({ splats, extents, stepSize, pointRadius, pointShadowScale, opacity, color, }: {
        splats: PackedSplats;
        extents: THREE.Box3;
        stepSize?: number;
        pointRadius?: number;
        pointShadowScale?: number;
        opacity?: number;
        color?: THREE.Color | ((color: THREE.Color, point: THREE.Vector3) => void);
    }): void;
    export function constructAxes({ splats, scale, axisRadius, axisShadowScale, origins, }: {
        splats: PackedSplats;
        scale?: number;
        axisRadius?: number;
        axisShadowScale?: number;
        origins?: THREE.Vector3[];
    }): void;
    export function constructSpherePoints({ splats, origin, radius, maxDepth, filter, pointRadius, pointThickness, color, }: {
        splats: PackedSplats;
        origin?: THREE.Vector3;
        radius?: number;
        maxDepth?: number;
        filter?: ((point: THREE.Vector3) => boolean) | null;
        pointRadius?: number;
        pointThickness?: number;
        color?: THREE.Color | ((color: THREE.Color, point: THREE.Vector3) => void);
    }): void;
    export function textSplats({ text, font, fontSize, color, rgb, dotRadius, textAlign, lineHeight, }: {
        text: string;
        font?: string;
        fontSize?: number;
        color?: THREE.Color;
        rgb?: THREE.Color;
        dotRadius?: number;
        textAlign?: "left" | "center" | "right" | "start" | "end";
        lineHeight?: number;
    }): SplatMesh;
    export function imageSplats({ url, dotRadius, subXY, forEachSplat, }: {
        url: string;
        dotRadius?: number;
        subXY?: number;
        forEachSplat?: (width: number, height: number, index: number, center: THREE.Vector3, scales: THREE.Vector3, quaternion: THREE.Quaternion, opacity: number, color: THREE.Color) => number | null;
    }): SplatMesh;
}
declare module "vrButton" {
    import type * as THREE from "three";
    export class VRButton {
        static createButton(renderer: THREE.WebGLRenderer, sessionInit?: XRSessionInit): HTMLElement | null;
        static registerSessionGrantedListener(): null | undefined;
        static xrSessionIsGranted: boolean;
    }
}
declare module "index" {
    export { ForgeRenderer, type ForgeRendererOptions } from "ForgeRenderer";
    export { ForgeViewpoint, type ForgeViewpointOptions } from "ForgeViewpoint";
    export * as dyno from "dyno";
    export { SplatLoader, unpackSplats, SplatFileType, getSplatFileType, } from "SplatLoader";
    export { PlyReader } from "ply";
    export { SpzReader } from "spz";
    export { PackedSplats, type PackedSplatsOptions } from "PackedSplats";
    export { SplatGenerator, type GsplatGenerator, SplatModifier, type GsplatModifier, SplatTransformer, } from "SplatGenerator";
    export { SplatAccumulator, type GeneratorMapping } from "SplatAccumulator";
    export { Readback, type Rgba8Readback, type ReadbackBuffer } from "Readback";
    export { SplatMesh, type SplatMeshOptions, type SplatMeshContext, } from "SplatMesh";
    export { SplatSkinning, type SplatSkinningOptions } from "SplatSkinning";
    export { SplatEdit, type SplatEditOptions, SplatEditSdf, type SplatEditSdfOptions, SplatEditSdfType, SplatEditRgbaBlendMode, SplatEdits, } from "SplatEdit";
    export { constructGrid, constructAxes, constructSpherePoints, imageSplats, textSplats, } from "splatConstructors";
    export * as generators from "generators";
    export { VRButton } from "vrButton";
    export { type JointId, JointEnum, JOINT_IDS, NUM_JOINTS, JOINT_INDEX, JOINT_RADIUS, JOINT_SEGMENTS, JOINT_SEGMENT_STEPS, JOINT_TIPS, FINGER_TIPS, Hand, HANDS, type Joint, type HandJoints, type HandsJoints, XrHands, HandMovement, } from "hands";
    export { ForgeControls, FpsMovement, PointerControls } from "controls";
    export { isMobile, isAndroid, isOculus, flipPixels, pixelsToPngUrl, toHalf, fromHalf, floatToUint8, floatToSint8, Uint8ToFloat, Sint8ToFloat, setPackedSplat, unpackSplat, } from "utils";
    export * as utils from "utils";
}
declare module "worker" { }
