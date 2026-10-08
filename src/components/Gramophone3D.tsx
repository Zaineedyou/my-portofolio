import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
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

function addBox(
  parent: THREE.Object3D,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
  radius = 0,
) {
  const geometry = radius > 0
    ? new RoundedBoxGeometry(...size, 4, radius)
    : new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addCylinder(
  parent: THREE.Object3D,
  radiusTop: number,
  radiusBottom: number,
  height: number,
  position: [number, number, number],
  material: THREE.Material,
  segments = 32,
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    material,
  );
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addRod(
  parent: THREE.Object3D,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
) {
  const direction = end.clone().sub(start);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), 20),
    material,
  );
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeGramophone() {
  const root = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x98582f, roughness: 0.44, metalness: 0.08 });
  const woodLight = new THREE.MeshStandardMaterial({ color: 0xb97343, roughness: 0.42, metalness: 0.06 });
  const woodDark = new THREE.MeshStandardMaterial({ color: 0x62371f, roughness: 0.5, metalness: 0.06 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xb58b4c, roughness: 0.27, metalness: 0.78 });
  const brassLight = new THREE.MeshStandardMaterial({ color: 0xd7b46d, roughness: 0.24, metalness: 0.76 });
  const brassShadow = new THREE.MeshStandardMaterial({ color: 0x79572e, roughness: 0.36, metalness: 0.68 });
  const recordMaterial = new THREE.MeshStandardMaterial({ color: 0x262320, roughness: 0.33, metalness: 0.3 });
  const labelMaterial = new THREE.MeshStandardMaterial({ color: 0xc08b55, roughness: 0.48, metalness: 0.12 });
  const blackMetal = new THREE.MeshStandardMaterial({ color: 0x292521, roughness: 0.35, metalness: 0.55 });

  // Walnut cabinet, stepped plinth, and narrow brass trim.
  addBox(root, [2.24, 0.13, 1.66], [0, 0.32, 0], woodDark, 0.06);
  addBox(root, [2.08, 0.78, 1.48], [0, 0.77, 0], wood, 0.055);
  addBox(root, [2.2, 0.09, 1.58], [0, 1.205, 0], woodLight, 0.035);
  addBox(root, [2.12, 0.035, 1.52], [0, 1.26, 0], brass, 0.018);
  addBox(root, [2.04, 0.025, 1.44], [0, 1.278, 0], woodDark, 0.012);

  // Four short feet and their collars keep the cabinet visibly raised from the ground.
  for (const x of [-0.78, 0.78]) {
    for (const z of [-0.52, 0.52]) {
      addCylinder(root, 0.09, 0.12, 0.28, [x, 0.14, z], blackMetal, 20);
      addCylinder(root, 0.105, 0.105, 0.045, [x, 0.27, z], brass, 24);
    }
  }

  // Front inset panel, framed in wood, with real small brass hardware.
  addBox(root, [1.3, 0.43, 0.045], [0, 0.73, 0.755], woodDark, 0.035);
  addBox(root, [1.19, 0.32, 0.03], [0, 0.73, 0.785], woodLight, 0.025);
  addBox(root, [0.56, 0.055, 0.035], [0, 0.73, 0.81], brass, 0.016);
  for (const x of [-0.88, 0.88]) {
    for (const y of [0.43, 1.08]) {
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), brassLight);
      rivet.position.set(x, y, 0.76);
      rivet.castShadow = true;
      root.add(rivet);
    }
  }

  // The platter and its shellac record turn together only during playback.
  const record = new THREE.Group();
  record.position.set(0.03, 1.34, -0.035);
  root.add(record);
  addCylinder(record, 0.65, 0.65, 0.075, [0, 0, 0], brassShadow, 64);
  addCylinder(record, 0.57, 0.57, 0.045, [0, 0.057, 0], recordMaterial, 64);
  const grooveMaterial = new THREE.MeshStandardMaterial({ color: 0x47413a, roughness: 0.42, metalness: 0.24 });
  for (const radius of [0.34, 0.39, 0.44, 0.49]) {
    const groove = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.004, 4, 72), grooveMaterial);
    groove.rotation.x = Math.PI / 2;
    groove.position.y = 0.081;
    record.add(groove);
  }
  addCylinder(record, 0.16, 0.16, 0.014, [0, 0.087, 0], labelMaterial, 48);
  addCylinder(record, 0.035, 0.035, 0.105, [0, 0.135, 0], brassLight, 24);
  // An off-center brass mark makes the record's rotation perceptible.
  const rotationCue = new THREE.Mesh(new THREE.SphereGeometry(0.028, 14, 10), brassLight);
  rotationCue.position.set(0.48, 0.09, 0);
  record.add(rotationCue);

  // The fixed pivot carries a separate arm so its stylus can lift and lower.
  addCylinder(root, 0.14, 0.16, 0.08, [0.79, 1.34, 0.46], brassShadow, 32);
  addCylinder(root, 0.085, 0.085, 0.16, [0.79, 1.45, 0.46], brass, 28);
  const tonearm = new THREE.Group();
  tonearm.position.set(0.79, 1.53, 0.46);
  tonearm.rotation.z = -0.45;
  root.add(tonearm);
  addRod(tonearm, new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.06, 0.13, -0.23), 0.035, brassLight);
  addRod(tonearm, new THREE.Vector3(-0.06, 0.13, -0.23), new THREE.Vector3(-0.31, 0.05, -0.64), 0.025, brassLight);
  addBox(tonearm, [0.18, 0.045, 0.09], [-0.32, 0.04, -0.65], blackMetal, 0.018);
  addRod(tonearm, new THREE.Vector3(-0.38, 0.03, -0.69), new THREE.Vector3(-0.38, -0.11, -0.69), 0.012, blackMetal);

  // Tall horn stand and a flared, hollow brass bell aimed up and toward the viewer.
  addCylinder(root, 0.17, 0.19, 0.09, [-0.72, 1.34, -0.42], brassShadow, 32);
  addCylinder(root, 0.105, 0.12, 0.12, [-0.72, 1.43, -0.42], brass, 32);
  addRod(root, new THREE.Vector3(-0.72, 1.48, -0.42), new THREE.Vector3(-0.72, 1.91, -0.42), 0.065, brassLight);
  const hornJoint = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 18), brass);
  hornJoint.position.set(-0.72, 1.9, -0.42);
  hornJoint.castShadow = true;
  root.add(hornJoint);

  const horn = new THREE.Group();
  horn.position.set(-0.72, 1.88, -0.42);
  horn.rotation.x = 0.34;
  horn.rotation.z = -0.12;
  root.add(horn);
  const profile = [
    new THREE.Vector2(0.095, 0.0),
    new THREE.Vector2(0.12, 0.12),
    new THREE.Vector2(0.19, 0.28),
    new THREE.Vector2(0.34, 0.48),
    new THREE.Vector2(0.57, 0.69),
    new THREE.Vector2(0.83, 0.91),
    new THREE.Vector2(0.9, 0.99),
    new THREE.Vector2(0.86, 1.02),
    new THREE.Vector2(0.77, 0.93),
    new THREE.Vector2(0.52, 0.73),
    new THREE.Vector2(0.3, 0.53),
    new THREE.Vector2(0.17, 0.34),
    new THREE.Vector2(0.09, 0.13),
  ];
  const bell = new THREE.Mesh(
    new THREE.LatheGeometry(profile, 64),
    new THREE.MeshStandardMaterial({ color: 0xc19b58, roughness: 0.26, metalness: 0.78, side: THREE.DoubleSide }),
  );
  bell.castShadow = true;
  bell.receiveShadow = true;
  horn.add(bell);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.055, 12, 64), brassLight);
  rim.position.y = 1;
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  horn.add(rim);
  const throat = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 8, 32), brassShadow);
  throat.position.y = 0.08;
  throat.rotation.x = Math.PI / 2;
  horn.add(throat);

  return { root, tonearm, record };
}

