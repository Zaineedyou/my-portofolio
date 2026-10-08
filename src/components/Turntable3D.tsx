import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type Turntable3DProps = {
  isPlaying: boolean;
};

function makeCylinder(
  radius: number,
  height: number,
  position: THREE.Vector3,
  material: THREE.Material,
  segments = 48,
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, segments),
    material,
  );
  mesh.position.copy(position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeRod(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
) {
  const direction = end.clone().sub(start);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), 16),
    material,
  );
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function makeRecordLabelTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = "#c68d67";
    context.fillRect(0, 0, 512, 512);
    context.strokeStyle = "#221811";
    context.lineWidth = 14;
    context.beginPath();
    context.arc(256, 256, 238, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = "#211710";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "900 112px sans-serif";
    context.fillText("ONE", 256, 220);
    context.font = "800 48px sans-serif";
    context.letterSpacing = "5px";
    context.fillText("FOR MOM", 256, 310);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export default function Turntable3D({ isPlaying }: Turntable3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const vinylRef = useRef<THREE.Group | null>(null);
  const tonearmRef = useRef<THREE.Group | null>(null);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

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
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
    camera.position.set(0, 5.1, 7.7);
    camera.lookAt(0, 0.24, 0);

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff2e4, 0x533722, 2.1));

    const keyLight = new THREE.DirectionalLight(0xffe5c9, 3.1);
    keyLight.position.set(-4.5, 8, 5.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -7;
    keyLight.shadow.camera.right = 7;
    keyLight.shadow.camera.top = 7;
    keyLight.shadow.camera.bottom = -7;
    keyLight.shadow.bias = -0.0002;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfff8ed, 1.35);
    fillLight.position.set(5, 4, -4);
    scene.add(fillLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 24),
      new THREE.ShadowMaterial({ opacity: 0.18 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.245;
    ground.receiveShadow = true;
    scene.add(ground);

    const wood = new THREE.MeshStandardMaterial({
      color: "#bc825c",
      roughness: 0.5,
      metalness: 0.08,
    });
    const woodTop = new THREE.MeshStandardMaterial({
      color: "#d09a72",
      roughness: 0.58,
      metalness: 0.04,
    });
    const darkWood = new THREE.MeshStandardMaterial({
      color: "#75482d",
      roughness: 0.52,
      metalness: 0.08,
    });
    const blackMetal = new THREE.MeshStandardMaterial({
      color: "#242322",
      roughness: 0.36,
      metalness: 0.58,
    });
    const vinylMaterial = new THREE.MeshStandardMaterial({
      color: "#111111",
      roughness: 0.52,
      metalness: 0.16,
    });
    const chrome = new THREE.MeshStandardMaterial({
      color: "#d7c5af",
      roughness: 0.28,
      metalness: 0.82,
    });
    const bronze = new THREE.MeshStandardMaterial({
      color: "#b7835c",
      roughness: 0.31,
      metalness: 0.64,
    });

    const turntable = new THREE.Group();
    scene.add(turntable);

    const lowerBody = new THREE.Mesh(
      new RoundedBoxGeometry(6.35, 0.52, 4.35, 5, 0.16),
      darkWood,
    );
    lowerBody.position.y = 0.14;
    lowerBody.castShadow = true;
    lowerBody.receiveShadow = true;
    turntable.add(lowerBody);

    const deck = new THREE.Mesh(
      new RoundedBoxGeometry(6.15, 0.14, 4.15, 5, 0.1),
      wood,
    );
    deck.position.y = 0.45;
    deck.castShadow = true;
    deck.receiveShadow = true;
    turntable.add(deck);

    const deckSurface = new THREE.Mesh(
      new RoundedBoxGeometry(6.03, 0.045, 4.03, 5, 0.08),
      woodTop,
    );
    deckSurface.position.y = 0.54;
    deckSurface.castShadow = true;
    deckSurface.receiveShadow = true;
    turntable.add(deckSurface);

    for (const x of [-2.55, 2.55]) {
      for (const z of [-1.58, 1.58]) {
        const foot = makeCylinder(0.2, 0.18, new THREE.Vector3(x, -0.19, z), blackMetal, 32);
        turntable.add(foot);
      }
    }

    const platterX = -1.18;
    const platterZ = 0.06;
    turntable.add(makeCylinder(1.67, 0.13, new THREE.Vector3(platterX, 0.625, platterZ), blackMetal, 96));
    turntable.add(makeCylinder(1.58, 0.055, new THREE.Vector3(platterX, 0.715, platterZ), chrome, 96));
    turntable.add(makeCylinder(1.51, 0.065, new THREE.Vector3(platterX, 0.768, platterZ), blackMetal, 96));

    const vinyl = new THREE.Group();
    vinyl.position.set(platterX, 0.82, platterZ);
    vinylRef.current = vinyl;
    turntable.add(vinyl);

    const record = new THREE.Mesh(new THREE.CylinderGeometry(1.46, 1.46, 0.055, 96), vinylMaterial);
    record.castShadow = true;
    record.receiveShadow = true;
    vinyl.add(record);

    const grooveMaterials = [
      new THREE.MeshStandardMaterial({ color: "#252525", roughness: 0.68, metalness: 0.12 }),
      new THREE.MeshStandardMaterial({ color: "#181818", roughness: 0.56, metalness: 0.2 }),
    ];
    for (let index = 0; index < 18; index += 1) {
      const radius = 0.55 + index * 0.047;
      const groove = new THREE.Mesh(
        new THREE.RingGeometry(radius, radius + 0.009, 96),
        grooveMaterials[index % grooveMaterials.length],
      );
      groove.rotation.x = -Math.PI / 2;
      groove.position.y = 0.0285;
      groove.receiveShadow = true;
      vinyl.add(groove);
    }

    const label = new THREE.Mesh(
      new THREE.CircleGeometry(0.47, 64),
      new THREE.MeshStandardMaterial({ map: makeRecordLabelTexture(), roughness: 0.72 }),
    );
    label.rotation.x = -Math.PI / 2;
    label.position.y = 0.0295;
    label.receiveShadow = true;
    vinyl.add(label);

    const labelRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.475, 0.014, 8, 64),
      bronze,
    );
    labelRim.rotation.x = -Math.PI / 2;
    labelRim.position.y = 0.033;
    vinyl.add(labelRim);

    const spindle = makeCylinder(0.045, 0.075, new THREE.Vector3(0, 0.04, 0), chrome, 24);
    vinyl.add(spindle);

    const controlBase = makeCylinder(0.28, 0.12, new THREE.Vector3(2.2, 0.61, 1.2), blackMetal, 48);
    turntable.add(controlBase);
    const controlCap = makeCylinder(0.205, 0.08, new THREE.Vector3(2.2, 0.705, 1.2), bronze, 48);
    turntable.add(controlCap);
    const smallSwitch = makeCylinder(0.105, 0.1, new THREE.Vector3(2.2, 0.61, 0.58), chrome, 32);
    turntable.add(smallSwitch);

    const pivotPosition = new THREE.Vector3(2.03, 0.73, -1.37);
    const pivotBase = makeCylinder(0.22, 0.16, new THREE.Vector3(pivotPosition.x, 0.61, pivotPosition.z), blackMetal, 40);
    turntable.add(pivotBase);

    const pivotCap = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 20), bronze);
    pivotCap.position.copy(pivotPosition);
    pivotCap.castShadow = true;
    pivotCap.receiveShadow = true;
    turntable.add(pivotCap);

    const tonearm = new THREE.Group();
    tonearm.position.copy(pivotPosition);
    tonearmRef.current = tonearm;
    turntable.add(tonearm);

    const armEnd = new THREE.Vector3(-2.22, 0, 0.92);
    tonearm.add(makeRod(new THREE.Vector3(0, 0.12, 0), armEnd, 0.047, chrome));

    const counterweight = makeCylinder(0.14, 0.22, new THREE.Vector3(0.08, 0.12, -0.04), bronze, 32);
    counterweight.rotation.z = Math.PI / 2;
    tonearm.add(counterweight);

    const cartridge = new THREE.Mesh(
      new RoundedBoxGeometry(0.25, 0.14, 0.22, 3, 0.035),
      blackMetal,
    );
    cartridge.position.copy(armEnd).add(new THREE.Vector3(-0.02, -0.02, 0.02));
    cartridge.castShadow = true;
    tonearm.add(cartridge);

    const stylus = makeRod(
      armEnd.clone().add(new THREE.Vector3(-0.04, -0.06, 0.02)),
      armEnd.clone().add(new THREE.Vector3(-0.04, -0.2, 0.02)),
      0.012,
      chrome,
    );
    tonearm.add(stylus);

    const armRest = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.18), blackMetal);
    armRest.position.set(2.36, 0.61, -1.16);
    armRest.castShadow = true;
    turntable.add(armRest);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.28, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = 0.78;
    controls.maxPolarAngle = 1.32;
    controls.minAzimuthAngle = -0.72;
    controls.maxAzimuthAngle = 0.72;
    controls.update();

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(width, height, false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const delta = Math.min(clock.getDelta(), 0.05);
      if (isPlayingRef.current && vinylRef.current) {
        vinylRef.current.rotation.y += delta * 1.45;
      }
      if (tonearmRef.current) {
        const targetAngle = isPlayingRef.current ? -0.13 : 0;
        tonearmRef.current.rotation.y = THREE.MathUtils.damp(
          tonearmRef.current.rotation.y,
          targetAngle,
          4,
          delta,
        );
      }
      controls.update();
      renderer.render(scene, camera);
    });

    return () => {
      observer.disconnect();
      controls.dispose();
      renderer.setAnimationLoop(null);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      vinylRef.current = null;
      tonearmRef.current = null;
    };
  }, []);

  return (
    <div
      className="mom-turntable-stage"
      ref={mountRef}
      role="img"
      aria-label="Model 3D turntable kayu dengan piringan vinyl yang berputar saat musik diputar"
    />
  );
}
