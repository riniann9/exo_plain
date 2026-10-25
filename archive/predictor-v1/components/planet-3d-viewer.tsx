"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import { useRef } from "react"
import type { Mesh } from "three"

type RotatingPlanetProps = {
  color: string
  size: number
}

function RotatingPlanet({ color, size }: RotatingPlanetProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <>
      <Sphere ref={meshRef} args={[size * 2, 64, 64]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} roughness={0.8} metalness={0.2} />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[size * 2.15, 64, 64]}>
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </Sphere>
    </>
  )
}

export function Planet3DViewer({ color, size }: RotatingPlanetProps) {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        <RotatingPlanet color={color} size={size} />

        <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  )
}
