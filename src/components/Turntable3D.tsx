import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

function disposeTree(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    const list = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of list) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) textures.add(value);
      }
    }
  });

  textures.forEach((texture) => texture.dispose());
  materials.forEach((material) => material.dispose());
  geometries.forEach((geometry) => geometry.dispose());
}

export default function Turntable3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let modelRoot: THREE.Group | null = null;
    let modelSphere: THREE.Sphere | null = null;
    let environmentTexture: THREE.Texture | null = null;
    let ground: THREE.Mesh | null = null;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      mount.dataset.webglUnavailable = "true";
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    const hemisphere = new THREE.HemisphereLight(0xffefd8, 0x352419, 1.65);
    scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(0xffe2bd, 4.8);
    keyLight.position.set(-4.5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -7;
    keyLight.shadow.camera.right = 7;
    keyLight.shadow.camera.top = 7;
    keyLight.shadow.camera.bottom = -7;
    keyLight.shadow.bias = -0.00015;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfff3e3, 2.25);
    fillLight.position.set(5, 4, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffc16f, 3.2);
    rimLight.position.set(1.5, 6, -5);
    scene.add(rimLight);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    environmentTexture = pmrem.fromScene(roomEnvironment).texture;
    scene.environment = environmentTexture;
    scene.environmentIntensity = 1.2;
    disposeTree(roomEnvironment);
    pmrem.dispose();

    const fitCamera = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      renderer.setSize(width, height, false);

      if (modelSphere) {
        const verticalFov = THREE.MathUtils.degToRad(camera.fov);
        const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
        const limitingFov = Math.min(verticalFov, horizontalFov);
        const distance = (modelSphere.radius / Math.sin(limitingFov / 2)) * 0.94;
        const viewDirection = new THREE.Vector3(0.48, 0.38, 0.79).normalize();
        camera.position.copy(viewDirection.multiplyScalar(distance));
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    const observer = new ResizeObserver(fitCamera);
    observer.observe(mount);

    const loader = new GLTFLoader();
    loader.load(
      "/models/vintage-gramophone.glb",
      (gltf) => {
        if (disposed) {
          disposeTree(gltf.scene);
          return;
        }

        const sourceBox = new THREE.Box3().setFromObject(gltf.scene);
        const sourceSize = sourceBox.getSize(new THREE.Vector3());
        const sourceCenter = sourceBox.getCenter(new THREE.Vector3());
        const largestDimension = Math.max(sourceSize.x, sourceSize.y, sourceSize.z) || 1;

        modelRoot = new THREE.Group();
        gltf.scene.position.sub(sourceCenter);
        gltf.scene.scale.setScalar(4.8 / largestDimension);
        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        modelRoot.add(gltf.scene);
        scene.add(modelRoot);

        const normalizedBounds = new THREE.Box3().setFromObject(modelRoot);
        const normalizedSize = normalizedBounds.getSize(new THREE.Vector3());
        modelSphere = normalizedBounds.getBoundingSphere(new THREE.Sphere());

        ground = new THREE.Mesh(
          new THREE.PlaneGeometry(24, 24),
          new THREE.ShadowMaterial({ opacity: 0.22 }),
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = normalizedBounds.min.y - 0.025;
        ground.receiveShadow = true;
        scene.add(ground);

        // Center the product with a small amount of breathing room around the full horn and cabinet.
        modelSphere.radius = Math.max(modelSphere.radius, normalizedSize.y * 0.5);
        mount.dataset.modelLoaded = "true";
        fitCamera();
      },
      undefined,
      () => {
        if (!disposed) mount.dataset.modelUnavailable = "true";
      },
    );

    return () => {
      disposed = true;
      observer.disconnect();
      if (modelRoot) disposeTree(modelRoot);
      if (ground) disposeTree(ground);
      if (environmentTexture) environmentTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      modelRoot = null;
      ground = null;
      modelSphere = null;
    };
  }, []);

  return (
    <div
      className="mom-turntable-stage"
      ref={mountRef}
      role="img"
      aria-label="Gramofon vintage 3D dengan corong kuningan, kabinet kayu, piringan hitam, dan tonearm"
    />
  );
}
