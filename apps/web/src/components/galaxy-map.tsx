"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { Planet } from "./planet"
import type { PlanetData } from "@/types/planet"

import { PLANETS } from "@/data/planets"

type GalaxyMapProps = {
  onPlanetSelect: (planet: PlanetData) => void
  selectedPlanet: PlanetData | null
}

export function GalaxyMap({ onPlanetSelect, selectedPlanet }: GalaxyMapProps) {
  return (
    <Canvas camera={{ position: [0, 2, 14], fov: 55 }} dpr={[1, 2]}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[8, 6, 10]} intensity={1.4} />
      <directionalLight position={[-6, -4, -8]} intensity={0.35} color="#8899ff" />
      <pointLight position={[0, 0, 12]} intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          data={planet}
          onClick={() => onPlanetSelect(planet)}
          isSelected={selectedPlanet?.id === planet.id}
        />
      ))}

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
        zoomSpeed={0.8}
      />
    </Canvas>
  )
}
