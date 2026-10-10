"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Sparkles } from "@react-three/drei";
import { Group, MathUtils, Mesh, MeshStandardMaterial } from "three";

type Emotion = "idle" | "happy" | "surprised" | "sad" | "thinking" | "excited";

interface EmotionConfig {
  leftEye: [number, number, number, number, number];
  rightEye: [number, number, number, number, number];
  mouth: [number, number, number, number, number, number];
  head: [number, number, number, number, number, number];
}

// Grouped configuration data to keep logic clean and visual states easily modifiable
const EMOTIONS: Record<Emotion, EmotionConfig> = {
  idle: {
    leftEye: [-0.5, 0.24, 0.34, 0.16, 0],
    rightEye: [0.5, 0.24, 0.34, 0.16, 0],
    mouth: [0.48, 0.08, -0.38, -0.34, 0.2, 0.08],
    head: [-0.04, 0, -0.03, 0.08, 1.8, 0],
  },
  happy: {
    leftEye: [-0.48, 0.27, 0.36, 0.1, -0.2],
    rightEye: [0.48, 0.27, 0.36, 0.1, 0.2],
    mouth: [0.56, 0.09, -0.42, -0.3, 0.78, 0.12],
    head: [-0.02, 0, 0.02, 0.16, 2.2, 0],
  },
  sad: {
    leftEye: [-0.5, 0.16, 0.32, 0.1, 0.24],
    rightEye: [0.5, 0.16, 0.32, 0.1, -0.24],
    mouth: [0.42, 0.08, -0.28, -0.44, -0.58, 0.1],
    head: [0.08, 0, -0.08, 0.03, 1.4, 0],
  },
  surprised: {
    leftEye: [-0.48, 0.24, 0.22, 0.34, 0],
    rightEye: [0.48, 0.24, 0.22, 0.34, 0],
    mouth: [0.18, 0.22, -0.42, -0.42, 0, 0.02],
    head: [-0.12, 0, 0.08, 0.2, 2.6, 0],
  },
  thinking: {
    leftEye: [-0.5, 0.22, 0.34, 0.08, 0.16],
    rightEye: [0.48, 0.28, 0.3, 0.16, -0.08],
    mouth: [0.34, 0.08, -0.38, -0.38, 0.1, 0.05],
    head: [-0.02, 0, -0.1, 0.09, 1.9, 0],
  },
  excited: {
    leftEye: [-0.46, 0.28, 0.28, 0.18, 0.08],
    rightEye: [0.46, 0.28, 0.28, 0.18, -0.08],
    mouth: [0.5, 0.14, -0.42, -0.28, 0.88, 0.12],
    head: [-0.04, 0, 0.03, 0.18, 2.8, 0.018],
  },
};
const EMOTION_SEQUENCE: Emotion[] = [
  "happy",
  "thinking",
  "surprised",
  "sad",
  "excited",
];

