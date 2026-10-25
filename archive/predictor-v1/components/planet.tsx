"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Html } from "@react-three/drei"
import type { Mesh } from "three"
import type { PlanetData } from "@/app/existing/page"

type PlanetProps = {
  data: PlanetData
  onClick: () => void
  isSelected: boolean
}

export function Planet({ data, onClick, isSelected }: PlanetProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005

      // Gentle floating animation
      meshRef.current.position.y = data.position[1] + Math.sin(state.clock.elapsedTime + data.position[0]) * 0.1
    }
  })

  return (
    <group position={data.position}>
      <Sphere
        ref={meshRef}
        args={[data.size, 32, 32]}
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
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
          roughness={0.7}
          metalness={0.3}
        />
      </Sphere>

      {/* Planet glow */}
      <Sphere args={[data.size * 1.2, 32, 32]}>
        <meshBasicMaterial color={data.color} transparent opacity={hovered || isSelected ? 0.3 : 0.1} />
      </Sphere>

      {/* Planet label */}
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
