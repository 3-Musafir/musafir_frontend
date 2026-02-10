import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return prefersReducedMotion;
};

const useCoarsePointer = () => {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarse(mediaQuery.matches);
    update();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return isCoarse;
};

const createSeededRandom = (seedValue: number) => {
  let seed = seedValue;
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

function Constellation({ density = 80 }: { density?: number }) {
  const { points, lines } = useMemo(() => {
    const random = createSeededRandom(42);
    const positions = new Float32Array(density * 3);

    for (let i = 0; i < density; i += 1) {
      const i3 = i * 3;
      positions[i3] = (random() - 0.5) * 5.2;
      positions[i3 + 1] = (random() - 0.5) * 3.4;
      positions[i3 + 2] = (random() - 0.5) * 2.6;
    }

    const lineCount = Math.floor(density * 0.8);
    const linePositions = new Float32Array(lineCount * 2 * 3);

    for (let i = 0; i < lineCount; i += 1) {
      const start = Math.floor(random() * density) * 3;
      const end = Math.floor(random() * density) * 3;
      const offset = i * 6;

      linePositions[offset] = positions[start];
      linePositions[offset + 1] = positions[start + 1];
      linePositions[offset + 2] = positions[start + 2];
      linePositions[offset + 3] = positions[end];
      linePositions[offset + 4] = positions[end + 1];
      linePositions[offset + 5] = positions[end + 2];
    }

    return { points: positions, lines: linePositions };
  }, [density]);

  return (
    <group position={[0, 0, -1.4]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={points}
            count={points.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#f5d2a5"
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={lines}
            count={lines.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#f0c89a" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

function GlassMonolith() {
  const geometry = useMemo(() => {
    const width = 1.7;
    const height = 2.4;
    const radius = 0.28;
    const shape = new THREE.Shape();

    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 6,
    });
  }, []);

  return (
    <group>
      <mesh geometry={geometry} rotation={[0, -0.15, 0]}>
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.18}
          metalness={0.1}
          transmission={0.78}
          thickness={0.8}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[1.3, 1.9]} />
        <meshStandardMaterial color="#fff7ef" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function Scene({ isCoarse }: { isCoarse: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isCoarse) return undefined;

    const handlePointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      pointerRef.current.x = THREE.MathUtils.clamp(x, -0.4, 0.4);
      pointerRef.current.y = THREE.MathUtils.clamp(y, -0.4, 0.4);
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, [isCoarse]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    const float = Math.sin(elapsed * 0.6) * 0.12;
    const targetX = pointerRef.current.y * 0.22;
    const targetY = pointerRef.current.x * 0.24;

    groupRef.current.position.y = float;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Constellation density={isCoarse ? 52 : 86} />
      <GlassMonolith />
    </group>
  );
}

export default function FounderHero3D() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isCoarse = useCoarsePointer();

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="h-full w-full" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        frameloop="always"
        className="h-full w-full"
        role="presentation"
        tabIndex={-1}
        aria-hidden
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 5, 6]} intensity={0.75} color="#ffffff" />
        <pointLight position={[-3, -2, 3]} intensity={0.45} color="#ffd8b0" />
        <Scene isCoarse={isCoarse} />
      </Canvas>
    </div>
  );
}