type Gramophone3DProps = { isPlaying: boolean };

export default function Gramophone3D({ isPlaying }: Gramophone3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const tonearmRef = useRef<THREE.Group | null>(null);
  const recordRef = useRef<THREE.Group | null>(null);
  const renderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffefd8, 0x352419, 1.7));
    const keyLight = new THREE.DirectionalLight(0xffe2bd, 4.4);
    keyLight.position.set(-4.5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.00015;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xfff3e3, 2.1);
    fillLight.position.set(5, 4, 4);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffc16f, 2.6);
    rimLight.position.set(1.5, 6, -5);
    scene.add(rimLight);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    const environmentTexture = pmrem.fromScene(roomEnvironment).texture;
    scene.environment = environmentTexture;
    scene.environmentIntensity = 0.85;
    disposeTree(roomEnvironment);
    pmrem.dispose();

    const { root: model, tonearm, record } = makeGramophone();
    tonearmRef.current = tonearm;
    recordRef.current = record;
    const sourceBounds = new THREE.Box3().setFromObject(model);
    const sourceCenter = sourceBounds.getCenter(new THREE.Vector3());
    model.position.sub(sourceCenter);
    scene.add(model);
    const bounds = new THREE.Box3().setFromObject(model);
    const sphere = bounds.getBoundingSphere(new THREE.Sphere());
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 24),
      new THREE.ShadowMaterial({ opacity: 0.2 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = bounds.min.y - 0.025;
    ground.receiveShadow = true;
    scene.add(ground);

    const fitCamera = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(width, height, false);
      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
      const limitingFov = Math.min(verticalFov, horizontalFov);
      const distance = (sphere.radius / Math.sin(limitingFov / 2)) * 0.84;
      const viewDirection = new THREE.Vector3(0.48, 0.38, 0.79).normalize();
      camera.position.copy(viewDirection.multiplyScalar(distance));
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    renderRef.current = () => renderer.render(scene, camera);

    const observer = new ResizeObserver(fitCamera);
    observer.observe(mount);
    mount.dataset.modelLoaded = "true";
    fitCamera();

    return () => {
      observer.disconnect();
      disposeTree(model);
      disposeTree(ground);
      environmentTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      tonearmRef.current = null;
      recordRef.current = null;
      renderRef.current = null;
    };
  }, []);

  useEffect(() => {
    const tonearm = tonearmRef.current;
    const render = renderRef.current;
    if (!tonearm || !render) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startRotation = tonearm.rotation.z;
    const targetRotation = isPlaying ? 0 : -0.45;
    const startTime = performance.now();
    let frame = 0;

    const animate = (now: number) => {
      const progress = reduceMotion ? 1 : Math.min((now - startTime) / 360, 1);
      const eased = progress * progress * (3 - 2 * progress);
      tonearm.rotation.z = startRotation + (targetRotation - startRotation) * eased;
      if (isPlaying && !reduceMotion && recordRef.current) {
        recordRef.current.rotation.y += 0.105;
      }
      render();

      if (progress < 1 || (isPlaying && !reduceMotion)) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  return (
    <div
      className="mom-gramophone-stage"
      ref={mountRef}
      role="img"
      aria-label="Gramofon vintage 3D dengan kabinet kayu, piringan hitam, tonearm, dan corong kuningan"
    />
  );
}
