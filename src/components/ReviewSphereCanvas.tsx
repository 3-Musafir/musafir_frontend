import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type ReviewSphereCanvasProps = {
  rotation: number;
};

type Hub = {
  current: THREE.Vector3;
  target: THREE.Vector3;
  pull: number;
  swirl: number;
  size: number;
};

type StreamSeed = {
  start: THREE.Vector3;
  direction: 1 | -1;
  speed: number;
  wave: number;
};

const SPHERE_RADIUS = 1.12;
const STREAM_COUNT = 184;
const STREAM_POINTS = 64;
const HUB_COUNT = 6;
const PARTICLE_COUNT = 260;

const brandOrange = new THREE.Color("#ff9000");
const brightOrange = new THREE.Color("#ffbd59");
const paleOrange = new THREE.Color("#ffe2b2");

const seeded = (value: number) => {
  const result = Math.sin(value * 12.9898) * 43758.5453;
  return result - Math.floor(result);
};

const pointOnSphere = (u: number, v: number) => {
  const theta = u * Math.PI * 2;
  const y = THREE.MathUtils.lerp(-0.92, 0.92, v);
  const radius = Math.sqrt(Math.max(0, 1 - y * y));

  return new THREE.Vector3(
    Math.cos(theta) * radius,
    y,
    Math.sin(theta) * radius,
  ).normalize();
};

const hubTarget = (index: number, seed: number) =>
  pointOnSphere(
    seeded(seed * 2.41 + index * 5.17),
    THREE.MathUtils.lerp(0.16, 0.84, seeded(seed * 6.73 + index * 8.91)),
  );

const createStreamSeeds = () =>
  Array.from({ length: STREAM_COUNT }, (_, index): StreamSeed => {
    const family = index % 8;
    const familyIndex = Math.floor(index / 8);
    const familyOffset = family / 8;
    const jitter = (seeded(index + 0.37) - 0.5) * 0.11;
    const u =
      (familyOffset +
        familyIndex / Math.ceil(STREAM_COUNT / 8) * 0.84 +
        seeded(index * 2.7) * 0.045) %
      1;
    const v = THREE.MathUtils.clamp(
      0.07 + seeded(family * 13.9) * 0.18 + familyIndex / Math.ceil(STREAM_COUNT / 8) * 0.76 + jitter,
      0.04,
      0.96,
    );

    return {
      start: pointOnSphere(u, v),
      direction: seeded(index * 1.91) > 0.5 ? 1 : -1,
      speed: 0.011 + seeded(index * 3.43) * 0.008,
      wave: seeded(index * 9.21) * Math.PI * 2,
    };
  });

const createParticlePositions = () => {
  const positions = new Float32Array(PARTICLE_COUNT * 3);

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const point = pointOnSphere(seeded(index * 3.17), seeded(index * 7.93)).multiplyScalar(
      SPHERE_RADIUS + 0.031 + seeded(index * 2.31) * 0.018,
    );
    positions[index * 3] = point.x;
    positions[index * 3 + 1] = point.y;
    positions[index * 3 + 2] = point.z;
  }

  return positions;
};

const projectToTangent = (normal: THREE.Vector3, vector: THREE.Vector3) =>
  vector.sub(normal.clone().multiplyScalar(vector.dot(normal)));

const flowDirection = (
  point: THREE.Vector3,
  hubs: Hub[],
  time: number,
  streamIndex: number,
  out: THREE.Vector3,
) => {
  out.set(
    -point.z * 0.38 + Math.sin(time * 0.18 + point.y * 4 + streamIndex * 0.07) * 0.08,
    Math.sin(point.x * 5.5 + time * 0.12 + streamIndex * 0.03) * 0.11,
    point.x * 0.38 + Math.cos(time * 0.16 + point.y * 3.4) * 0.08,
  );
  projectToTangent(point, out);

  hubs.forEach((hub, hubIndex) => {
    const dot = THREE.MathUtils.clamp(point.dot(hub.current), -1, 1);
    const angle = Math.acos(dot);
    const influence = Math.exp(-(angle * angle) / 0.23);
    if (influence < 0.004) return;

    const towardHub = hub.current.clone().sub(point.clone().multiplyScalar(dot)).normalize();
    const aroundHub = new THREE.Vector3().crossVectors(point, hub.current).normalize();
    const streamBias = Math.sin(streamIndex * 0.37 + hubIndex * 1.8) > 0 ? 1 : -1;

    out.add(towardHub.multiplyScalar(influence * hub.pull));
    out.add(aroundHub.multiplyScalar(influence * hub.swirl * streamBias));
  });

  return out.normalize();
};

