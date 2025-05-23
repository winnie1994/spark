# Gsplat Editing

Forge provides the ability to apply "edits" to Gsplats as part of the standard `SplatMesh` pipeline. These edits take the form of a sequence of operations, applied one at a time to the set of Gsplats in its `packedSplats`. Each operation evaluates a 7-dimensional field (RGBA and XYZ displacement) at each point in space that derives from N=1 or more Signed Distance Field shapes (such as spheres, boxes, planes, etc.), blended together and across inside-outisde boundaries.

The result is a an RGBA,XYZ value for each point in space, which combined with SplatEditRgbaBlendMode.MULTIPLY/SET_RGB/ADD_RGBA can be used to create special effects, for example simulating simple lighting or applying deformations in space, whose parameters can be updated each frame to create animated effects.

## RGBA blend modes

When creating a `SplatEdit` you can specify a `rgbaBlendMode?: SplatEditRgbaBlendMode` value from the enum to choose between 3 blend modes:

| Blend Mode                                | Description                                                                                                          |
|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| `SplatEditRgbaBlendMode.MULTIPLY`        | The RGBA of the splat is multiplied component-wise by the SDF’s RGBA value at that point in space.                   |
| `SplatEditRgbaBlendMode.SET_RGB`         | Ignore the Alpha value in the SDF, but set the splat’s RGB to equal the SDF’s RGB value at that point.               |
| `SplatEditRgbaBlendMode.ADD_RGBA`        | Add the SDF’s RGBA value at that point to the RGBA value of the Gsplat. This can produce hyper-saturated results, but is useful to easily “light up” areas. |

## SDF Shapes

The following SDF shapes are available in the `SplatEditSdfType` enum:

| SDF Type | Description | Parameters |
|----------|-------------|------------|
| `ALL`       | Affects all points in space                                | None |
| `PLANE`     | Infinite plane                                            | position, rotation |
| `SPHERE`    | Sphere                                                    | position, radius |
| `BOX`       | Box (with optional corner rounding)                       | position, rotation, sizes, radius |
| `ELLIPSOID` | Ellipsoid                                                 | position, rotation, sizes |
| `CYLINDER`  | Cylinder                                                  | position, rotation, size_y |
| `CAPSULE`   | Capsule                                                   | position, rotation, size_y |
| `INFINITE_CONE` | Infinite cone | position, rotation, radius=angle |

## Creating a Gsplat edit operation

A `SplatEdit` operation can be assigned to a particular `SplatMesh` through its `.edits[]` property or by adding the `SplatEdit` as a child of the `SplatMesh` in the scene hierarchy. If the `SplatEdit` has no `SplatMesh` ancestor, its edits will apply globally to all `SplatMesh`es whose `editable` property is set to default true.

```typescript
const edit = new SplatEdit({
  name?: string;
  rgbaBlendMode?: SplatEditRgbaBlendMode;
  sdfSmooth?: number;
  softEdge?: number;
  invert?: boolean;
  sdfs?: SplatEditSdf[];
});
scene.add(edit);
```

### Optional parameters

| Parameter       | Default                                  | Description                                                                                                  |
|-----------------|------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| `name`          | `undefined` (auto‐generated to `Edit <n>`) | Name of this edit operation. If you omit it, a default `"Edit 1"`, `"Edit 2"`, … is assigned.              |
| `rgbaBlendMode` | `SplatEditRgbaBlendMode.MULTIPLY`        | How the SDF’s RGBA modifies each splat’s RGBA: multiply, overwrite RGB, or add RGBA.                         |
| `sdfSmooth`     | `0.0`                                    | Smoothing (in world‐space units) for blending between multiple SDF shapes at their boundaries.              |
| `softEdge`      | `0.0`                                    | Soft‐edge falloff radius (in world‐space units) around each SDF shape’s surface.                             |
| `invert`        | `false`                                  | Invert the SDF evaluation (inside/outside swap).                                                             |
| `sdfs`          | `null`                                   | Explicit array of `SplatEditSdf` objects to include. If `null`, any child `SplatEditSdf` instances are used. |

## Adding an SDF RGBA-XYZ shape to the edit operation

```typescript
const shape1 = new SplatEditSdf({
  type?: SplatEditSdfType;
  invert?: boolean;
  opacity?: number;
  color?: THREE.Color;
  displace?: THREE.Vector3;
  radius?: number;
});
edit.add(shape1);
```

### Optional parameters

| Parameter   | Default                            | Description                                                                                                                        |
|-------------|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| `type`      | `SplatEditSdfType.SPHERE`          | The SDF shape type: `ALL`, `PLANE`, `SPHERE`, `BOX`, `ELLIPSOID`, `CYLINDER`, `CAPSULE`, or `INFINITE_CONE`.                        |
| `invert`    | `false`                            | Invert the SDF evaluation, swapping inside and outside regions.                                                                    |
| `opacity`   | `1.0`                              | Opacity / "alpha" value used differently by blending modes |
| `color`     | `new THREE.Color(1.0, 1.0, 1.0)`   | RGB color applied within the shape.                                                                                                |
| `displace`  | `new THREE.Vector3(0.0, 0.0, 0.0)` | XYZ displacement applied to splat positions inside the shape.                                                                      |
| `radius`    | `0.0`                              | Shape-specific size parameter: sphere radius, box corner rounding, cylinder/capsule radius, or for the infinite cone the angle factor (opening half-angle = π/4 × `radius`). |

## Adding multiple SDF RGBA-XYZ shapes to the edit operation

RGBA-XYZ values are computed by blending together values from all SDF shapes using the exponential "softmax" function, which is commutative (so blending order within a `SplatEdit` operation doesn't matter). The parameter `SplatEdit.sdfSmooth` controls the blending scale *between* SDF shapes, while `SplatEdit.softEdge` controls the scale of soft inside-outside shape edit blending. Their default values start at `0.0` and should be increased to soften the effect.

Note that XYZ displacement values are blended in the same way as RGBA, with a resulting displacement field that can be quite complex but "softly" blending between shapes. These RGBA-XYZ edits, along with time-based and overlapping fields can create many interesting animations and special effects, such as rippling leaves in the wind, an angry fire, or a looping water effects. Simply update the `SplatEdit` and `SplatEditSdf` objects and the operations will be applied immediately to the Gsplats in the scene.
