# ForgeRenderer

## Adding to your `THREE.Scene`

Using Forge begins with creating a `ForgeRenderer` object and adding it to your `THREE.Scene`. You can add it anywhere in the scene, for example at the root:
```typescript
const forge = new ForgeRenderer({
  renderer: myThreeWebGlRenderer,
});
const scene = new THREE.Scene();
scene.add(forge);
```

## Larger scenes

All scene Gsplats are accumulated by SplatAccumulator into a single global PackedSplats, whose coordinates are relative to the ForgeRenderer's origin. Gsplats that are far away from this origin may exhibit float16 quantization artifacts, so if you plan on moving the camera large distances you can instead add the renderer as a child of your `THREE.Camera`, ensuring that coordinates near the camera viewpoint have higher precision:
```javascript
const aspect = canvas.width / canvas.height;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
scene.add(camera);
// Add ForgeRenderer as a child of camera to follow it
camera.add(forge);
```

## Creating a `ForgeRenderer`

```typescript
const forge = new ForgeRenderer({
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
});
```
### Required parameters
| **Parameter** | Description |
| ------------- | ----------- |
| **renderer**  | Pass in your `THREE.WebGLRenderer` instance so Forge can perform work outside the usual render loop. Should be created with `antialias: false` (default setting) as WebGL anti-aliasing doesn't improve Gaussian Splatting rendering and significantly reduces performance.

### Optional parameters

| **Parameter**     | Description |
| ----------------- | ----------- |
| **clock**         | Pass in a `THREE.Clock` to synchronize time-based effects across different systems. Alternatively, you can set the `ForgeRenderer` properties `time` and `deltaTime` directly. (default: `new THREE.Clock`)
| **autoUpdate**    | Controls whether to check and automatically update Gsplat collection after each frame render. (default: `true`)
| **preUpdate**     | Controls whether to update the Gsplats before or after rendering. For WebXR this *must* be false in order to complete rendering as soon as possible. (default: `false`)
| **originDistance** | Distance threshold for ForgeRenderer movement triggering a Gsplat update at the new origin. (default: `1.0`)
| **maxStdDev**     | Maximum standard deviations from the center to render Gaussians. Values `Math.sqrt(5)`..`Math.sqrt(8)` produce good results and can be tweaked for performance. (default: `Math.sqrt(8)`)
| **enable2DGS**    | Enable 2D Gaussian splatting rendering ability. When this mode is enabled, any `scale` x/y/z component that is exactly `0` (minimum quantized value) results in the other two non-0 axis being interpreted as an oriented 2D Gaussian  Splat, rather instead of the usual projected 3DGS  Z-slice. When reading PLY files, scale values less than e^-20 will be interpreted as `0`. (default: `true`)
| **preBlurAmount** | Scalar value to add to 2D splat covariance diagonal, effectively blurring + enlarging splats. In scenes trained without the Gsplat anti-aliasing tweak this value was typically 0.3, but with anti-aliasing it is 0.0 (default: `0.0`)
| **blurAmount**    | Scalar value to add to 2D splat covarianve diagonal, with opacity adjustment to correctly account for "blurring" when anti-aliasing. Typically 0.3 (equivalent to approx 0.5 pixel radius) in scenes trained with anti-aliasing.
| **falloff**       | Modulate Gaussian kernel falloff. 0 means "no falloff, flat shading", while 1 is the normal Gaussian kernel. (default: `1.0`)
| **clipXY**        | X/Y clipping boundary factor for Gsplat centers against view frustum. 1.0 clips any centers that are exactly out of bounds, while 1.4 clips centers that are 40% beyond the bounds. (default: `1.4`)
| **view**          | Configures the `ForgeViewpointOptions` for the default `ForgeViewpoint` associated with this `ForgeRenderer`. Notable option: `sortRadial` (sort by radial distance or Z-depth)

## `newViewpoint(options: ForgeViewpointOptions)`

Create a new `ForgeViewpoint` for this `ForgeRenderer`. Note that every `ForgeRenderer` has an initial `forge.defaultView: ForgeViewpoint` created during construction, which is used for default canvas rendering. Calling this method allows you to create additional viewpoints, which can be updated automatically each frame (performing Gsplat sorting every time there is an update), or updated on-demand for controlled rendering for video frame rendering or similar applications.

## `update({ scene })`

If `forge.autoUpdate` is `false` then you must manually call `forge.update({ scene })` to have the scene Gsplats re-generated.

## `renderEnvMap({ renderer, scene, worldCenter, ... })`

Renders out the scene to an environment map that can be used for image-based lighting or similar applications. First updates Gsplats, sorts them with respect to the provided `worldCenter`, renders 6 cube faces, then pre-filters them using `THREE.PMREMGenerator` and returns a `THREE.Texture` that can assigned directly to a `THREE.MeshStandardMaterial.envMap` property.

## `recurseSetEnvMap(root, envMap)`

Utility function to recursively set the `envMap` property for any `THREE.MeshStandardMaterial` within the subtree of `root`.

## `getRgba({ generator, ... })`

Utility function that helps extract the Gsplat RGBA values from a `SplatGenerator`, including the result of any real-time RGBA SDF edits applied to a `SplatMesh`. This effectively "bakes" any computed RGBA values, which can now be used as a pipeline input via `SplatMesh.splatRgba` to inject these baked values into the Gsplat data.

## `readRgba({ generator, ...})`

Utility function that builds on `getRgba({ generator })` and additionally reads back the RGBA values to the CPU in a Uint8Array with packed RGBA in that byte order.
