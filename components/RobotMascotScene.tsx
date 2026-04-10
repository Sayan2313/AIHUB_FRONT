"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { RoundedBox, Sparkles } from "@react-three/drei"
import { Group, MathUtils, MeshStandardMaterial } from "three"

type Emotion = "idle" | "happy" | "surprised" | "sad" |"thinking" | "excited"

interface EyeTarget {
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotationZ: number
}

interface MouthTarget {
  centerScaleX: number
  centerScaleY: number
  centerY: number
  cornerY: number
  cornerRotation: number
  cornerScaleY: number
}

interface HeadTarget {
  rotateX: number
  rotateY: number
  rotateZ: number
  bounce: number
  glow: number
  jitter: number
}

interface EmotionTarget {
  leftEye: EyeTarget
  rightEye: EyeTarget
  mouth: MouthTarget
  head: HeadTarget
}

const EMOTION_SEQUENCE: Emotion[] = ["happy", "thinking", "surprised", "sad", "excited"]

const EMOTION_TARGETS: Record<Emotion, EmotionTarget> = {
  idle: {
    leftEye: { x: -0.5, y: 0.24, scaleX: 0.34, scaleY: 0.16, rotationZ: 0 },
    rightEye: { x: 0.5, y: 0.24, scaleX: 0.34, scaleY: 0.16, rotationZ: 0 },
    mouth: {
      centerScaleX: 0.48,
      centerScaleY: 0.08,
      centerY: -0.38,
      cornerY: -0.34,
      cornerRotation: 0.2,
      cornerScaleY: 0.08,
    },
    head: { rotateX: -0.04, rotateY: 0, rotateZ: -0.03, bounce: 0.08, glow: 1.8, jitter: 0 },
  },
  happy: {
    leftEye: { x: -0.48, y: 0.27, scaleX: 0.36, scaleY: 0.1, rotationZ: -0.2 },
    rightEye: { x: 0.48, y: 0.27, scaleX: 0.36, scaleY: 0.1, rotationZ: 0.2 },
    mouth: {
      centerScaleX: 0.56,
      centerScaleY: 0.09,
      centerY: -0.42,
      cornerY: -0.3,
      cornerRotation: 0.78,
      cornerScaleY: 0.12,
    },
    head: { rotateX: -0.02, rotateY: 0, rotateZ: 0.02, bounce: 0.16, glow: 2.2, jitter: 0 },
  },
  sad: {
    leftEye: { x: -0.5, y: 0.16, scaleX: 0.32, scaleY: 0.1, rotationZ: 0.24 },
    rightEye: { x: 0.5, y: 0.16, scaleX: 0.32, scaleY: 0.1, rotationZ: -0.24 },
    mouth: {
      centerScaleX: 0.42,
      centerScaleY: 0.08,
      centerY: -0.28,
      cornerY: -0.44,
      cornerRotation: -0.58,
      cornerScaleY: 0.1,
    },
    head: { rotateX: 0.08, rotateY: 0, rotateZ: -0.08, bounce: 0.03, glow: 1.4, jitter: 0 },
  },
  surprised: {
    leftEye: { x: -0.48, y: 0.24, scaleX: 0.22, scaleY: 0.34, rotationZ: 0 },
    rightEye: { x: 0.48, y: 0.24, scaleX: 0.22, scaleY: 0.34, rotationZ: 0 },
    mouth: {
      centerScaleX: 0.18,
      centerScaleY: 0.22,
      centerY: -0.42,
      cornerY: -0.42,
      cornerRotation: 0,
      cornerScaleY: 0.02,
    },
    head: { rotateX: -0.12, rotateY: 0, rotateZ: 0.08, bounce: 0.2, glow: 2.6, jitter: 0 },
  },
  thinking: {
    leftEye: { x: -0.5, y: 0.22, scaleX: 0.34, scaleY: 0.08, rotationZ: 0.16 },
    rightEye: { x: 0.48, y: 0.28, scaleX: 0.3, scaleY: 0.16, rotationZ: -0.08 },
    mouth: {
      centerScaleX: 0.34,
      centerScaleY: 0.08,
      centerY: -0.38,
      cornerY: -0.38,
      cornerRotation: 0.1,
      cornerScaleY: 0.05,
    },
    head: { rotateX: -0.02, rotateY: 0, rotateZ: -0.1, bounce: 0.09, glow: 1.9, jitter: 0 },
  },
  excited: {
    leftEye: { x: -0.46, y: 0.28, scaleX: 0.28, scaleY: 0.18, rotationZ: 0.08 },
    rightEye: { x: 0.46, y: 0.28, scaleX: 0.28, scaleY: 0.18, rotationZ: -0.08 },
    mouth: {
      centerScaleX: 0.5,
      centerScaleY: 0.14,
      centerY: -0.42,
      cornerY: -0.28,
      cornerRotation: 0.88,
      cornerScaleY: 0.12,
    },
    head: { rotateX: -0.04, rotateY: 0, rotateZ: 0.03, bounce: 0.18, glow: 2.8, jitter: 0.018 },
  },
}