function RobotActor({
  emotion,
  pointer,
  hovered,
}: {
  emotion: Emotion;
  pointer: { x: number; y: number };
  hovered: boolean;
}) {
  const root = useRef<Group>(null);
  const headGroup = useRef<Group>(null);
  const leftEye = useRef<Mesh>(null);
  const rightEye = useRef<Mesh>(null);
  const mCenter = useRef<Mesh>(null);
  const mLeft = useRef<Mesh>(null);
  const mRight = useRef<Mesh>(null);

  const faceMat = useRef<MeshStandardMaterial>(null);
  const featMat = useRef<MeshStandardMaterial>(null);
  const accentMat = useRef<MeshStandardMaterial>(null);

  // A unified target state that matches the structure of EMOTIONS mapping
  const current = useRef(JSON.parse(JSON.stringify(EMOTIONS.idle)));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const baseTarget = EMOTIONS[emotion];

    // Calculate dynamic head shifts based on hover interactions
    const target = {
      ...baseTarget,
      head: [
        baseTarget.head[0] + (hovered ? pointer.y * 0.18 : 0),
        baseTarget.head[1] + (hovered ? pointer.x * 0.28 : 0),
        ...baseTarget.head.slice(2),
      ],
    };

    const speed =
      emotion === "excited" ? 8.5 : emotion === "surprised" ? 7.2 : 5.2;

    // Loop directly over keys to dramatically reduce boilerplate math dampening code
    (Object.keys(current.current) as (keyof EmotionConfig)[]).forEach((key) => {
      const currentValues = current.current[key] as number[];
      const targetValues = target[key] as number[];
      currentValues.forEach((val, i) => {
        currentValues[i] = MathUtils.damp(val, targetValues[i], speed, delta);
      });
    });

    const [lEye, rEye, mouth, head] = [
      current.current.leftEye,
      current.current.rightEye,
      current.current.mouth,
      current.current.head,
    ];

    // Compute interactive procedural blinking
    const blinkScale = Math.max(
      0.05,
      Math.min(
        Math.sin(t * 2.5) > 0.98 ? 0.05 : 1,
        emotion === "excited" ? 0.65 + Math.sin(t * 18) * 0.25 : 1,
      ),
    );

    // Root node animations (Breathing and jittering physics)
    if (root.current) {
      root.current.scale.setScalar(0.8 + Math.sin(t * 1.5) * 0.01);
      root.current.position.y =
        Math.sin(t * 1.2) * head[3] + Math.sin(t * 0.5) * 0.015;
      root.current.rotation.set(
        head[0] + Math.sin(t * 0.8) * 0.02 - pointer.y * 0.08,
        head[1] + Math.sin(t * 0.64) * 0.04 + pointer.x * 0.14,
        head[2] +
        Math.sin(t * 0.9) * 0.015 +
        (head[5] > 0 ? Math.sin(t * 45) * head[5] : 0),
      );
    }

    // Extra procedural animations: floating, hover energy, ear pulse and subtle head sway
    if (headGroup.current) {
      const hoverBoost = hovered ? 1 : 0;
      headGroup.current.position.y =
        Math.sin(t * 1.65) * 0.035 +
        Math.sin(t * 0.72) * 0.018 +
        hoverBoost * Math.sin(t * 4.5) * 0.012;

      headGroup.current.rotation.z =
        Math.sin(t * 0.72) * 0.012 +
        pointer.x * 0.035;

      const pulse = 1 + Math.sin(t * 2.2) * 0.018 + hoverBoost * 0.025;
      headGroup.current.scale.setScalar(pulse);
    }

    // Apply positions directly onto meshes to bypass structural wrappers
    leftEye.current?.position.set(
      lEye[0] + pointer.x * 0.05,
      lEye[1] - pointer.y * 0.04,
      1.14,
    );
    leftEye.current?.scale.set(lEye[2], lEye[3] * blinkScale, 0.08);
    leftEye.current?.rotation.set(0, 0, lEye[4]);

    rightEye.current?.position.set(
      rEye[0] + pointer.x * 0.05,
      rEye[1] - pointer.y * 0.04,
      1.14,
    );
    rightEye.current?.scale.set(rEye[2], rEye[3] * blinkScale, 0.08);
    rightEye.current?.rotation.set(0, 0, rEye[4]);

    mCenter.current?.position.set(0, mouth[2], 1.14);
    mCenter.current?.scale.set(mouth[0], mouth[1], 0.08);

    mLeft.current?.position.set(-0.22, mouth[3], 1.14);
    mLeft.current?.rotation.set(0, 0, mouth[4]);
    mLeft.current?.scale.set(0.16, mouth[5], 0.08);

    mRight.current?.position.set(0.22, mouth[3], 1.14);
    mRight.current?.rotation.set(0, 0, -mouth[4]);
    mRight.current?.scale.set(0.16, mouth[5], 0.08);

    // Subtle feature motion and glow pulses
    if (leftEye.current && rightEye.current) {
      const eyePulse = 1 + Math.sin(t * 3.4) * 0.025;
      leftEye.current.scale.x = lEye[2] * eyePulse;
      rightEye.current.scale.x = rEye[2] * eyePulse;
    }

    // Dynamic emissive mesh adjustments
    if (faceMat.current)
      faceMat.current.emissiveIntensity =
        0.26 + Math.sin(t * 1.7) * 0.03 + head[4] * 0.06;
    if (featMat.current)
      featMat.current.emissiveIntensity = head[4] + Math.sin(t * 2.8) * 0.14;
    if (accentMat.current)
      accentMat.current.emissiveIntensity = 0.35 + Math.sin(t * 1.4) * 0.1;
  });

  // Shared material components to remove multi-index ref mapping arrays
  const featureMaterial = (
    <meshStandardMaterial
      ref={featMat}
      color="#d8f7ff"
      emissive="#38bdf8"
      emissiveIntensity={2.2}
      roughness={0.3}
      metalness={0.12}
    />
  );
  const accentMaterial = (
    <meshStandardMaterial
      ref={accentMat}
      color="#172554"
      emissive="#7c3aed"
      emissiveIntensity={0.4}
      metalness={0.42}
      roughness={0.28}
    />
  );

  return (
    <group ref={root}>
      <group ref={headGroup} position={[0, 0.2, 0]}>
        {/* Head Base */}
        <RoundedBox args={[2.55, 2.55, 2.3]} radius={0.24} smoothness={4}>
          <meshStandardMaterial
            color="#581c87"
            metalness={0.58}
            roughness={0.34}
            envMapIntensity={0.8}
          />
        </RoundedBox>

        {/* Screen/Face */}
        <RoundedBox
          args={[1.88, 1.52, 0.12]}
          radius={0.16}
          smoothness={4}
          position={[0, -0.02, 1.04]}
        >
          <meshStandardMaterial
            ref={faceMat}
            color="#07111f"
            metalness={0.1}
            roughness={0.22}
            emissive="#0ea5e9"
            emissiveIntensity={0.3}
          />
        </RoundedBox>

        {/* Dynamic Features */}
        <RoundedBox
          ref={leftEye}
          args={[1, 1, 0.4]}
          radius={0.28}
          smoothness={4}
        >
          {featureMaterial}
        </RoundedBox>
        <RoundedBox
          ref={rightEye}
          args={[1, 1, 0.4]}
          radius={0.28}
          smoothness={4}
        >
          {featureMaterial}
        </RoundedBox>

        <mesh ref={mCenter} position={[0, 0, 0.02]}>
          <boxGeometry />
          {featureMaterial}
        </mesh>
        <RoundedBox ref={mLeft} args={[1, 1, 0.38]} radius={0.3} smoothness={4}>
          {featureMaterial}
        </RoundedBox>
        <RoundedBox
          ref={mRight}
          args={[1, 1, 0.38]}
          radius={0.3}
          smoothness={4}
        >
          {featureMaterial}
        </RoundedBox>

        {/* Ears */}
        <RoundedBox
          args={[0.42, 0.42, 2.05]}
          radius={0.16}
          smoothness={4}
          position={[-1.38, 0, -0.04]}
          rotation={[0, 0.22, 0]}
        >
          {accentMaterial}
        </RoundedBox>
        <RoundedBox
          args={[0.42, 0.42, 2.05]}
          radius={0.16}
          smoothness={4}
          position={[1.38, 0, -0.04]}
          rotation={[0, -0.22, 0]}
        >
          {accentMaterial}
        </RoundedBox>
      </group>

      {/* Neck & Base Stand */}
      <group position={[0, -1.9, -0.1]}>
        <mesh scale={0.17}>
          <sphereGeometry />
          {accentMaterial}
        </mesh>
        <mesh position={[0, -0.32, 0]} scale={[0.48, 0.12, 0.48]}>
          <cylinderGeometry args={[1, 1, 1, 24]} />
          <meshStandardMaterial
            color="#581c87"
            metalness={0.58}
            roughness={0.34}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function RobotMascotScene() {
  const [emotion, setEmotion] = useState<Emotion>("idle");
  const [hovered, setHovered] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => setShowBubble(false), 4000);
    return () => clearTimeout(hideTimer);
  }, []);

  useEffect(() => {
    let index = 0;
    const queueNext = () => {
      const next = EMOTION_SEQUENCE[index % EMOTION_SEQUENCE.length];
      index++;
      setEmotion(next);
      setTimeout(queueNext, next === "sad" ? 3200 : 2600);
    };
    const baseTimer = setTimeout(queueNext, 900);
    return () => clearTimeout(baseTimer);
  }, []);

  useEffect(() => {
    if (!hovered && emotion !== "idle") {
      const timer = setTimeout(() => setEmotion("idle"), 5200);
      return () => clearTimeout(timer);
    }
  }, [emotion, hovered]);

  return (
    <div
      className="relative h-full min-h-[400px] w-full cursor-pointer"
      onPointerMove={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((e.clientX - b.left) / b.width) * 2 - 1,
          y: ((e.clientY - b.top) / b.height) * 2 - 1,
        });
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPointer({ x: 0, y: 0 });
      }}
      onClick={() =>
        setEmotion(
          (curr) =>
            EMOTION_SEQUENCE[
            (EMOTION_SEQUENCE.indexOf(curr) + 1) % EMOTION_SEQUENCE.length
            ],
        )
      }
    >
      <div
        className={`absolute inset-[12%] rounded-full border border-cyan-400/10 transition-all duration-700 ${hovered ? "scale-110 border-cyan-300/30 shadow-[0_0_80px_rgba(34,211,238,0.16)]" : "scale-100"
          }`}
      />

      <Canvas
        camera={{ position: [0, 0.2, 6.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.85} color="#9bb9ff" />
        <directionalLight position={[4, 5, 5]} intensity={2.4} />
        <directionalLight
          position={[-4, 1.8, 3]}
          intensity={1.25}
          color="#5eead4"
        />
        <pointLight position={[-4, 0, -3]} intensity={13} color="#8b5cf6" />
        <pointLight position={[4, -1, -4]} intensity={10} color="#22d3ee" />

        <RobotActor emotion={emotion} hovered={hovered} pointer={pointer} />

        <Sparkles
          count={34}
          scale={[6, 5, 6]}
          size={1.5}
          speed={0.5}
          noise={1.2}
          color="#67e8f9"
        />
        <Sparkles
          count={18}
          scale={[3.8, 3.4, 3.8]}
          size={2.2}
          speed={0.8}
          noise={0.8}
          color="#c084fc"
        />
      </Canvas>

      {showBubble && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none animate-[bounce_2s_ease-in-out_infinite]">
          <div className="rounded-xl border border-purple-500 bg-slate-950/90 px-4 py-1.5 shadow-lg shadow-purple-500/30 transition-transform duration-300 hover:scale-105">
            <span className="text-xs font-bold text-cyan-400 tracking-wide uppercase">
              Welcome!
            </span>
          </div>
          <div className="h-0 w-0 border-x-4 border-t-6 border-x-transparent border-t-purple-500" />
        </div>
      )}
    </div>
  );
}
