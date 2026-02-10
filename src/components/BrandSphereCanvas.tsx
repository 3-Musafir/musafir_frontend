import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

type BrandSphereCanvasProps = {
  reducedMotion: boolean;
  enableParallax: boolean;
  onFormationComplete?: () => void;
  shouldAnimate?: boolean;
  lightMainRef?: React.RefObject<THREE.DirectionalLight>;
  lightRimRef?: React.RefObject<THREE.DirectionalLight>;
};

function SphereCore({
  reducedMotion,
  enableParallax,
  onFormationComplete,
  shouldAnimate = true,
  lightMainRef,
  lightRimRef,
}: BrandSphereCanvasProps) {
  const MAX_RIPPLES = 8;
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const shaderRef = useRef<THREE.Shader | null>(null);
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);
  const timeRef = useRef(0);
  const rippleIndexRef = useRef(0);
  const rippleOriginsRef = useRef(
    Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector3(0, 0, 1)),
  );
  const rippleTimesRef = useRef(Array.from({ length: MAX_RIPPLES }, () => -1000));
  const tempPointRef = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!materialRef.current) return;

    materialRef.current.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uMorph = { value: 0 };
      shader.uniforms.uWave = { value: 0.035 };
      shader.uniforms.uColorA = { value: new THREE.Color("#FD8E29") };
      shader.uniforms.uColorB = { value: new THREE.Color("#FF490E") };
      shader.uniforms.uRippleOrigins = { value: rippleOriginsRef.current };
      shader.uniforms.uRippleTimes = { value: rippleTimesRef.current };
      shader.uniforms.uRippleDuration = { value: 2.0 };
      shader.uniforms.uRippleMaxRadius = { value: 1.15 };
      shader.uniforms.uRippleAmp = { value: 0.06 };

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
uniform float uTime;
uniform float uMorph;
uniform float uWave;
uniform vec3 uRippleOrigins[${MAX_RIPPLES}];
uniform float uRippleTimes[${MAX_RIPPLES}];
uniform float uRippleDuration;
uniform float uRippleMaxRadius;
uniform float uRippleAmp;
varying float vRipple;`,
        )
        .replace(
          "#include <begin_vertex>",
          `vec3 transformed = vec3(position);