function RobotActor({
  emotion,
  pointer,
  hovered,
}: {
  emotion: Emotion
  pointer: { x: number; y: number }
  hovered: boolean
}) {
  const root = useRef<Group>(null)
  const leftEye = useRef<Group>(null)
  const rightEye = useRef<Group>(null)
  const mouthCenter = useRef<Group>(null)
  const mouthLeft = useRef<Group>(null)
  const mouthRight = useRef<Group>(null)
  const faceMaterial = useRef<MeshStandardMaterial | null>(null)
  const featureMaterials = useRef<MeshStandardMaterial[]>([])
  const accentMaterials = useRef<MeshStandardMaterial[]>([])

  const current = useRef(structuredClone(EMOTION_TARGETS.idle))
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const target = hovered
      ? {
        ...EMOTION_TARGETS[emotion],
        head: {
          ...EMOTION_TARGETS[emotion].head,
          rotateY: EMOTION_TARGETS[emotion].head.rotateY + pointer.x * 0.28,
          rotateX: EMOTION_TARGETS[emotion].head.rotateX + pointer.y * 0.18,
        },
      }
      : EMOTION_TARGETS[emotion]

    const speed = emotion === "excited" ? 8.5 : emotion === "surprised" ? 7.2 : 5.2

    current.current.leftEye.x = MathUtils.damp(
      current.current.leftEye.x,
      target.leftEye.x + pointer.x * 0.05,
      speed,
      delta
    )
    current.current.leftEye.y = MathUtils.damp(
      current.current.leftEye.y,
      target.leftEye.y - pointer.y * 0.04,
      speed,
      delta
    )
    current.current.leftEye.scaleX = MathUtils.damp(
      current.current.leftEye.scaleX,
      target.leftEye.scaleX,
      speed,
      delta
    )
    current.current.leftEye.scaleY = MathUtils.damp(
      current.current.leftEye.scaleY,
      target.leftEye.scaleY,
      speed,
      delta
    )
    current.current.leftEye.rotationZ = MathUtils.damp(
      current.current.leftEye.rotationZ,
      target.leftEye.rotationZ,
      speed,
      delta
    )

    current.current.rightEye.x = MathUtils.damp(
      current.current.rightEye.x,
      target.rightEye.x + pointer.x * 0.05,
      speed,
      delta
    )
    current.current.rightEye.y = MathUtils.damp(
      current.current.rightEye.y,
      target.rightEye.y - pointer.y * 0.04,
      speed,
      delta
    )
    current.current.rightEye.scaleX = MathUtils.damp(
      current.current.rightEye.scaleX,
      target.rightEye.scaleX,
      speed,
      delta
    )
    current.current.rightEye.scaleY = MathUtils.damp(
      current.current.rightEye.scaleY,
      target.rightEye.scaleY,
      speed,
      delta
    )
    current.current.rightEye.rotationZ = MathUtils.damp(
      current.current.rightEye.rotationZ,
      target.rightEye.rotationZ,
      speed,
      delta
    )

    current.current.mouth.centerScaleX = MathUtils.damp(
      current.current.mouth.centerScaleX,
      target.mouth.centerScaleX,
      speed,
      delta
    )
    current.current.mouth.centerScaleY = MathUtils.damp(
      current.current.mouth.centerScaleY,
      target.mouth.centerScaleY,
      speed,
      delta
    )
    current.current.mouth.centerY = MathUtils.damp(
      current.current.mouth.centerY,
      target.mouth.centerY,
      speed,
      delta
    )
    current.current.mouth.cornerY = MathUtils.damp(
      current.current.mouth.cornerY,
      target.mouth.cornerY,
      speed,
      delta
    )
    current.current.mouth.cornerRotation = MathUtils.damp(
      current.current.mouth.cornerRotation,
      target.mouth.cornerRotation,
      speed,
      delta
    )
    current.current.mouth.cornerScaleY = MathUtils.damp(
      current.current.mouth.cornerScaleY,
      target.mouth.cornerScaleY,
      speed,
      delta
    )

    current.current.head.rotateX = MathUtils.damp(
      current.current.head.rotateX,
      target.head.rotateX,
      speed,
      delta
    )
    current.current.head.rotateY = MathUtils.damp(
      current.current.head.rotateY,
      target.head.rotateY,
      speed,
      delta
    )
    current.current.head.rotateZ = MathUtils.damp(
      current.current.head.rotateZ,
      target.head.rotateZ,
      speed,
      delta
    )
    current.current.head.bounce = MathUtils.damp(
      current.current.head.bounce,
      target.head.bounce,
      speed,
      delta
    )
    current.current.head.glow = MathUtils.damp(current.current.head.glow, target.head.glow, speed, delta)
    current.current.head.jitter = MathUtils.damp(
      current.current.head.jitter,
      target.head.jitter,
      speed,
      delta
    )

    const blinkBase = Math.sin(t * 0.43 + 1.7) > 0.992 ? 0.12 : 1
    const blinkSecondary = Math.sin(t * 0.31 + 0.3) > 0.998 ? 0.08 : 1
    const randomBlink = Math.min(blinkBase, blinkSecondary)
    const excitedBlink = emotion === "excited" ? 0.65 + Math.sin(t * 18) * 0.25 : 1
    const blinkScale = Math.max(0.06, Math.min(randomBlink, excitedBlink))

    if (root.current) {
      root.current.position.y = Math.sin(t * 1.2) * current.current.head.bounce
      root.current.rotation.x =
        current.current.head.rotateX + Math.sin(t * 0.8) * 0.02 - pointer.y * 0.08
      root.current.rotation.y =
        current.current.head.rotateY + Math.sin(t * 0.64) * 0.04 + pointer.x * 0.14
      root.current.rotation.z =
        current.current.head.rotateZ +
        Math.sin(t * 0.9) * 0.015 +
        (current.current.head.jitter > 0 ? Math.sin(t * 45) * current.current.head.jitter : 0)
    }

    if (leftEye.current) {
      leftEye.current.position.set(current.current.leftEye.x, current.current.leftEye.y, 1.14)
      leftEye.current.rotation.z = current.current.leftEye.rotationZ
      leftEye.current.scale.set(
        current.current.leftEye.scaleX,
        current.current.leftEye.scaleY * blinkScale,
        0.08
      )
    }

    if (rightEye.current) {
      rightEye.current.position.set(current.current.rightEye.x, current.current.rightEye.y, 1.14)
      rightEye.current.rotation.z = current.current.rightEye.rotationZ
      rightEye.current.scale.set(
        current.current.rightEye.scaleX,
        current.current.rightEye.scaleY * blinkScale,
        0.08
      )
    }

    if (mouthCenter.current) {
      mouthCenter.current.position.set(0, current.current.mouth.centerY, 1.14)
      mouthCenter.current.scale.set(
        current.current.mouth.centerScaleX,
        current.current.mouth.centerScaleY,
        0.08
      )
    }

    if (mouthLeft.current) {
      mouthLeft.current.position.set(-0.22, current.current.mouth.cornerY, 1.14)
      mouthLeft.current.rotation.z = current.current.mouth.cornerRotation
      mouthLeft.current.scale.set(0.16, current.current.mouth.cornerScaleY, 0.08)
    }

    if (mouthRight.current) {
      mouthRight.current.position.set(0.22, current.current.mouth.cornerY, 1.14)
      mouthRight.current.rotation.z = -current.current.mouth.cornerRotation
      mouthRight.current.scale.set(0.16, current.current.mouth.cornerScaleY, 0.08)
    }

    if (faceMaterial.current) {
      faceMaterial.current.emissiveIntensity =
        0.26 + Math.sin(t * 1.7) * 0.03 + current.current.head.glow * 0.06
    }

    for (const material of featureMaterials.current) {
      if (material) {
        material.emissiveIntensity = current.current.head.glow + Math.sin(t * 2.8) * 0.14
      }
    }

    for (const material of accentMaterials.current) {
      if (material) {
        material.emissiveIntensity = 0.35 + Math.sin(t * 1.4) * 0.1
      }
    }
  })

  return (
    <group ref={root} scale={[0.8, 0.8, 0.8]}>
      <group position={[0, 0.2, 0]}>
        <RoundedBox args={[2.55, 2.55, 2.3]} radius={0.24} smoothness={5}>
          <meshStandardMaterial color="#581c87" metalness={0.58} roughness={0.34} envMapIntensity={0.8} />
        </RoundedBox>
        <RoundedBox
          args={[1.88, 1.52, 0.12]}
          radius={0.16}
          smoothness={5}
          position={[0, -0.02, 1.04]}
        >
          <meshStandardMaterial
            ref={faceMaterial}
            color="#07111f"
            metalness={0.1}
            roughness={0.22}
            emissive="#0ea5e9"
            emissiveIntensity={0.3}
          />
        </RoundedBox>

        <group ref={leftEye}>
          <RoundedBox args={[1, 1, 0.4]} radius={0.28} smoothness={4}>
            <meshStandardMaterial
              ref={(material) => {
                if (material) {
                  featureMaterials.current[0] = material
                }
              }}
              color="#d8f7ff"
              emissive="#38bdf8"
              emissiveIntensity={2.2}
              roughness={0.3}
              metalness={0.12}
            />
          </RoundedBox>
        </group>
        <group ref={rightEye}>
          <RoundedBox args={[1, 1, 0.4]} radius={0.28} smoothness={4}>
            <meshStandardMaterial
              ref={(material) => {
                if (material) {
                  featureMaterials.current[1] = material
                }
              }}
              color="#d8f7ff"
              emissive="#38bdf8"
              emissiveIntensity={2.2}
              roughness={0.3}
              metalness={0.12}
            />
          </RoundedBox>
        </group>

        <group position={[0, 0, 0.02]}>
          <group
            ref={mouthCenter}
            position={[0, EMOTION_TARGETS.idle.mouth.centerY, 1.14]}
            scale={[
              EMOTION_TARGETS.idle.mouth.centerScaleX,
              EMOTION_TARGETS.idle.mouth.centerScaleY,
              0.08,
            ]}
          >
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                ref={(material) => {
                  if (material) {
                    featureMaterials.current[2] = material
                  }
                }}
                color="#d8f7ff"
                emissive="#38bdf8"
                emissiveIntensity={2.2}
                roughness={0.3}
                metalness={0.12}
              />
            </mesh>
          </group>
          <group ref={mouthLeft}>
            <RoundedBox args={[1, 1, 0.38]} radius={0.3} smoothness={4}>
              <meshStandardMaterial
                ref={(material) => {
                  if (material) {
                    featureMaterials.current[3] = material
                  }
                }}
                color="#d8f7ff"
                emissive="#38bdf8"
                emissiveIntensity={2.2}
                roughness={0.3}
                metalness={0.12}
              />
            </RoundedBox>
          </group>
          <group ref={mouthRight}>
            <RoundedBox args={[1, 1, 0.38]} radius={0.3} smoothness={4}>
              <meshStandardMaterial
                ref={(material) => {
                  if (material) {
                    featureMaterials.current[4] = material
                  }
                }}
                color="#d8f7ff"
                emissive="#38bdf8"
                emissiveIntensity={2.2}
                roughness={0.3}
                metalness={0.12}
              />
            </RoundedBox>
          </group>
        </group>

        <RoundedBox
          args={[0.42, 0.42, 2.05]}
          radius={0.16}
          smoothness={4}
          position={[-1.38, 0, -0.04]}
          rotation={[0, 0.22, 0]}
        >
          <meshStandardMaterial
            ref={(material) => {
              if (material) {
                accentMaterials.current[0] = material
              }
            }}
            color="#172554"
            emissive="#7c3aed"
            emissiveIntensity={0.4}
            metalness={0.42}
            roughness={0.28}
          />
        </RoundedBox>
        <RoundedBox
          args={[0.42, 0.42, 2.05]}
          radius={0.16}
          smoothness={4}
          position={[1.38, 0, -0.04]}
          rotation={[0, -0.22, 0]}
        >
          <meshStandardMaterial
            ref={(material) => {
              if (material) {
                accentMaterials.current[1] = material
              }
            }}
            color="#172554"
            emissive="#7c3aed"
            emissiveIntensity={0.4}
            metalness={0.42}
            roughness={0.28}
          />
        </RoundedBox>
      </group>

      <group position={[0, -1.9, -0.1]}>
        <mesh scale={[0.34, 0.34, 0.34]}>
          <sphereGeometry args={[0.5, 20, 20]} />
          <meshStandardMaterial
            ref={(material) => {
              if (material) {
                accentMaterials.current[2] = material
              }
            }}
            color="#172554"
            emissive="#7c3aed"
            emissiveIntensity={0.4}
            metalness={0.42}
            roughness={0.28}
          />
        </mesh>
        <mesh position={[0, -0.32, 0]} scale={[0.48, 0.12, 0.48]}>
          <cylinderGeometry args={[1, 1, 1, 24]} />
          <meshStandardMaterial color="#581c87" metalness={0.58} roughness={0.34} envMapIntensity={0.8} />
        </mesh>
      </group>
    </group>
  )
}

