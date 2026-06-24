# Three.js — Interview Questions & Answers

---

## Core Concepts

### 1. What is Three.js?

**Answer:** Three.js is an open-source **JavaScript 3D library** that makes WebGL easier to use. It lets developers create and display animated 3D graphics in web browsers without writing low-level WebGL code.

Used for:
- 3D product configurators
- Games and interactive experiences
- Data visualizations
- Architectural visualizations
- VR/AR (WebXR)

```js
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

---

### 2. What are the main features of Three.js?

**Answer:**
- Create and render **geometry** (shapes)
- Apply **materials** (colors, textures, shaders)
- **Lighting** and shadows
- **Cameras** (perspective, orthographic)
- **Animation** loop
- **Loaders** for 3D models (glTF, OBJ, FBX)
- **Raycasting** for mouse interaction
- **Post-processing** effects
- Large **examples** and community ecosystem

---

### 3. How does Three.js work with WebGL?

**Answer:** WebGL is a low-level JavaScript API for rendering 2D/3D graphics using the GPU. Three.js **abstracts WebGL** — you work with high-level objects (Scene, Mesh, Camera) instead of writing shaders and buffer code manually.

```
Three.js (Scene, Mesh, Light, Camera)
        ↓
WebGLRenderer
        ↓
WebGL API
        ↓
GPU → Canvas (2D image on screen)
```

Three.js handles: matrix math, buffer management, shader compilation, render pipeline.

---

### 4. What is a scene graph?

**Answer:** A **scene graph** is a hierarchical tree structure that organizes all objects in a 3D scene. The `Scene` is the root; meshes, lights, and groups are child nodes.

```
Scene (root)
├── Mesh (cube)
├── Mesh (sphere)
├── Group
│   ├── Mesh (chair)
│   └── Mesh (table)
├── DirectionalLight
└── Camera (not in scene, passed to renderer)
```

Benefits:
- Parent transforms affect children (move group → all children move)
- Organize complex scenes
- Control render order

```js
const group = new THREE.Group();
group.add(cube);
group.add(sphere);
scene.add(group);
group.rotation.y += 0.01; // rotates both children
```

---

### 5. Explain Scene, Camera, and Renderer.

**Answer:** These are the **three essentials** of every Three.js app.

| Object | Role |
| --- | --- |
| **Scene** | Container for all 3D objects, lights |
| **Camera** | Viewpoint — defines what is visible (frustum) |
| **Renderer** | Draws the scene through the camera onto a 2D canvas |

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

**Flow:** Renderer takes Scene + Camera → draws visible portion to canvas.

---

### 6. What is the difference between PerspectiveCamera and OrthographicCamera?

**Answer:**

| | PerspectiveCamera | OrthographicCamera |
| --- | --- | --- |
| View | Realistic — objects farther appear smaller | No depth distortion — parallel lines stay parallel |
| Use case | Games, 3D products, realism | CAD, isometric games, UI overlays |
| Params | fov, aspect, near, far | left, right, top, bottom, near, far |

```js
// Perspective — simulates human eye
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Orthographic — no perspective distortion
const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
```

---

## Geometry & Materials

### 7. What is the difference between a Mesh, Geometry, and Material?

**Answer:**

| | Geometry | Material | Mesh |
| --- | --- | --- | --- |
| Defines | **Shape** (vertices, faces) | **Appearance** (color, texture, shading) | Geometry + Material combined |
| Example | BoxGeometry, SphereGeometry | MeshBasicMaterial, MeshStandardMaterial | Visible 3D object |

```js
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

**Mesh** = Geometry (what it looks like in shape) + Material (how surface looks).

---

### 8. What is the difference between Geometry and BufferGeometry?

**Answer:**

| | Geometry (legacy) | BufferGeometry (modern) |
| --- | --- | --- |
| Storage | JavaScript objects per vertex | Typed arrays (Float32Array) |
| Performance | Slower — more memory | Faster — GPU-friendly |
| Updates | Small static objects | Large/dynamic objects |
| Status | Deprecated — use BufferGeometry | **Standard** |

```js
// Modern — all built-in geometries use BufferGeometry internally
const geometry = new THREE.BoxGeometry(1, 1, 1);
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
```

**Rule:** Always use **BufferGeometry**. Legacy `Geometry` class is removed in recent Three.js versions.

---

### 9. What are the different types of materials in Three.js?

**Answer:**

| Material | Lighting | Use case |
| --- | --- | --- |
| `MeshBasicMaterial` | None — flat color | Wireframes, unlit objects |
| `MeshLambertMaterial` | Diffuse only | Matte surfaces |
| `MeshPhongMaterial` | Diffuse + specular | Shiny plastic look |
| `MeshStandardMaterial` | PBR — physically based | **Most realistic** — default choice |
| `MeshPhysicalMaterial` | PBR + clearcoat, transmission | Glass, car paint |
| `ShaderMaterial` | Custom GLSL shaders | Full control |

```js
// PBR — reacts realistically to light
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  metalness: 0.5,
  roughness: 0.2,
});
```

---

### 10. How do you change colors on objects?

**Answer:**

