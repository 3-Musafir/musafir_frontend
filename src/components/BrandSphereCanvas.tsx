import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useCallback, useMemo, useRef } from "react";
import * as THREE from "three";

type BrandSphereCanvasProps = {
  reducedMotion: boolean;
  enableParallax: boolean;
  onFormationComplete?: () => void;
  onBubblePop?: () => void;
  onBubbleRestore?: () => void;
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

type MountainConnections = {
  indices: Uint32Array;
  colors: Float32Array;
};

type MountainSurface = {
  indices: Uint32Array;
  colors: Float32Array;
};

const MOUNTAIN_COLUMNS = 360;
const MOUNTAIN_ROWS = 138;
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
const DEEP_ORANGE = new THREE.Color("#b83b05");

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
      color.lerp(PALE_ORANGE, 0.32);
    }
    if (point.height > 1.02) {
      color.lerp(WARM_WHITE, 0.2);
    }

    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  });

  return colors;
};

const createMountainConnections = (points: MountainPoint[]): MountainConnections => {
  const indices: number[] = [];
  const colors: number[] = [];

  const addConnection = (from: number, to: number) => {
    const start = points[from];
    const end = points[to];
    const tone = THREE.MathUtils.clamp((start.height + end.height) * 0.24, 0, 1);
    const startColor = DEEP_ORANGE.clone().lerp(BRAND_ORANGE, 0.36 + tone * 0.34);
    const endColor = BRAND_ORANGE.clone().lerp(PALE_ORANGE, tone * 0.24);

    indices.push(from, to);
    colors.push(
      startColor.r,
      startColor.g,
      startColor.b,
      endColor.r,
      endColor.g,
      endColor.b,
    );
  };

  for (let row = 1; row < MOUNTAIN_ROWS - 1; row += 2) {
    for (let column = 1; column < MOUNTAIN_COLUMNS - 1; column += 3) {
      const index = row * MOUNTAIN_COLUMNS + column;
      const point = points[index];
      const ridgePoint = point.height > 0.58 && Math.abs(point.x) > 0.24;

      if (!ridgePoint) continue;

      if (points[index + 1].height > 0.5 && seeded(index * 5.17) > 0.16) {
        addConnection(index, index + 1);
      }

      if (points[index + MOUNTAIN_COLUMNS].height > 0.54 && seeded(index * 6.31) > 0.48) {
        addConnection(index, index + MOUNTAIN_COLUMNS);
      }

      if (
        points[index + MOUNTAIN_COLUMNS + 1].height > 0.68 &&
        seeded(index * 7.83) > 0.72
      ) {
        addConnection(index, index + MOUNTAIN_COLUMNS + 1);
      }
    }
  }

  return {
    indices: new Uint32Array(indices),
    colors: new Float32Array(colors),
  };
};