function Scene({
  emotion,
  hovered,
  pointer,
}: {
  emotion: Emotion
  hovered: boolean
  pointer: { x: number; y: number }
}) {
  return (
    <>
      <ambientLight intensity={0.85} color="#9bb9ff" />
      <directionalLight position={[4, 5, 5]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-4, 1.8, 3]} intensity={1.25} color="#5eead4" />
      <pointLight position={[-4, 0, -3]} intensity={13} distance={14} color="#8b5cf6" />
      <pointLight position={[4, -1, -4]} intensity={10} distance={12} color="#22d3ee" />

      <group position={[0, 0.2, 0]}>
        <RobotActor emotion={emotion} hovered={hovered} pointer={pointer} />
      </group>

      <Sparkles
        count={22}
        scale={[7, 5, 6]}
        size={1.8}
        speed={0.35}
        color="#67e8f9"
        noise={0.9}
        position={[0, 0.2, 0]}
      />
    </>
  )
}

export default function RobotMascotScene() {
  const [emotion, setEmotion] = useState<Emotion>("idle")
  const [hovered, setHovered] = useState(false)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [showBubble, setShowBubble] = useState(true)
  const [bubbleFading, setBubbleFading] = useState(false)

  // Auto-dismiss the welcome bubble after a delay.
  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setBubbleFading(true), 3500)
    const hideTimer = window.setTimeout(() => setShowBubble(false), 4400)
    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    let active = true
    let timer = 0
    let index = 0

    const queueNext = () => {
      const nextEmotion = EMOTION_SEQUENCE[index % EMOTION_SEQUENCE.length]
      index += 1
      setEmotion(nextEmotion)
      timer = window.setTimeout(queueNext, nextEmotion === "sad" ? 3200 : 2600)
    }

    timer = window.setTimeout(() => {
      if (!active) {
        return
      }
      queueNext()
    }, 900)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!hovered && emotion !== "idle") {
      const timer = window.setTimeout(() => setEmotion("idle"), 5200)
      return () => window.clearTimeout(timer)
    }
  }, [emotion, hovered])

  const emotionLabel = emotion.charAt(0).toUpperCase() + emotion.slice(1)

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
    const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1
    setPointer({ x, y })
  }

  const handleClick = () => {
    setEmotion((current) => {
      const currentIndex = EMOTION_SEQUENCE.indexOf(current)
      const next = EMOTION_SEQUENCE[(currentIndex + 1) % EMOTION_SEQUENCE.length]
      return current === "surprised" ? "happy" : next
    })
  }

  return (
    <div
      className="relative h-[560px] w-full"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false)
        setPointer({ x: 0, y: 0 })
      }}
      onClick={handleClick}
    >
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.35, 6.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene emotion={emotion} hovered={hovered} pointer={pointer} />
      </Canvas>

      {/* Comic-book speech bubble */}
      {showBubble && (
        <div
          className={`comic-bubble ${bubbleFading ? "comic-bubble-out" : "comic-bubble-in"}`}
        >
          <span className="comic-bubble-text">Welcome!</span>
          {/* Tail pointing down toward the robot */}
          <div className="comic-bubble-tail" />
        </div>
      )}
    </div>
  )
}