```js
// At creation
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

// Change after creation
mesh.material.color.set(0x00ff00);
mesh.material.color.setRGB(0, 1, 0);
mesh.material.color.setHSL(0.33, 1, 0.5);
mesh.material.needsUpdate = true; // if changing material properties
```

Use `THREE.Color` class for all color operations.

---

## Lighting

### 11. What is the significance of lights in Three.js?

**Answer:** Lights create **depth and realism**. Without lights, most materials (except MeshBasicMaterial) appear black or flat.

| Light | Behavior | Use case |
| --- | --- | --- |
| `AmbientLight` | Uniform everywhere — no shadows | Base illumination |
| `DirectionalLight` | Parallel rays — like sun | Outdoor scenes |
| `PointLight` | Radiates in all directions — like bulb | Indoor lamps |
| `SpotLight` | Cone of light — like flashlight | Stage lighting |
| `HemisphereLight` | Sky + ground colors | Outdoor ambient |

```js
const ambient = new THREE.AmbientLight(0x404040, 0.5);
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(5, 10, 5);
directional.castShadow = true;
scene.add(ambient, directional);
```

---

### 12. How do shadows work in Three.js?

**Answer:**

```js
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

light.castShadow = true;
mesh.castShadow = true;    // object casts shadow
mesh.receiveShadow = true; // object receives shadow
```

Shadows are expensive — use sparingly on mobile.

---

## Textures & Models

### 13. What are textures and UV mapping?

**Answer:** A **texture** is a 2D image applied to a 3D surface. **UV mapping** defines how the 2D image wraps onto the 3D geometry.

```js
const loader = new THREE.TextureLoader();
const texture = loader.load("/textures/wood.jpg");

const material = new THREE.MeshStandardMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
```

Common maps:
| Map | Purpose |
| --- | --- |
| `map` | Base color (diffuse) |
| `normalMap` | Surface detail without extra geometry |
| `roughnessMap` | Surface roughness variation |
| `metalnessMap` | Metallic variation |
| `envMap` | Reflections |

---

### 14. What is an object loader? Which formats are commonly used?

**Answer:** Loaders import 3D models from external files into Three.js.

| Loader | Format | Notes |
| --- | --- | --- |
| `GLTFLoader` | glTF / GLB | **Recommended** — web standard, compact |
| `OBJLoader` | OBJ | Simple, no animations |
| `FBXLoader` | FBX | Common in game pipelines |
| `DRACOLoader` | Draco compression | Use with GLTF for smaller files |

```js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
loader.load("/models/car.glb", (gltf) => {
  scene.add(gltf.scene);
});
```

**glTF/GLB** is the preferred format for web — supported by Blender, Maya, and most 3D tools.

---

## Animation & Interaction

### 15. How do you create animations in Three.js?

**Answer:**

```js
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.position.y = Math.sin(Date.now() * 0.001) * 2;

  renderer.render(scene, camera);
}
animate();
```

**Advanced animation:**
- `THREE.Clock` — delta time for frame-rate independent movement
- `THREE.AnimationMixer` — keyframe animations from glTF models
- Tween libraries (GSAP, Tween.js) — smooth property transitions

```js
const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  mixer.update(delta); // keyframe animation
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

---

### 16. What is raycasting? How is it used for interaction?

**Answer:** Raycasting shoots an invisible ray from the camera through the mouse position to detect which 3D objects are hit.

```js
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(scene.children);

  if (hits.length > 0) {
    console.log("Clicked:", hits[0].object);
    hits[0].object.material.color.set(0xff0000);
  }
});
```

Used for: object picking, hover effects, drag-and-drop in 3D, tooltips.

---

### 17. What is OrbitControls?

**Answer:** OrbitControls is an addon that adds **mouse/touch camera controls** — rotate, zoom, and pan around a target point.

```js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // smooth inertia
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);

function animate() {
  controls.update(); // required when damping enabled
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

Essential for inspecting 3D scenes during development and product viewers.

---

## Shaders & Advanced

### 18. What shader language does Three.js support?

**Answer:** Three.js uses **GLSL** (OpenGL Shading Language) for custom shaders.

```js
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0xff0000) },
  },
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    void main() {
      gl_FragColor = vec4(color, 1.0);
    }
  `,
});
```

Use `ShaderMaterial` or `RawShaderMaterial` for custom visual effects. Three.js handles standard rendering internally with built-in shaders.

---

### 19. What is post-processing?

**Answer:** Post-processing applies visual effects **after** the scene is rendered — bloom, depth of field, film grain, SSAO.

```js
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85));

