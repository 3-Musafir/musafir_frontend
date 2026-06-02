import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useCallback, useMemo, useRef } from "react";
import * as THREE from "three";

type BrandSphereCanvasProps = {
  reducedMotion: boolean;
  enableParallax: boolean;
  onFormationComplete?: () => void;
  onBubblePop?: () => void;
  shouldAnimate?: boolean;
  contentSize?: {
    width: number;
    height: number;
  };
};

type MountainPoint = {
  u: number;
  v: number;
  x: number;
  depth: number;
  height: number;
  phase: number;
  tone: number;
};

type SphereNetwork = {
  pointPositions: Float32Array;
  pointColors: Float32Array;
  linePositions: Float32Array;
  lineColors: Float32Array;
  trianglePositions: Float32Array;
  triangleColors: Float32Array;
  rimPositions: Float32Array;
  rimColors: Float32Array;
};

const MOUNTAIN_COLUMNS = 304;
const MOUNTAIN_ROWS = 122;
const MOUNTAIN_COUNT = MOUNTAIN_COLUMNS * MOUNTAIN_ROWS;
const SPHERE_COLUMNS = 48;
const SPHERE_ROWS = 26;
const SPHERE_SURFACE_COUNT = SPHERE_COLUMNS * SPHERE_ROWS;
const SPHERE_OUTER_CLUSTERS = 6;
const SPHERE_OUTER_POINTS_PER_CLUSTER = 6;
const BRAND_ORANGE = new THREE.Color("#fd6705");
const SOFT_ORANGE = new THREE.Color("#ff9000");
const PALE_ORANGE = new THREE.Color("#ffd6a3");
const WARM_WHITE = new THREE.Color("#fff8ec");

const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1);
const easeOutCubic = (value: number) => 1 - Math.pow(1 - clamp01(value), 3);
const easeInOutSine = (value: number) => -(Math.cos(Math.PI * clamp01(value)) - 1) / 2;

const seeded = (value: number) => {
  const result = Math.sin(value * 12.9898) * 43758.5453;
  return result - Math.floor(result);
};

const mountainPeak = (
  x: number,
  z: number,
  peakX: number,
  peakZ: number,
  widthX: number,
  widthZ: number,
  height: number,
) => {
  const dx = (x - peakX) / widthX;
  const dz = (z - peakZ) / widthZ;

  return Math.exp(-(dx * dx + dz * dz)) * height;
};

const createMountainPoints = () =>
  Array.from({ length: MOUNTAIN_COUNT }, (_, index): MountainPoint => {
    const column = index % MOUNTAIN_COLUMNS;
    const row = Math.floor(index / MOUNTAIN_COLUMNS);
    const u = column / (MOUNTAIN_COLUMNS - 1);
    const v = row / (MOUNTAIN_ROWS - 1);
    const rawX = THREE.MathUtils.lerp(-1, 1, u);
    const x = Math.sign(rawX) * Math.pow(Math.abs(rawX), 0.72);
    const z = THREE.MathUtils.lerp(-1, 1, v);
    const centerValley = Math.exp(-(x * x) / 0.055) * Math.exp(-(z * z) / 0.92);
    const centerClear = 1 - centerValley * 0.92;
    const sideMass = Math.pow(Math.abs(x), 0.9);
    const nearMass = Math.pow(1 - v, 0.72);
    const ridge =
      mountainPeak(x, z, -0.98, -0.55, 0.1, 0.34, 2.05) +
      mountainPeak(x, z, -0.9, 0.08, 0.13, 0.66, 2.18) +
      mountainPeak(x, z, -0.73, 0.5, 0.11, 0.42, 1.65) +
      mountainPeak(x, z, -0.54, -0.34, 0.12, 0.34, 1.38) +
      mountainPeak(x, z, 0.54, -0.44, 0.12, 0.42, 1.48) +
      mountainPeak(x, z, 0.72, 0.22, 0.11, 0.5, 1.72) +
      mountainPeak(x, z, 0.9, -0.12, 0.12, 0.58, 2.02) +
      mountainPeak(x, z, 0.98, 0.54, 0.09, 0.42, 1.9);
    const distantRange =
      mountainPeak(x, z, -0.72, 0.82, 0.18, 0.22, 0.72) +
      mountainPeak(x, z, -0.28, 0.76, 0.2, 0.24, 0.58) +
      mountainPeak(x, z, 0.24, 0.78, 0.22, 0.22, 0.62) +
      mountainPeak(x, z, 0.74, 0.82, 0.18, 0.22, 0.76);
    const troughs =
      mountainPeak(x, z, -0.24, -0.04, 0.16, 0.68, 0.58) +
      mountainPeak(x, z, 0.22, 0.02, 0.18, 0.72, 0.54) +
      centerValley * 0.96;
    const strata =
      Math.sin(x * 16.4 + z * 4.8) * 0.095 +
      Math.cos(z * 17.2 - x * 3.8) * 0.07 +
      Math.sin((x + z) * 23.0) * 0.035 +
      (seeded(index * 3.91) - 0.5) * 0.055;
    const ridgeHeight =
      (ridge * centerClear + distantRange * 0.88) *
      (0.52 + sideMass * 0.92 + nearMass * 0.28);
    const baseSlope = 0.06 + nearMass * 0.16 + sideMass * 0.12;
    const height = THREE.MathUtils.clamp(ridgeHeight - troughs + strata + baseSlope, 0, 2.35);

    return {
      u,
      v,
      x,
      depth: z,
      height,
      phase: x * Math.PI * 2.4 + z * Math.PI * 2.1,
      tone: THREE.MathUtils.clamp(0.12 + height * 0.58 + (1 - v) * 0.2, 0, 1),
    };
  });

