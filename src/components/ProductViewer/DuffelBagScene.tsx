"use client";

import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import * as THREE from "three";
import { useScrollProgress } from "@/context/ScrollContext";
import { useReducedMotion, useIsMobile } from "@/hooks/useReducedMotion";

export type ProductVariant = "bag";

interface ModelConfig {
  obj: string;
  mtl: string | null;
  fallbackColor: string;
  targetSize: number;
  scale: number;
  position: [number, number, number];
}

export const MODEL_CONFIGS: Record<ProductVariant, ModelConfig> = {
  bag: {
    obj: "/models/dufflebag.obj",
    mtl: null,
    fallbackColor: "#6b3344",
    targetSize: 2.4,
    scale: 1,
    position: [0, 0, 0],
  },
};

type ModelFormat = "gltf" | "obj";

function getModelFormat(path: string): ModelFormat {
  const ext = path.split(".").pop()?.toLowerCase();
  return ext === "obj" ? "obj" : "gltf";
}

function applyFallbackMaterial(object: THREE.Object3D, color: string) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.62,
    metalness: 0.12,
  });

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.castShadow = true;
    child.receiveShadow = true;
    child.material = material.clone();
  });
}

function normalizeObject(object: THREE.Object3D, config: ModelConfig, useFallbackMaterial: boolean) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = config.targetSize / maxDim;

  object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  object.scale.setScalar(scale);

  if (useFallbackMaterial) {
    applyFallbackMaterial(object, config.fallbackColor);
  }

  return object;
}

function sanitizeMtlMaterials(materials: MTLLoader.MaterialCreator) {
  materials.preload();

  Object.values(materials.materials).forEach((material) => {
    material.side = THREE.FrontSide;

    if (material instanceof THREE.MeshPhongMaterial) {
      if (material.map && !material.map.image) {
        material.map = null;
      }
    }
  });
}

function useObjModelPlain(config: ModelConfig) {
  const obj = useLoader(OBJLoader, config.obj);
  return useMemo(
    () => normalizeObject(obj.clone(), config, true),
    [obj, config],
  );
}

function useObjModelWithMtl(config: ModelConfig) {
  const mtlMaterials = useLoader(MTLLoader, config.mtl!, (loader) => {
    loader.setResourcePath("/models/");
    loader.setMaterialOptions({
      side: THREE.FrontSide,
      wrap: THREE.RepeatWrapping,
    });
  });

  const obj = useLoader(OBJLoader, config.obj, (loader) => {
    sanitizeMtlMaterials(mtlMaterials);
    loader.setMaterials(mtlMaterials);
  });

  return useMemo(() => {
    const clone = obj.clone();
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;

      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat) => {
        if (mat instanceof THREE.MeshPhongMaterial || mat instanceof THREE.MeshStandardMaterial) {
          if (mat.map && !mat.map.image) mat.map = null;
        }
      });
    });

    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = config.targetSize / maxDim;

    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    clone.scale.setScalar(scale);

    return clone;
  }, [obj, config]);
}

function useGltfModel(path: string, config: ModelConfig) {
  const { scene } = useGLTF(path);
  return useMemo(() => normalizeObject(scene.clone(), config, true), [scene, config]);
}

interface SceneModelProps {
  config: ModelConfig;
  floating?: boolean;
  floatIntensity?: number;
}

function ObjPlainLoadedModel({ config, floating, floatIntensity = 0.08 }: SceneModelProps) {
  const model = useObjModelPlain(config);
  return <ModelWrapper config={config} model={model} floating={floating} floatIntensity={floatIntensity} />;
}

function ObjMtlLoadedModel({ config, floating, floatIntensity = 0.08 }: SceneModelProps) {
  const model = useObjModelWithMtl(config);
  return <ModelWrapper config={config} model={model} floating={floating} floatIntensity={floatIntensity} />;
}