vec3 rippleNormal = normalize(position);
float rippleTotal = 0.0;
for (int i = 0; i < ${MAX_RIPPLES}; i++) {
  float age = uTime - uRippleTimes[i];
  if (age >= 0.0 && age <= uRippleDuration) {
    float t = age / uRippleDuration;
    float radius = t * uRippleMaxRadius;
    float dist = acos(clamp(dot(rippleNormal, normalize(uRippleOrigins[i])), -1.0, 1.0));
    float width = 0.22;
    float band = smoothstep(radius - width, radius, dist) * (1.0 - smoothstep(radius, radius + width, dist));
    float amp = pow(1.0 - t, 2.0);
    rippleTotal += band * amp;
  }
}
float wave = sin((position.y * 3.6 + uTime * 0.6)) * cos((position.x * 4.2 + uTime * 0.5));
float displacement = wave * uWave * uMorph;
transformed += normal * (displacement + rippleTotal * uRippleAmp);
vRipple = rippleTotal;`,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;
varying float vRipple;`,
        )
        .replace(
          "vec4 diffuseColor = vec4( diffuse, opacity );",
          `float shift = sin(uTime * 0.5 + vNormal.y * 2.4 + vNormal.x * 1.6) * 0.5 + 0.5;
	shift = smoothstep(0.08, 0.92, shift);
	shift = pow(shift, 1.35);
	vec3 grad = mix(uColorA, uColorB, shift);
	vec4 diffuseColor = vec4(diffuse * grad, opacity);`,
        )
        .replace(
          "#include <roughnessmap_fragment>",
          `#include <roughnessmap_fragment>
roughnessFactor = clamp(roughnessFactor - vRipple * 0.18, 0.05, 1.0);`,
        );

      shaderRef.current = shader;
    };

    materialRef.current.needsUpdate = true;
  }, []);

  useFrame(({ clock, pointer }) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    const shader = shaderRef.current;
    if (!mesh || !shader) return;

    if (reducedMotion) {
      mesh.scale.setScalar(1.05);
      shader.uniforms.uTime.value = 0;
      shader.uniforms.uMorph.value = 1;
      shader.uniforms.uWave.value = 0;
      return;
    }

    if (startRef.current === null) {
      if (!shouldAnimate) {
        startRef.current = clock.getElapsedTime();
      } else {
        startRef.current = clock.getElapsedTime();
      }
    }

    const elapsed = clock.getElapsedTime() - startRef.current;
    const duration = 2.6;
    const progress = shouldAnimate ? Math.min(elapsed / duration, 1) : 1;
    const eased = shouldAnimate ? (1 - Math.pow(1 - progress, 3)) : 1;

    mesh.scale.setScalar(0.05 + 1.05 * eased);
    shader.uniforms.uTime.value = elapsed;
    timeRef.current = elapsed;
    shader.uniforms.uMorph.value = eased;
    shader.uniforms.uWave.value = 0.035;

    if (lightMainRef?.current) {
      const t = clock.getElapsedTime();
      lightMainRef.current.position.x = 3 + Math.sin(t * 0.35) * 0.6;
      lightMainRef.current.position.y = 3 + Math.cos(t * 0.3) * 0.4;
    }
    if (lightRimRef?.current) {
      const t = clock.getElapsedTime();
      lightRimRef.current.position.x = -3 + Math.cos(t * 0.25) * 0.5;
      lightRimRef.current.position.y = -2 + Math.sin(t * 0.28) * 0.35;
    }

    if (enableParallax && group) {
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.x * 0.15, 0.08);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointer.y * 0.12, 0.08);
    }

    if (progress >= 1 && !doneRef.current) {
      doneRef.current = true;
      onFormationComplete?.();
    }
  });

  const handlePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      if (reducedMotion) return;
      const mesh = meshRef.current;
      if (!mesh) return;
      const tempPoint = tempPointRef.current;
      tempPoint.copy(event.point);
      mesh.worldToLocal(tempPoint);
      if (tempPoint.lengthSq() === 0) return;
      tempPoint.normalize();
      const idx = rippleIndexRef.current;
      rippleOriginsRef.current[idx].copy(tempPoint);
      rippleTimesRef.current[idx] = timeRef.current;
      rippleIndexRef.current = (idx + 1) % MAX_RIPPLES;
    },
    [reducedMotion],
  );

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} onPointerDown={handlePointerDown}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial
          ref={materialRef}
          roughness={0.55}
          metalness={0.1}
          emissive={new THREE.Color("#FF5A20")}
          emissiveIntensity={0.12}
        />
      </mesh>
    </group>
  );
}

export default function BrandSphereCanvas({
  reducedMotion,
  enableParallax,
  onFormationComplete,
  shouldAnimate = true,
}: BrandSphereCanvasProps) {
  const lightMainRef = useRef<THREE.DirectionalLight>(null);
  const lightRimRef = useRef<THREE.DirectionalLight>(null);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="pointer-events-auto"
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <ambientLight intensity={0.6} />
      <directionalLight ref={lightMainRef} position={[3, 3, 4]} intensity={0.65} />
      <directionalLight ref={lightRimRef} position={[-3, -2, -4]} intensity={0.35} />
      <SphereCore
        reducedMotion={reducedMotion}
        enableParallax={enableParallax}
        onFormationComplete={onFormationComplete}
        shouldAnimate={shouldAnimate}
        lightMainRef={lightMainRef}
        lightRimRef={lightRimRef}
      />
    </Canvas>
  );
}
