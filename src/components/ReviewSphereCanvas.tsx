import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type ReviewSphereCanvasProps = {
  rotation: number;
};

type PointCloudNetwork = {
  pointPositions: Float32Array;
  pointColors: Float32Array;
  linePositions: Float32Array;
  lineColors: Float32Array;
  facePositions: Float32Array;
  faceColors: Float32Array;
};

const SPHERE_RADIUS = 1.12;
const PARTICLE_COUNT = 260;
const POINT_CLOUD_COLUMNS = 58;
const POINT_CLOUD_ROWS = 32;

const brandOrange = new THREE.Color("#fd6705");
const paleOrange = new THREE.Color("#ffd6a3");
const warmWhite = new THREE.Color("#fff8ec");
const deepOrange = new THREE.Color("#b83b05");

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

const createPointCloudNetwork = (): PointCloudNetwork => {
  const points: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];
  const linePositions: number[] = [];
  const lineColors: number[] = [];
  const facePositions: number[] = [];
  const faceColors: number[] = [];

  for (let row = 0; row < POINT_CLOUD_ROWS; row += 1) {
    const v = row / (POINT_CLOUD_ROWS - 1);
    const phi = v * Math.PI;
    const ringWeight = Math.sin(phi);

    for (let column = 0; column < POINT_CLOUD_COLUMNS; column += 1) {
      const index = row * POINT_CLOUD_COLUMNS + column;
      const u = column / POINT_CLOUD_COLUMNS;
      const surfaceNoise =
        (seeded(index * 1.73) - 0.5) * 0.038 +
        Math.sin(u * Math.PI * 8 + phi * 2.2) * 0.014;
      const point = pointOnSphere(u, v)
        .multiplyScalar(SPHERE_RADIUS + 0.034 + surfaceNoise + ringWeight * 0.015);
      const color = deepOrange.clone().lerp(brandOrange, 0.48 + ringWeight * 0.34);

      if (seeded(index * 3.17) > 0.84) {
        color.lerp(warmWhite, 0.26);
      } else if (seeded(index * 2.91) > 0.72) {
        color.lerp(paleOrange, 0.24);
      }

      points.push(point);
      colors.push(color);
    }
  }

  const pushLine = (from: number, to: number, opacityBias = 1) => {
    const start = points[from];
    const end = points[to];
    const startColor = colors[from].clone().lerp(paleOrange, 0.08 * opacityBias);
    const endColor = colors[to].clone().lerp(warmWhite, 0.04 * opacityBias);

    linePositions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    lineColors.push(
      startColor.r,
      startColor.g,
      startColor.b,
      endColor.r,
      endColor.g,
      endColor.b,
    );
  };

  const pushFace = (a: number, b: number, c: number) => {
    const tone = seeded((a + b + c) * 0.71);
    const color = deepOrange.clone().lerp(brandOrange, 0.28 + tone * 0.42).lerp(paleOrange, tone * 0.16);

    [a, b, c].forEach((index) => {
      const point = points[index];
      facePositions.push(point.x, point.y, point.z);
      faceColors.push(color.r, color.g, color.b);
    });
  };

  for (let row = 0; row < POINT_CLOUD_ROWS; row += 1) {
    for (let column = 0; column < POINT_CLOUD_COLUMNS; column += 1) {
      const index = row * POINT_CLOUD_COLUMNS + column;
      const nextColumn = row * POINT_CLOUD_COLUMNS + ((column + 1) % POINT_CLOUD_COLUMNS);

      if (seeded(index * 5.11) > 0.16) {
        pushLine(index, nextColumn, 0.7);
      }

      if (row < POINT_CLOUD_ROWS - 1) {
        const down = (row + 1) * POINT_CLOUD_COLUMNS + column;
        const diagonal = (row + 1) * POINT_CLOUD_COLUMNS + ((column + 1) % POINT_CLOUD_COLUMNS);

        if (seeded(index * 6.17) > 0.24) {
          pushLine(index, down, 0.8);
        }

        if (seeded(index * 4.13) > 0.6) {
          pushLine(index, diagonal, 1);
        }

        if (seeded(index * 8.37) > 0.74) {
          pushFace(index, down, diagonal);
        }
      }
    }
  }

  const pointPositions = new Float32Array(points.length * 3);
  const pointColors = new Float32Array(colors.length * 3);

  points.forEach((point, index) => {
    const color = colors[index];
    pointPositions[index * 3] = point.x;
    pointPositions[index * 3 + 1] = point.y;
    pointPositions[index * 3 + 2] = point.z;
    pointColors[index * 3] = color.r;
    pointColors[index * 3 + 1] = color.g;
    pointColors[index * 3 + 2] = color.b;
  });

  return {
    pointPositions,
    pointColors,
    linePositions: new Float32Array(linePositions),
    lineColors: new Float32Array(lineColors),
    facePositions: new Float32Array(facePositions),
    faceColors: new Float32Array(faceColors),
  };
};

function ReviewSplineSphere({ rotation }: ReviewSphereCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);

  const particlePositions = useMemo(createParticlePositions, []);
  const pointCloudNetwork = useMemo(createPointCloudNetwork, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const targetRotation = THREE.MathUtils.degToRad(rotation);
    const group = groupRef.current;

    if (group) {
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotation, 0.028);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -0.14, 0.035);
      group.rotation.z = Math.sin(elapsed * 0.045) * 0.014;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh renderOrder={0}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointCloudNetwork.facePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[pointCloudNetwork.faceColors, 3]} />
        </bufferGeometry>
        <meshBasicMaterial
          vertexColors
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <lineSegments renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointCloudNetwork.linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[pointCloudNetwork.lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.44}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points renderOrder={2}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointCloudNetwork.pointPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[pointCloudNetwork.pointColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.019}
          sizeAttenuation
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points renderOrder={3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#fff8ec"
          size={0.014}
          sizeAttenuation
          transparent
          opacity={0.72}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

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