const createMountainSurface = (points: MountainPoint[]): MountainSurface => {
  const indices: number[] = [];
  const colors: number[] = [];

  const addTriangle = (a: number, b: number, c: number) => {
    const height = (points[a].height + points[b].height + points[c].height) / 3;
    const side = (Math.abs(points[a].x) + Math.abs(points[b].x) + Math.abs(points[c].x)) / 3;
    const tone = THREE.MathUtils.clamp(height * 0.26 + side * 0.22, 0, 1);
    const color = DEEP_ORANGE.clone().lerp(BRAND_ORANGE, 0.36 + tone * 0.34).lerp(PALE_ORANGE, tone * 0.18);

    indices.push(a, b, c);

    for (let vertex = 0; vertex < 3; vertex += 1) {
      colors.push(color.r, color.g, color.b);
    }
  };

  for (let row = 2; row < MOUNTAIN_ROWS - 3; row += 3) {
    for (let column = 2; column < MOUNTAIN_COLUMNS - 3; column += 4) {
      const a = row * MOUNTAIN_COLUMNS + column;
      const b = a + 1;
      const c = a + MOUNTAIN_COLUMNS;
      const d = c + 1;
      const avgHeight = (points[a].height + points[b].height + points[c].height + points[d].height) / 4;
      const sideMass = Math.abs(points[a].x);
      const inMountainBody = avgHeight > 0.4 || sideMass > 0.34;

      if (!inMountainBody || seeded(a * 9.91) < 0.18) continue;

      addTriangle(a, c, d);

      if (avgHeight > 0.62 || seeded(a * 4.37) > 0.46) {
        addTriangle(a, d, b);
      }
    }
  }

  return {
    indices: new Uint32Array(indices),
    colors: new Float32Array(colors),
  };
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
      const color = DEEP_ORANGE.clone().lerp(BRAND_ORANGE, 0.44 + glow * 0.34);

      if (seeded(index * 3.17) > 0.83) {
        color.lerp(WARM_WHITE, 0.24);
      } else if (seeded(index * 2.91) > 0.72) {
        color.lerp(PALE_ORANGE, 0.26);
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
      const color = DEEP_ORANGE.clone().lerp(BRAND_ORANGE, 0.42 + step * 0.28);

      if (seeded(seed * 4.71) > 0.72) {
        color.lerp(WARM_WHITE, 0.22);
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
      PALE_ORANGE.r,
      PALE_ORANGE.g,
      PALE_ORANGE.b,
      PALE_ORANGE.r,
      PALE_ORANGE.g,
      PALE_ORANGE.b,
    );
  };

  const pushTriangle = (a: number, b: number, c: number, tone: number) => {
    const color = BRAND_ORANGE.clone().lerp(PALE_ORANGE, tone * 0.82).lerp(WARM_WHITE, 0.06);

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
  onBubbleRestore,
  shouldAnimate = true,
  contentSize = { width: 360, height: 260 },
}: BrandSphereCanvasProps) {
  const sceneGroupRef = useRef<THREE.Group>(null);
  const bubbleGroupRef = useRef<THREE.Group>(null);
  const waveGeometryRef = useRef<THREE.BufferGeometry>(null);
  const mountainSurfaceGeometryRef = useRef<THREE.BufferGeometry>(null);
  const mountainConnectionGeometryRef = useRef<THREE.BufferGeometry>(null);
  const networkFaceMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const networkRimMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const networkPointMaterialRef = useRef<THREE.PointsMaterial>(null);
  const networkLineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const mountainSurfaceMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const mountainConnectionMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const waveMaterialRef = useRef<THREE.PointsMaterial>(null);
  const startRef = useRef<number | null>(null);
  const transitionStartRef = useRef<number | null>(null);
  const transitionFromRef = useRef(0);
  const transitionToRef = useRef(0);
  const mountainProgressRef = useRef(0);
  const poppedRef = useRef(false);
  const doneRef = useRef(false);
  const timeRef = useRef(0);

  const wavePoints = useMemo(createMountainPoints, []);
  const wavePositions = useMemo(() => new Float32Array(MOUNTAIN_COUNT * 3), []);
  const waveColors = useMemo(() => createMountainColors(wavePoints), [wavePoints]);
  const mountainConnections = useMemo(() => createMountainConnections(wavePoints), [wavePoints]);
  const mountainSurface = useMemo(() => createMountainSurface(wavePoints), [wavePoints]);
  const mountainConnectionPositions = useMemo(
    () => new Float32Array(mountainConnections.indices.length * 3),
    [mountainConnections],
  );
  const mountainSurfacePositions = useMemo(
    () => new Float32Array(mountainSurface.indices.length * 3),
    [mountainSurface],
  );
  const sphereNetwork = useMemo(createSphereNetwork, []);

  const handleBubbleClick = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      if (reducedMotion) return;

      const next = poppedRef.current ? 0 : 1;

      transitionFromRef.current = mountainProgressRef.current;
      transitionToRef.current = next;
      transitionStartRef.current = timeRef.current;
      poppedRef.current = next === 1;

      if (next === 1) {
        onBubblePop?.();
      } else {
        onBubbleRestore?.();
      }
    },
    [onBubblePop, onBubbleRestore, reducedMotion],
  );

  useFrame(({ clock, pointer, size, viewport }) => {
    if (startRef.current === null) {
      startRef.current = clock.getElapsedTime();
    }

    const elapsed = clock.getElapsedTime() - startRef.current;
    timeRef.current = elapsed;

    const introProgress = shouldAnimate ? easeOutCubic(elapsed / 1.35) : 1;
    const transitionAge =
      transitionStartRef.current === null ? -1 : elapsed - transitionStartRef.current;
    const transitionDuration = 1.15;
    const transitionProgress =
      transitionAge < 0 ? 1 : easeInOutSine(transitionAge / transitionDuration);
    const mountainProgress =
      transitionStartRef.current === null
        ? transitionToRef.current
        : THREE.MathUtils.lerp(
            transitionFromRef.current,
            transitionToRef.current,
            transitionProgress,
          );
    mountainProgressRef.current = mountainProgress;

    if (transitionAge >= transitionDuration) {
      transitionStartRef.current = null;
      mountainProgressRef.current = transitionToRef.current;
    }

    const tension =
      transitionAge >= 0 && transitionAge < 0.24
        ? Math.sin((transitionAge / 0.24) * Math.PI)
        : 0;
    const bubbleOpacity = reducedMotion ? 1 : 1 - mountainProgress;
    const introScale = reducedMotion ? 1 : 0.72 + introProgress * 0.28;
    const compressionX = 1 - tension * 0.075 + mountainProgress * 0.22;
    const compressionY = 1 + tension * 0.045 + mountainProgress * 0.18;
    const compressionZ = 1 - tension * 0.035 + mountainProgress * 0.16;
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
      bubbleGroupRef.current.visible = true;
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
      networkPointMaterialRef.current.opacity = 0.76 * bubbleOpacity;
      networkPointMaterialRef.current.size = 0.013 + Math.sin(elapsed * 0.6) * 0.0015;
    }
    if (networkLineMaterialRef.current) {
      networkLineMaterialRef.current.opacity = 0.24 * bubbleOpacity;
    }
    if (networkRimMaterialRef.current) {
      networkRimMaterialRef.current.opacity = 0.48 * bubbleOpacity;
    }
    if (networkFaceMaterialRef.current) {
      networkFaceMaterialRef.current.opacity = 0.08 * bubbleOpacity;
    }
    const waveReveal = reducedMotion ? 0 : mountainProgress;
    const waveSettle = easeOutCubic(mountainProgress);
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
      const distanceDelay = distanceFromCenter * 0.42 + Math.abs(point.depth) * 0.08;
      const localReveal = easeOutCubic((mountainProgress - distanceDelay) / 0.72);
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

    for (let index = 0; index < mountainConnections.indices.length; index += 2) {
      const from = mountainConnections.indices[index];
      const to = mountainConnections.indices[index + 1];
      const fromOffset = from * 3;
      const toOffset = to * 3;
      const lineOffset = index * 3;
      const fromX = wavePositions[fromOffset];
      const fromY = wavePositions[fromOffset + 1];
      const fromZ = wavePositions[fromOffset + 2];
      const toX = wavePositions[toOffset];
      const toY = wavePositions[toOffset + 1];
      const toZ = wavePositions[toOffset + 2];
      const dx = toX - fromX;
      const dy = toY - fromY;
      const dz = toZ - fromZ;
      const maxSegmentLength = compactCanvas ? 0.12 : 0.16;
      const shouldDraw = dx * dx + dy * dy + dz * dz < maxSegmentLength * maxSegmentLength;

      mountainConnectionPositions[lineOffset] = fromX;
      mountainConnectionPositions[lineOffset + 1] = fromY;
      mountainConnectionPositions[lineOffset + 2] = fromZ;
      mountainConnectionPositions[lineOffset + 3] = shouldDraw ? toX : fromX;
      mountainConnectionPositions[lineOffset + 4] = shouldDraw ? toY : fromY;
      mountainConnectionPositions[lineOffset + 5] = shouldDraw ? toZ : fromZ;
    }

    for (let index = 0; index < mountainSurface.indices.length; index += 3) {
      const a = mountainSurface.indices[index];
      const b = mountainSurface.indices[index + 1];
      const c = mountainSurface.indices[index + 2];
      const aOffset = a * 3;
      const bOffset = b * 3;
      const cOffset = c * 3;
      const surfaceOffset = index * 3;
      const ax = wavePositions[aOffset];
      const ay = wavePositions[aOffset + 1];
      const az = wavePositions[aOffset + 2];
      const bx = wavePositions[bOffset];
      const by = wavePositions[bOffset + 1];
      const bz = wavePositions[bOffset + 2];
      const cx = wavePositions[cOffset];
      const cy = wavePositions[cOffset + 1];
      const cz = wavePositions[cOffset + 2];
      const maxEdgeLength = compactCanvas ? 0.16 : 0.22;
      const maxEdgeSq = maxEdgeLength * maxEdgeLength;
      const ab =
        (bx - ax) * (bx - ax) +
        (by - ay) * (by - ay) +
        (bz - az) * (bz - az);
      const bc =
        (cx - bx) * (cx - bx) +
        (cy - by) * (cy - by) +
        (cz - bz) * (cz - bz);
      const ca =
        (ax - cx) * (ax - cx) +
        (ay - cy) * (ay - cy) +
        (az - cz) * (az - cz);
      const shouldDraw = ab < maxEdgeSq && bc < maxEdgeSq && ca < maxEdgeSq;

      mountainSurfacePositions[surfaceOffset] = ax;
      mountainSurfacePositions[surfaceOffset + 1] = ay;
      mountainSurfacePositions[surfaceOffset + 2] = az;
      mountainSurfacePositions[surfaceOffset + 3] = shouldDraw ? bx : ax;
      mountainSurfacePositions[surfaceOffset + 4] = shouldDraw ? by : ay;
      mountainSurfacePositions[surfaceOffset + 5] = shouldDraw ? bz : az;
      mountainSurfacePositions[surfaceOffset + 6] = shouldDraw ? cx : ax;
      mountainSurfacePositions[surfaceOffset + 7] = shouldDraw ? cy : ay;
      mountainSurfacePositions[surfaceOffset + 8] = shouldDraw ? cz : az;
    }

    const wavePositionAttribute = waveGeometryRef.current?.getAttribute("position");
    if (wavePositionAttribute) {
      wavePositionAttribute.needsUpdate = true;
    }
    const mountainSurfacePositionAttribute =
      mountainSurfaceGeometryRef.current?.getAttribute("position");
    if (mountainSurfacePositionAttribute) {
      mountainSurfacePositionAttribute.needsUpdate = true;
    }
    const mountainConnectionPositionAttribute =
      mountainConnectionGeometryRef.current?.getAttribute("position");
    if (mountainConnectionPositionAttribute) {
      mountainConnectionPositionAttribute.needsUpdate = true;
    }
    if (waveMaterialRef.current) {
      waveMaterialRef.current.opacity = (compactCanvas ? 0.92 : 0.98) * waveReveal;
      waveMaterialRef.current.size =
        (compactCanvas ? 0.007 : 0.0072) +
        waveReveal * (compactCanvas ? 0.0075 : 0.0094);
    }
    if (mountainConnectionMaterialRef.current) {
      mountainConnectionMaterialRef.current.opacity = (compactCanvas ? 0.15 : 0.2) * waveReveal;
    }
    if (mountainSurfaceMaterialRef.current) {
      mountainSurfaceMaterialRef.current.opacity = (compactCanvas ? 0.045 : 0.065) * waveReveal;
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
      <mesh position={[0, 0, 1.15]} onPointerDown={handleBubbleClick}>
        <planeGeometry args={[24, 14]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

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
            opacity={0.08}
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
            opacity={0.24}
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
            opacity={0.48}
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
            opacity={0.76}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      <mesh renderOrder={4}>
        <bufferGeometry ref={mountainSurfaceGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[mountainSurfacePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[mountainSurface.colors, 3]} />
        </bufferGeometry>
        <meshBasicMaterial
          ref={mountainSurfaceMaterialRef}
          vertexColors
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <lineSegments renderOrder={4}>
        <bufferGeometry ref={mountainConnectionGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[mountainConnectionPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[mountainConnections.colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={mountainConnectionMaterialRef}
          vertexColors
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points renderOrder={5}>
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
  onBubbleRestore,
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
        onBubbleRestore={onBubbleRestore}
        shouldAnimate={shouldAnimate}
        contentSize={contentSize}
      />
    </Canvas>
  );
}
