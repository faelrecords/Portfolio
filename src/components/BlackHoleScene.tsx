import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type RenderQuality = "auto" | "high" | "low";

interface BlackHoleSceneProps {
  quality: RenderQuality;
  reducedMotion: boolean;
  webglAvailable: boolean;
}

const diskVertexShader = `
  varying vec3 vLocal;
  uniform float uTime;

  void main() {
    vLocal = position;
    vec3 warped = position;
    float radius = length(position.xy);
    float angle = atan(position.y, position.x);
    warped.z += sin(angle * 9.0 + radius * 4.0 - uTime * 0.8) * 0.025;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(warped, 1.0);
  }
`;

const diskFragmentShader = `
  varying vec3 vLocal;
  uniform float uTime;
  uniform vec3 uAccent;
  uniform vec3 uHot;
  uniform vec3 uCool;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    float radius = length(vLocal.xy);
    float normalizedRadius = clamp((radius - 1.3) / 3.5, 0.0, 1.0);
    float angle = atan(vLocal.y, vLocal.x);
    float innerFade = smoothstep(0.0, 0.08, normalizedRadius);
    float outerFade = 1.0 - smoothstep(0.68, 1.0, normalizedRadius);
    float spiral = sin(angle * 28.0 - uTime * 2.4 + radius * 10.0);
    float fineSpiral = sin(angle * 83.0 + uTime * 1.2 - radius * 17.0);
    float grain = hash(floor(vec2(angle * 30.0, radius * 38.0)));
    float energy = 0.48 + 0.26 * spiral + 0.14 * fineSpiral + 0.12 * grain;
    float heat = pow(1.0 - normalizedRadius, 3.2);
    vec3 color = mix(uAccent * 0.42, uAccent * 1.35, energy);
    color = mix(color, uHot, heat * 0.92);
    color = mix(color, uCool, smoothstep(0.74, 1.0, normalizedRadius) * 0.22);
    float alpha = innerFade * outerFade * (0.28 + energy * 0.85);
    gl_FragColor = vec4(color, alpha);
  }
`;

const haloVertexShader = `
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFragmentShader = `
  varying vec3 vNormal;
  uniform vec3 uColor;

  void main() {
    float fresnel = pow(1.0 - abs(vNormal.z), 3.8);
    gl_FragColor = vec4(uColor, fresnel * 0.23);
  }
`;

function BlackHole({ reducedMotion, quality }: { reducedMotion: boolean; quality: Exclude<RenderQuality, "auto"> }) {
  const group = useRef<THREE.Group>(null);
  const diskMaterial = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const diskUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAccent: { value: new THREE.Color("#c15f3c") },
      uHot: { value: new THREE.Color("#fff2df") },
      uCool: { value: new THREE.Color("#78d7e6") },
    }),
    [],
  );
  const haloUniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color("#c15f3c") } }),
    [],
  );

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, []);

  useFrame((state, delta) => {
    const currentGroup = group.current;
    if (!currentGroup) return;

    const pageHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(window.scrollY / pageHeight, 1);
    const isMobile = state.size.width < 768;
    const baseX = isMobile ? 0.15 : 1.25;
    const baseScale = isMobile ? 0.72 : 1;
    const motionFactor = reducedMotion ? 0 : 1;

    currentGroup.position.x = THREE.MathUtils.damp(
      currentGroup.position.x,
      baseX - progress * (isMobile ? 0.2 : 1.6) + pointer.current.x * 0.13 * motionFactor,
      2.6,
      delta,
    );
    currentGroup.position.y = THREE.MathUtils.damp(
      currentGroup.position.y,
      (isMobile ? 0.85 : 0.15) - progress * 0.55 + pointer.current.y * 0.09 * motionFactor,
      2.6,
      delta,
    );
    const targetScale = baseScale + progress * 0.24;
    currentGroup.scale.setScalar(THREE.MathUtils.damp(currentGroup.scale.x, targetScale, 2.4, delta));
    currentGroup.rotation.z += delta * 0.025 * motionFactor;

    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      pointer.current.x * 0.08 * motionFactor,
      3,
      delta,
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      pointer.current.y * 0.05 * motionFactor,
      3,
      delta,
    );

    if (diskMaterial.current) {
      diskMaterial.current.uniforms.uTime.value = reducedMotion
        ? 0.75
        : state.clock.elapsedTime * (quality === "low" ? 0.55 : 0.82);
    }
  });

  return (
    <group ref={group}>
      <group rotation={[1.18, -0.08, 0.16]}>
        <mesh>
          <ringGeometry args={[1.3, 4.8, quality === "low" ? 128 : 256, 10]} />
          <shaderMaterial
            ref={diskMaterial}
            uniforms={diskUniforms}
            vertexShader={diskVertexShader}
            fragmentShader={diskFragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[1.26, 0.028, 18, quality === "low" ? 128 : 256]} />
          <meshBasicMaterial color="#fff5e8" toneMapped={false} />
        </mesh>
        <mesh scale={1.08}>
          <torusGeometry args={[1.29, 0.018, 14, 192]} />
          <meshBasicMaterial
            color="#c15f3c"
            transparent
            opacity={0.62}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>

      <mesh scale={1.23}>
        <sphereGeometry args={[1, quality === "low" ? 48 : 96, quality === "low" ? 48 : 96]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <mesh scale={1.48}>
        <sphereGeometry args={[1, quality === "low" ? 48 : 96, quality === "low" ? 48 : 96]} />
        <shaderMaterial
          uniforms={haloUniforms}
          vertexShader={haloVertexShader}
          fragmentShader={haloFragmentShader}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function CosmicScene({ quality, reducedMotion }: { quality: Exclude<RenderQuality, "auto">; reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#050506"]} />
      <Stars
        radius={90}
        depth={55}
        count={quality === "low" ? 1800 : 5200}
        factor={quality === "low" ? 2.2 : 3.2}
        saturation={0.18}
        fade
        speed={reducedMotion ? 0 : 0.18}
      />
      <BlackHole reducedMotion={reducedMotion} quality={quality} />
      {quality === "high" && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.55} luminanceThreshold={0.12} luminanceSmoothing={0.72} mipmapBlur />
          <Vignette eskil={false} offset={0.18} darkness={0.82} />
        </EffectComposer>
      )}
    </>
  );
}

export function BlackHoleScene({ quality, reducedMotion, webglAvailable }: BlackHoleSceneProps) {
  const resolvedQuality: Exclude<RenderQuality, "auto"> =
    quality === "auto"
      ? typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4
        ? "low"
        : "high"
      : quality;

  if (!webglAvailable) {
    return <div className="scene-fallback" role="img" aria-label="Buraco negro no espaço" />;
  }

  return (
    <div className="scene-canvas" data-testid="black-hole-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45, near: 0.1, far: 200 }}
        dpr={resolvedQuality === "low" ? 1 : [1, 1.75]}
        gl={{ antialias: resolvedQuality === "high", alpha: false, powerPreference: "high-performance" }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <CosmicScene quality={resolvedQuality} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