const createMountainColors = (points: MountainPoint[]) => {
  const colors = new Float32Array(MOUNTAIN_COUNT * 3);

  points.forEach((point, index) => {
    const color = BRAND_ORANGE.clone().lerp(SOFT_ORANGE, point.tone * 0.55);
    if (point.height > 0.78) {
      color.lerp(PALE_ORANGE, 0.42);
    }
    if (point.height > 1.02) {
      color.lerp(WARM_WHITE, 0.34);
    }

    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  });

  return colors;
};

const createSphereNetwork = (): SphereNetwork => {
  const positions: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];
  const outerClusters: number[][] = [];
  const outerAnchors: number[] = [];
  const linePositions: number[] = [];
  const lineColors: number[] = [];
  const trianglePositions: number[] = [];
  const triangleColors: number[] = [];
  const rimPositions: number[] = [];
  const rimColors: number[] = [];

  for (let row = 0; row < SPHERE_ROWS; row += 1) {
    const v = row / (SPHERE_ROWS - 1);
    const phi = v * Math.PI;
    const ringWeight = Math.sin(phi);

    for (let column = 0; column < SPHERE_COLUMNS; column += 1) {
      const index = row * SPHERE_COLUMNS + column;
      const u = column / SPHERE_COLUMNS;
      const theta = u * Math.PI * 2;
      const surfaceNoise =
        (seeded(index * 1.73) - 0.5) * 0.052 +
        Math.sin(theta * 4 + phi * 3.2) * 0.018;
      const radius = 1.01 + surfaceNoise + ringWeight * seeded(index * 0.61) * 0.04;
      const position = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * radius,
        Math.cos(phi) * radius,
        Math.sin(phi) * Math.sin(theta) * radius,
      );
      const glow = Math.pow(ringWeight, 0.35);
      const color = BRAND_ORANGE.clone().lerp(SOFT_ORANGE, glow * 0.55);

      if (seeded(index * 3.17) > 0.83) {
        color.lerp(WARM_WHITE, 0.72);
      } else if (seeded(index * 2.91) > 0.72) {
        color.lerp(PALE_ORANGE, 0.42);
      }

      positions[index] = position;
      colors[index] = color;
    }
  }

  for (let cluster = 0; cluster < SPHERE_OUTER_CLUSTERS; cluster += 1) {
    const row = 2 + Math.floor(seeded(cluster * 2.31) * (SPHERE_ROWS - 4));
    const column = Math.floor(
      ((cluster / SPHERE_OUTER_CLUSTERS) * SPHERE_COLUMNS +
        seeded(cluster * 4.17) * 7) %
        SPHERE_COLUMNS,
    );
    const anchorIndex = row * SPHERE_COLUMNS + column;
    const anchor = positions[anchorIndex];
    const normal = anchor.clone().normalize();
    const tangentA = new THREE.Vector3(-normal.z, 0, normal.x).normalize();
    const tangentB = new THREE.Vector3().crossVectors(normal, tangentA).normalize();
    const clusterIndices: number[] = [];
    const spread = 0.08 + seeded(cluster * 6.13) * 0.06;
    const reach = 0.14 + seeded(cluster * 7.19) * 0.18;

    outerAnchors.push(anchorIndex);

    for (let point = 0; point < SPHERE_OUTER_POINTS_PER_CLUSTER; point += 1) {
      const seed = SPHERE_SURFACE_COUNT + cluster * SPHERE_OUTER_POINTS_PER_CLUSTER + point;
      const step = point / (SPHERE_OUTER_POINTS_PER_CLUSTER - 1);
      const angle = seeded(seed * 1.91) * Math.PI * 2;
      const tangentOffset = tangentA
        .clone()
        .multiplyScalar(Math.cos(angle) * spread * (0.45 + step))
        .add(tangentB.clone().multiplyScalar(Math.sin(angle) * spread * (0.45 + step)));
      const position = normal
        .clone()
        .multiplyScalar(1.05 + step * reach + seeded(seed * 3.11) * 0.05)
        .add(tangentOffset);
      const color = BRAND_ORANGE.clone().lerp(PALE_ORANGE, 0.28 + step * 0.28);

      if (seeded(seed * 4.71) > 0.72) {
        color.lerp(WARM_WHITE, 0.68);
      }

      positions.push(position);
      colors.push(color);
      clusterIndices.push(positions.length - 1);
    }

    outerClusters.push(clusterIndices);
  }

  const pushLine = (from: number, to: number) => {
    const start = positions[from];
    const end = positions[to];
    const startColor = colors[from];
    const endColor = colors[to];

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

  const pushRimLine = (from: number, to: number) => {
    const start = positions[from];
    const end = positions[to];

    rimPositions.push(start.x, start.y, start.z, end.x, end.y, end.z);
    rimColors.push(
      WARM_WHITE.r,
      WARM_WHITE.g,
      WARM_WHITE.b,
      WARM_WHITE.r,
      WARM_WHITE.g,
      WARM_WHITE.b,
    );
  };

  const pushTriangle = (a: number, b: number, c: number, tone: number) => {
    const color = BRAND_ORANGE.clone().lerp(PALE_ORANGE, tone).lerp(WARM_WHITE, 0.12);

    [a, b, c].forEach((index) => {
      const position = positions[index];

      trianglePositions.push(position.x, position.y, position.z);
      triangleColors.push(color.r, color.g, color.b);
    });
  };

  for (let row = 0; row < SPHERE_ROWS; row += 1) {
    for (let column = 0; column < SPHERE_COLUMNS; column += 1) {
      const index = row * SPHERE_COLUMNS + column;
      const nextColumn = row * SPHERE_COLUMNS + ((column + 1) % SPHERE_COLUMNS);
      const sideGlow = Math.abs(column / SPHERE_COLUMNS - 0.5);

      pushLine(index, nextColumn);

      if (sideGlow > 0.32 || seeded(index * 10.47) > 0.93) {
        pushRimLine(index, nextColumn);
      }

      if (row < SPHERE_ROWS - 1) {
        const down = (row + 1) * SPHERE_COLUMNS + column;
        pushLine(index, down);

        if (sideGlow > 0.34 || seeded(index * 11.23) > 0.95) {
          pushRimLine(index, down);
        }

        if (seeded(index * 4.13) > 0.42) {
          const diagonal = (row + 1) * SPHERE_COLUMNS + ((column + 1) % SPHERE_COLUMNS);
          pushLine(index, diagonal);
        }

        if (seeded(index * 8.37) > 0.72) {
          const diagonal = (row + 1) * SPHERE_COLUMNS + ((column + 1) % SPHERE_COLUMNS);
          pushTriangle(index, down, diagonal, 0.16 + seeded(index * 3.83) * 0.38);
        }

        if (seeded(index * 9.11) > 0.86) {
          const diagonal = (row + 1) * SPHERE_COLUMNS + ((column + 1) % SPHERE_COLUMNS);
          pushTriangle(index, nextColumn, diagonal, 0.2 + seeded(index * 2.29) * 0.44);
        }
      }
    }
  }

  outerClusters.forEach((cluster, clusterIndex) => {
    const anchorIndex = outerAnchors[clusterIndex];

    cluster.forEach((outerIndex, pointIndex) => {
      pushLine(pointIndex === 0 ? anchorIndex : cluster[pointIndex - 1], outerIndex);

      if (pointIndex > 1 && seeded(outerIndex * 6.19) > 0.3) {
        pushLine(cluster[pointIndex - 2], outerIndex);
      }

      if (pointIndex > 1 && seeded(outerIndex * 2.43) > 0.48) {
        pushTriangle(
          pointIndex === 2 ? anchorIndex : cluster[pointIndex - 3],
          cluster[pointIndex - 1],
          outerIndex,
          0.22 + seeded(outerIndex * 2.17) * 0.46,
        );
      }
    });

    if (clusterIndex > 0 && seeded(clusterIndex * 5.41) > 0.62) {
      const previousCluster = outerClusters[clusterIndex - 1];
      pushLine(cluster[1], previousCluster[previousCluster.length - 2]);
    }
  });

  const pointPositions = new Float32Array(positions.length * 3);
  const pointColors = new Float32Array(colors.length * 3);

  positions.forEach((position, index) => {
    const color = colors[index];

    pointPositions[index * 3] = position.x;
    pointPositions[index * 3 + 1] = position.y;
    pointPositions[index * 3 + 2] = position.z;
    pointColors[index * 3] = color.r;
    pointColors[index * 3 + 1] = color.g;
    pointColors[index * 3 + 2] = color.b;
  });

  return {
    pointPositions,
    pointColors,
    linePositions: new Float32Array(linePositions),
    lineColors: new Float32Array(lineColors),
    trianglePositions: new Float32Array(trianglePositions),
    triangleColors: new Float32Array(triangleColors),
    rimPositions: new Float32Array(rimPositions),
    rimColors: new Float32Array(rimColors),
  };
};

