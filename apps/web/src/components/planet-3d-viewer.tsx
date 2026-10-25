"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useRef } from "react"
import type { Mesh } from "three"
import { PlanetMeshBody } from "./planet-mesh-body"

type Planet3DViewerProps = {
  color: string
  size: number
  hasRings?: boolean
  equilibriumTemp?: number
}

function RotatingPlanet({ color, size, hasRings, equilibriumTemp }: Planet3DViewerProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <PlanetMeshBody
      meshRef={meshRef}
      color={color}
      radius={size * 2}
      segments={64}
      hasRings={hasRings}
      equilibriumTemp={equilibriumTemp}
      atmosphereScale={1.08}
      emissiveBoost={0.35}
    />
  )
}

export function Planet3DViewer({ color, size, hasRings, equilibriumTemp }: Planet3DViewerProps) {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.45} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.25} />

        <RotatingPlanet color={color} size={size} hasRings={hasRings} equilibriumTemp={equilibriumTemp} />

        <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  )
}