function animate() {
  composer.render(); // instead of renderer.render()
  requestAnimationFrame(animate);
}
```

---

## Performance

### 20. How do you optimize Three.js performance?

**Answer:**

| Technique | What it does |
| --- | --- |
| **BufferGeometry** | GPU-efficient geometry |
| **InstancedMesh** | Render many copies in one draw call |
| **LOD (Level of Detail)** | Lower poly models at distance |
| **Frustum culling** | Skip objects outside camera view (automatic) |
| **Texture compression** | KTX2, Basis — smaller GPU memory |
| **Draco compression** | Smaller model files |
| **Merge geometries** | Reduce draw calls |
| **Limit lights/shadows** | Shadows are expensive |
| **Pixel ratio cap** | `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` |
| **Dispose resources** | `geometry.dispose()`, `material.dispose()`, `texture.dispose()` |

```js
// Cleanup when removing objects
mesh.geometry.dispose();
mesh.material.dispose();
scene.remove(mesh);
```

---

### 21. What are the limitations of Three.js for web games?

**Answer:**
- **Performance ceiling** — not as optimized as Unity/Unreal for complex games
- **No built-in physics** — need Cannon.js, Rapier, or Ammo.js separately
- **No asset pipeline** — manual model loading and management
- **Single-threaded** — heavy CPU work blocks rendering
- **Mobile GPU limits** — complex scenes struggle on low-end devices
- **Not game-engine complete** — no built-in AI, networking, audio management

Best for: web 3D viewers, visualizations, lightweight interactive experiences — not AAA games.

---

## React Three Fiber

### 22. What is React Three Fiber (R3F)?

**Answer:** React Three Fiber is a **React renderer for Three.js** — build 3D scenes using declarative JSX components instead of imperative Three.js code.

```jsx
import { Canvas } from "@react-three/fiber";

function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box />
    </Canvas>
  );
}
```

---

### 23. Why use React Three Fiber over pure Three.js?

**Answer:**

| Pure Three.js | React Three Fiber |
| --- | --- |
| Imperative — manual add/remove/update | Declarative — JSX describes scene |
| Manual state management for 3D objects | React state/hooks manage objects |
| Manual cleanup (dispose) | Automatic cleanup on unmount |
| Hard to scale complex scenes | Component composition scales well |

**R3F hooks:**
- `useFrame` — run code every animation frame
- `useLoader` — load textures/models
- `useThree` — access renderer, camera, scene

**Drei** — helper library (`@react-three/drei`) with OrbitControls, Text, Environment, etc.

---

## Real-World & Ecosystem

### 24. What are real-world applications built with Three.js?

**Answer:**
- **Google Maps 3D** — building visualization
- **Sketchfab** — 3D model viewer
- **Apple product pages** — 3D product viewers
- **Bruno Simon portfolio** — interactive 3D website
- **Medical visualizations** — anatomy, surgery planning
- **Architecture** — building walkthroughs
- **Data visualization** — 3D charts and globes
- **NFT/Metaverse** platforms

---

### 25. What is WebXR and how does Three.js support VR/AR?

**Answer:** WebXR is a browser API for Virtual Reality (VR) and Augmented Reality (AR) experiences.

```js
import { VRButton } from "three/addons/webxr/VRButton.js";

renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

renderer.setAnimationLoop(function () {
  renderer.render(scene, camera);
});
```

Three.js handles stereo rendering, controllers, and headset tracking through WebXRManager.

---

### 26. How do you handle responsive Three.js apps?

**Answer:**

```js
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

- Cap pixel ratio on mobile: `Math.min(window.devicePixelRatio, 2)`
- Use `ResizeObserver` for container-based sizing (not full window)
- Reduce geometry complexity on smaller screens
- Test on actual mobile devices — desktop performance ≠ mobile

---

### 27. What is the render loop and why is requestAnimationFrame used?

**Answer:** The render loop continuously updates and draws the scene. `requestAnimationFrame` syncs with the browser's refresh rate (~60fps) and pauses when tab is hidden.

```js
function animate() {
  requestAnimationFrame(animate);
  // update objects
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

**Never use `setInterval` for animation** — it doesn't sync with display refresh and runs when tab is hidden.

---

### 28. What are common Three.js debugging issues?

**Answer:**

| Problem | Cause | Fix |
| --- | --- | --- |
| Black screen | No lights with standard material | Add AmbientLight + DirectionalLight |
| Object not visible | Outside camera frustum | Check camera position and `near`/`far` |
| Upside down texture | UV flip | `texture.flipY = false` |
| Memory leak | Not disposing resources | `geometry.dispose()`, `material.dispose()` |
| Z-fighting | Objects at same depth | Adjust `polygonOffset` or separate objects |
| Pixelated canvas | Low pixel ratio | `renderer.setPixelRatio(devicePixelRatio)` |

Use **Three.js Inspector** browser extension and `scene.add(new THREE.AxesHelper(5))` for debugging.

---

## Quick Revision

```
Three.js     = JS 3D library wrapping WebGL
Scene        = container for all 3D objects
Camera       = viewpoint (Perspective / Orthographic)
Renderer     = draws scene to canvas (WebGLRenderer)
Mesh         = Geometry + Material
BufferGeometry = modern GPU-friendly geometry
Material     = MeshStandardMaterial for PBR realism
Light        = Ambient + Directional minimum
Texture      = 2D image on 3D surface via UV mapping
GLTF/GLB     = preferred 3D model format for web
Raycaster    = mouse → 3D object picking
OrbitControls = rotate/zoom/pan camera
requestAnimationFrame = animation loop
R3F          = React declarative wrapper for Three.js
dispose()    = free GPU memory when removing objects
```