function ReviewSplineSphere({ rotation }: ReviewSphereCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lineGeometries = useRef<Array<THREE.BufferGeometry | null>>([]);
  const hubMeshes = useRef<Array<THREE.Mesh | null>>([]);
  const lastRotation = useRef(rotation);
  const hubSeed = useRef(1);
  const tangentRef = useRef(new THREE.Vector3());

  const streamSeeds = useMemo(createStreamSeeds, []);
  const particlePositions = useMemo(createParticlePositions, []);
  const streamPositions = useMemo(
    () =>
      Array.from(
        { length: STREAM_COUNT },
        () => new Float32Array(STREAM_POINTS * 3),
      ),
    [],
  );

  const hubs = useRef<Hub[]>(
    Array.from({ length: HUB_COUNT }, (_, index) => ({
      current: hubTarget(index, 1),
      target: hubTarget(index, 1),
      pull: 0.42 + seeded(index + 2.7) * 0.44,
      swirl: 0.18 + seeded(index + 8.4) * 0.34,
      size: 0.024 + seeded(index + 5.6) * 0.018,
    })),
  );

  useEffect(() => {
    if (lastRotation.current === rotation) return;

    lastRotation.current = rotation;
    hubSeed.current += 1;
    hubs.current.forEach((hub, index) => {
      hub.target.copy(hubTarget(index, hubSeed.current));
    });
  }, [rotation]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const targetRotation = THREE.MathUtils.degToRad(rotation);
    const group = groupRef.current;

    if (group) {
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotation, 0.028);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -0.14, 0.035);
      group.rotation.z = Math.sin(elapsed * 0.045) * 0.014;
    }

    hubs.current.forEach((hub, index) => {
      hub.current.lerp(hub.target, 0.008).normalize();

      const mesh = hubMeshes.current[index];
      if (!mesh) return;
      mesh.position.copy(hub.current).multiplyScalar(SPHERE_RADIUS + 0.046);
      mesh.scale.setScalar(hub.size * (1.08 + Math.sin(elapsed * 0.72 + index) * 0.12));
    });

    lineGeometries.current.forEach((geometry, streamIndex) => {
      if (!geometry) return;

      const seed = streamSeeds[streamIndex];
      const positions = streamPositions[streamIndex];
      const point = seed.start
        .clone()
        .add(
          tangentRef.current
            .set(
              Math.sin(elapsed * 0.035 + seed.wave) * 0.006,
              Math.cos(elapsed * 0.028 + seed.wave) * 0.006,
              Math.sin(elapsed * 0.032 + seed.wave * 0.7) * 0.006,
            ),
        )
        .normalize();

      for (let index = 0; index < STREAM_POINTS; index += 1) {
        const radius =
          SPHERE_RADIUS +
          0.02 +
          Math.sin(index * 0.5 + streamIndex * 0.17 + elapsed * 0.1) * 0.002;
        positions[index * 3] = point.x * radius;
        positions[index * 3 + 1] = point.y * radius;
        positions[index * 3 + 2] = point.z * radius;

        const direction = flowDirection(
          point,
          hubs.current,
          elapsed,
          streamIndex,
          tangentRef.current,
        ).multiplyScalar(seed.speed * seed.direction);

        point.add(direction).normalize();
      }

      const positionAttribute = geometry.getAttribute("position");
      positionAttribute.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef}>
      <mesh renderOrder={0}>
        <sphereGeometry args={[SPHERE_RADIUS, 128, 128]} />
        <meshPhysicalMaterial
          color="#050200"
          roughness={0.62}
          metalness={0.04}
          clearcoat={0.46}
          clearcoatRoughness={0.2}
          emissive="#3d1600"
          emissiveIntensity={0.12}
        />
      </mesh>

      <mesh renderOrder={1} scale={1.012}>
        <sphereGeometry args={[SPHERE_RADIUS, 96, 96]} />
        <meshBasicMaterial
          color="#ff9000"
          transparent
          opacity={0.055}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {streamPositions.map((positions, index) => (
        <line key={`review-flow-${index}`} renderOrder={2}>
          <bufferGeometry
            ref={(node) => {
              lineGeometries.current[index] = node;
            }}
          >
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color={index % 9 === 0 ? paleOrange : index % 4 === 0 ? brightOrange : brandOrange}
            transparent
            opacity={index % 9 === 0 ? 0.72 : index % 4 === 0 ? 0.48 : 0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </line>
      ))}

      <points renderOrder={3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#fff8ec"
          size={0.014}
          sizeAttenuation
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </points>

      {hubs.current.map((hub, index) => (
        <mesh
          key={`review-flow-hub-${index}`}
          ref={(node) => {
            hubMeshes.current[index] = node;
          }}
          position={hub.current.clone().multiplyScalar(SPHERE_RADIUS + 0.046)}
          scale={hub.size}
          renderOrder={4}
        >
          <sphereGeometry args={[1, 20, 20]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? "#fff6df" : "#ffb13d"}
            transparent
            opacity={0.96}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ReviewSphereCanvas({ rotation }: ReviewSphereCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.28], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="pointer-events-none"
    >
      <ambientLight intensity={0.34} />
      <directionalLight position={[-2.5, 3.1, 4.2]} intensity={1.35} color="#ffd3a0" />
      <directionalLight position={[2.6, -1.8, 2.2]} intensity={0.65} color="#ff9000" />
      <pointLight position={[-1.4, 1.6, 2.4]} intensity={1.45} color="#ffc06b" />
      <ReviewSplineSphere rotation={rotation} />
    </Canvas>
  );
}