function BubbleHeroCore({
  reducedMotion,
  enableParallax,
  onFormationComplete,
  onBubblePop,
  shouldAnimate = true,
  contentSize = { width: 360, height: 260 },
}: BrandSphereCanvasProps) {
  const sceneGroupRef = useRef<THREE.Group>(null);
  const bubbleGroupRef = useRef<THREE.Group>(null);
  const waveGeometryRef = useRef<THREE.BufferGeometry>(null);
  const networkFaceMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const networkRimMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const networkPointMaterialRef = useRef<THREE.PointsMaterial>(null);
  const networkLineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const waveMaterialRef = useRef<THREE.PointsMaterial>(null);
  const startRef = useRef<number | null>(null);
  const popStartRef = useRef<number | null>(null);
  const poppedRef = useRef(false);
  const doneRef = useRef(false);
  const timeRef = useRef(0);

  const wavePoints = useMemo(createMountainPoints, []);
  const wavePositions = useMemo(() => new Float32Array(MOUNTAIN_COUNT * 3), []);
  const waveColors = useMemo(() => createMountainColors(wavePoints), [wavePoints]);
  const sphereNetwork = useMemo(createSphereNetwork, []);

  const handleBubbleClick = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      if (reducedMotion || poppedRef.current) return;

      poppedRef.current = true;
      popStartRef.current = timeRef.current;
      onBubblePop?.();
    },
    [onBubblePop, reducedMotion],
  );

  useFrame(({ clock, pointer, size, viewport }) => {
    if (startRef.current === null) {
      startRef.current = clock.getElapsedTime();
    }

    const elapsed = clock.getElapsedTime() - startRef.current;
    timeRef.current = elapsed;

    const introProgress = shouldAnimate ? easeOutCubic(elapsed / 1.35) : 1;
    const popAge = popStartRef.current === null ? -1 : elapsed - popStartRef.current;
    const tension = popAge >= 0 ? easeInOutSine(popAge / 0.18) : 0;
    const release = popAge > 0.16 ? easeOutCubic((popAge - 0.16) / 0.62) : 0;
    const bubbleOpacity = reducedMotion ? 1 : Math.max(0, 1 - release);
    const introScale = reducedMotion ? 1 : 0.72 + introProgress * 0.28;
    const compressionX = 1 - tension * 0.075 + release * 0.22;
    const compressionY = 1 + tension * 0.045 + release * 0.18;
    const compressionZ = 1 - tension * 0.035 + release * 0.16;
    const compactCanvas = size.width < 640;
    const bubblePadding = compactCanvas ? 82 : 112;
    const desiredBubbleDiameter = Math.max(
      contentSize.width + bubblePadding,
      contentSize.height + bubblePadding,
    );
    const maxVisibleBubbleDiameter = Math.min(size.width * 0.78, size.height * 0.68);
    const bubbleDiameter = Math.min(desiredBubbleDiameter, maxVisibleBubbleDiameter);
    const bubbleRadius = (bubbleDiameter / Math.max(size.height, 1)) * viewport.height * 0.5;
    const adaptiveX = bubbleRadius;
    const adaptiveY = bubbleRadius * 0.98;
    const adaptiveZ = Math.max(0.38, bubbleRadius * 0.58);

    if (bubbleGroupRef.current) {
      bubbleGroupRef.current.visible = bubbleOpacity > 0.015;
      bubbleGroupRef.current.scale.set(
        introScale * adaptiveX * compressionX,
        introScale * adaptiveY * compressionY,
        introScale * adaptiveZ * compressionZ,
      );
      bubbleGroupRef.current.rotation.z = Math.sin(elapsed * 0.18) * 0.025;

      if (enableParallax && !poppedRef.current && !reducedMotion) {
        bubbleGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          bubbleGroupRef.current.rotation.y,
          pointer.x * 0.16,
          0.06,
        );
        bubbleGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          bubbleGroupRef.current.rotation.x,
          -pointer.y * 0.12,
          0.06,
        );
      }
    }

    if (networkPointMaterialRef.current) {
      networkPointMaterialRef.current.opacity = 0.9 * bubbleOpacity;
      networkPointMaterialRef.current.size = 0.013 + Math.sin(elapsed * 0.6) * 0.0015;
    }
    if (networkLineMaterialRef.current) {
      networkLineMaterialRef.current.opacity = 0.34 * bubbleOpacity;
    }
    if (networkRimMaterialRef.current) {
      networkRimMaterialRef.current.opacity = 0.88 * bubbleOpacity;
    }
    if (networkFaceMaterialRef.current) {
      networkFaceMaterialRef.current.opacity = 0.11 * bubbleOpacity;
    }
    const waveAge = popAge - 0.12;
    const waveReveal = reducedMotion ? 0 : easeOutCubic(waveAge / 1.65);
    const waveSettle = easeOutCubic(Math.max(0, waveAge - 0.55) / 1.9);
    const centerY = -0.1;
    const mountainWorldWidth = compactCanvas
      ? Math.max(viewport.width * 1.34, 4.85)
      : Math.max(viewport.width * 1.18, 7.2);
    const mountainDepth = compactCanvas
      ? Math.max(2.2, Math.min(3.05, viewport.height * 0.62))
      : Math.max(3.15, Math.min(4.85, viewport.height * 0.76));
    const mountainBaseY = compactCanvas
      ? -Math.max(0.82, Math.min(1.02, adaptiveY * 0.48))
      : -Math.max(1.02, Math.min(1.34, adaptiveY * 0.58));
    const peakScale = compactCanvas ? 0.68 : 1.04;
    const valleyCut = compactCanvas ? 0.34 : 0.52;

    wavePoints.forEach((point, index) => {
      const depthPerspective = THREE.MathUtils.lerp(
        compactCanvas ? 1.08 : 1.22,
        compactCanvas ? 0.72 : 0.54,
        point.v,
      );
      const terrainX =
        THREE.MathUtils.lerp(-mountainWorldWidth / 2, mountainWorldWidth / 2, (point.x + 1) / 2) *
        depthPerspective;
      const terrainZ = THREE.MathUtils.lerp(mountainDepth * 0.72, -mountainDepth * 0.64, point.v);
      const distanceFromCenter = Math.hypot((point.u - 0.5) * 1.35, (point.v - 0.52) * 0.95);
      const distanceDelay =
        distanceFromCenter * 1.25 +
        Math.abs(point.depth) * 0.18;
      const localReveal = easeOutCubic((waveAge - distanceDelay) / 1.4);
      const terrainBreath =
        Math.sin(elapsed * 0.22 + point.phase) * 0.035 +
        Math.cos(elapsed * 0.16 + point.phase * 0.7) * 0.02;
      const finalX =
        terrainX +
        Math.sin(point.depth * 4.7 + elapsed * 0.11) * 0.045 * waveSettle;
      const finalY =
        mountainBaseY +
        point.height * peakScale +
        (1 - point.v) * (compactCanvas ? 0.14 : 0.28) +
        terrainBreath * waveSettle -
        Math.exp(-Math.pow((point.u - 0.5) / 0.2, 2)) * valleyCut;
      const finalZ =
        terrainZ +
        Math.sin(terrainX * 0.95 + point.phase + elapsed * 0.12) * 0.13 * waveSettle;
      const originPull = 1 - localReveal;

      wavePositions[index * 3] = finalX * localReveal;
      wavePositions[index * 3 + 1] = centerY * originPull + finalY * localReveal;
      wavePositions[index * 3 + 2] = finalZ * localReveal;
    });

    const wavePositionAttribute = waveGeometryRef.current?.getAttribute("position");
    if (wavePositionAttribute) {
      wavePositionAttribute.needsUpdate = true;
    }
    if (waveMaterialRef.current) {
      waveMaterialRef.current.opacity = (compactCanvas ? 0.92 : 0.98) * waveReveal;
      waveMaterialRef.current.size =
        (compactCanvas ? 0.007 : 0.0072) +
        waveReveal * (compactCanvas ? 0.0075 : 0.0094);
    }

    if (sceneGroupRef.current) {
      sceneGroupRef.current.rotation.z = Math.sin(elapsed * 0.045) * 0.01;
    }

    if (introProgress >= 1 && !doneRef.current) {
      doneRef.current = true;
      onFormationComplete?.();
    }
  });

  return (
    <group ref={sceneGroupRef}>
      <group ref={bubbleGroupRef}>
        <mesh onPointerDown={handleBubbleClick}>
          <sphereGeometry args={[1.12, 24, 24]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        <mesh renderOrder={0}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[sphereNetwork.trianglePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[sphereNetwork.triangleColors, 3]} />
          </bufferGeometry>
          <meshBasicMaterial
            ref={networkFaceMaterialRef}
            vertexColors
            transparent
            opacity={0.11}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        <lineSegments renderOrder={1}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[sphereNetwork.linePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[sphereNetwork.lineColors, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={networkLineMaterialRef}
            vertexColors
            transparent
            opacity={0.34}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        <lineSegments renderOrder={2}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[sphereNetwork.rimPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[sphereNetwork.rimColors, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            ref={networkRimMaterialRef}
            vertexColors
            transparent
            opacity={0.88}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        <points renderOrder={3}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[sphereNetwork.pointPositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[sphereNetwork.pointColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={networkPointMaterialRef}
            vertexColors
            size={0.014}
            sizeAttenuation
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      <points renderOrder={4}>
        <bufferGeometry ref={waveGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[wavePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[waveColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={waveMaterialRef}
          vertexColors
          size={0.012}
          sizeAttenuation
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function BrandSphereCanvas({
  reducedMotion,
  enableParallax,
  onFormationComplete,
  onBubblePop,
  shouldAnimate = true,
  contentSize,
}: BrandSphereCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 3.25], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="pointer-events-auto"
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <ambientLight intensity={0.72} />
      <directionalLight position={[-2.4, 3.2, 4.1]} intensity={1.35} color="#fff4e8" />
      <directionalLight position={[2.5, -1.8, 2.3]} intensity={0.75} color="#ff9000" />
      <pointLight position={[-1.4, 1.3, 2.2]} intensity={1.4} color="#ffd4a3" />
      <BubbleHeroCore
        reducedMotion={reducedMotion}
        enableParallax={enableParallax}
        onFormationComplete={onFormationComplete}
        onBubblePop={onBubblePop}
        shouldAnimate={shouldAnimate}
        contentSize={contentSize}
      />
    </Canvas>
  );
}
