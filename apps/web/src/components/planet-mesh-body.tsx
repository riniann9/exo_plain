"use client"

import { Sphere } from "@react-three/drei"
import type { RefObject } from "react"
import type { Mesh } from "three"
import { DoubleSide } from "three"

type PlanetMeshBodyProps = {
  meshRef: RefObject<Mesh | null>
  color: string
  radius: number
  segments?: number
  hasRings?: boolean
  equilibriumTemp?: number
  atmosphereScale?: number
  emissiveBoost?: number
}

export function PlanetMeshBody({
  meshRef,
  color,
  radius,
  segments = 32,
  hasRings = false,
  equilibriumTemp = 280,
  atmosphereScale = 1.15,
  emissiveBoost = 0.3,
}: PlanetMeshBodyProps) {
  const hot = equilibriumTemp >= 450
  const emissiveIntensity = hot ? emissiveBoost + 0.35 : emissiveBoost

  return (
    <>
      <Sphere ref={meshRef} args={[radius, segments, segments]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={hot ? 0.55 : 0.75}
          metalness={hot ? 0.15 : 0.25}
        />
      </Sphere>

      <Sphere args={[radius * atmosphereScale, segments, segments]}>
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </Sphere>

      {hasRings && (
        <mesh rotation={[Math.PI / 2.8, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 2.1, 64]} />
          <meshBasicMaterial color="#c9d6e8" transparent opacity={0.45} side={DoubleSide} />
        </mesh>
      )}
    </>
  )
}
