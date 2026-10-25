"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Sphere } from "@react-three/drei"
import type { Mesh } from "three"
import { DoubleSide } from "three"
import type { PlanetData } from "@/types/planet"

type PlanetProps = {
  data: PlanetData
  onClick: () => void
  isSelected: boolean
}

export function Planet({ data, onClick, isSelected }: PlanetProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const hot = data.features.equilibrium_temperature >= 450

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008
      meshRef.current.rotation.x = 0.12
      meshRef.current.position.y =
        data.position[1] + Math.sin(state.clock.elapsedTime + data.position[0]) * 0.1
    }
  })

  const emissiveIntensity = hovered || isSelected ? 0.35 : hot ? 0.25 : 0.08

  return (
    <group position={data.position}>
      <Sphere
        ref={meshRef}
        args={[data.size, 48, 48]}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = "auto"
        }}
      >
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.65}
          metalness={0.15}
        />
      </Sphere>

      <Sphere args={[data.size * 1.08, 48, 48]}>
        <meshBasicMaterial color={data.color} transparent opacity={0.12} />
      </Sphere>

      {data.features.ring_system && (
        <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
          <ringGeometry args={[data.size * 1.45, data.size * 2.05, 48]} />
          <meshBasicMaterial color="#b8c9e0" transparent opacity={0.55} side={DoubleSide} />
        </mesh>
      )}

      {(hovered || isSelected) && (
        <Html distanceFactor={10} position={[0, data.size + 0.5, 0]}>
          <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full border border-border text-foreground text-sm whitespace-nowrap">
            {data.name}
          </div>
        </Html>
      )}
    </group>
  )
}