function GltfLoadedModel({ config, floating, floatIntensity = 0.08 }: SceneModelProps) {
  const model = useGltfModel(config.obj, config);
  return <ModelWrapper config={config} model={model} floating={floating} floatIntensity={floatIntensity} />;
}

function ModelWrapper({
  config,
  model,
  floating,
  floatIntensity = 0.08,
}: SceneModelProps & { model: THREE.Object3D }) {
  const groupRef = useRef<THREE.Group>(null);
  const { rotation, scale, cameraZ, inGalleryMode, viewMode } = useScrollProgress();

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y = rotation;

    const canFloat = floating && viewMode === "hero" && !inGalleryMode;
    if (canFloat) {
      groupRef.current.position.y =
        config.position[1] + Math.sin(state.clock.elapsedTime * 0.6) * floatIntensity;
    } else {
      groupRef.current.position.y = config.position[1];
    }

    groupRef.current.scale.setScalar(scale * config.scale);

    const camera = state.camera;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraZ, 0.08);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef} position={config.position}>
      <primitive object={model} />
    </group>
  );
}

function LoadedModel({ config, floating, floatIntensity = 0.08 }: SceneModelProps) {
  const format = getModelFormat(config.obj);

  if (format === "obj") {
    return config.mtl ? (
      <ObjMtlLoadedModel config={config} floating={floating} floatIntensity={floatIntensity} />
    ) : (
      <ObjPlainLoadedModel config={config} floating={floating} floatIntensity={floatIntensity} />
    );
  }

  return <GltfLoadedModel config={config} floating={floating} floatIntensity={floatIntensity} />;
}

function LoadingIndicator() {
  return (
    <mesh>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshBasicMaterial color="#b89b67" wireframe />
    </mesh>
  );
}

function ProductScene({ config, floating, floatIntensity }: SceneModelProps) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#f2eee6" />
      <directionalLight position={[-4, 2, -3]} intensity={0.9} color="#b89b67" />
      <pointLight position={[0, 2, 4]} intensity={1.2} color="#ffffff" />

      <Suspense fallback={<LoadingIndicator />}>
        <LoadedModel config={config} floating={floating} floatIntensity={floatIntensity} />
      </Suspense>

      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.5}
        scale={8}
        blur={2.5}
        far={5}
        color="#000000"
      />
    </>
  );
}

export interface ProductViewerProps {
  className?: string;
  floating?: boolean;
  floatIntensity?: number;
  dpr?: number;
  variant?: ProductVariant;
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; className?: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`flex items-center justify-center ${this.props.className ?? ""}`}>
          <p className="label-caps text-warm-gray">Unable to load 3D model</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function DuffelBagScene({
  className = "",
  floating = false,
  floatIntensity = 0.08,
  dpr,
  variant = "bag",
}: ProductViewerProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const config = MODEL_CONFIGS[variant];

  if (reducedMotion) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative h-full w-full max-w-md">
          <div className="absolute inset-0 rounded-full bg-gold/5 blur-3xl" />
          <div className="relative flex h-full items-center justify-center">
            <svg viewBox="0 0 200 120" className="h-auto w-4/5 opacity-90" aria-hidden="true">
              <rect x="30" y="40" width="140" height="55" rx="8" fill="#4a2230" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ModelErrorBoundary className={className}>
      <div className={`relative min-h-[280px] ${className}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,155,103,0.12)_0%,transparent_70%)]" />
        <Canvas
          camera={{ position: [0, 0.2, 5.5], fov: 35, near: 0.1, far: 100 }}
          dpr={dpr ?? (isMobile ? [1, 1.5] : [1, 2])}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent", width: "100%", height: "100%" }}
        >
          <ProductScene config={config} floating={floating} floatIntensity={floatIntensity} />
        </Canvas>
      </div>
    </ModelErrorBoundary>
  );
}

if (getModelFormat(MODEL_CONFIGS.bag.obj) === "gltf") {
  useGLTF.preload(MODEL_CONFIGS.bag.obj);
}
