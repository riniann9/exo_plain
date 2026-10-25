"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { Planet } from "./planet"
import type { PlanetData } from "@/app/existing/page"

const PLANETS: PlanetData[] = [
  {
    id: "kepler-442b",
    name: "Kepler-442b",
    position: [5, 2, -3],
    color: "#4a9eff",
    size: 0.8,
    features: {
      orbital_period: 112.3,
      planet_radius: 1.34,
      planet_mass: 2.36,
      semi_major_axis: 0.409,
      eccentricity: 0.04,
      inclination: 89.7,
      stellar_mass: 0.61,
      stellar_radius: 0.6,
      stellar_temperature: 4402,
      stellar_luminosity: 0.17,
      distance_from_earth: 1206,
      discovery_year: 2015,
      detection_method: "Transit",
      equilibrium_temperature: 233,
      insolation_flux: 0.7,
      density: 6.2,
      surface_gravity: 13.2,
      escape_velocity: 16.8,
      albedo: 0.3,
      atmospheric_composition: "Unknown",
      magnetic_field_strength: 0.8,
      rotation_period: 112.3,
      axial_tilt: 23.5,
      number_of_moons: 0,
      ring_system: false,
      habitability_score: 0.83,
    },
  },
  {
    id: "proxima-b",
    name: "Proxima Centauri b",
    position: [-4, -1, 2],
    color: "#ff6b4a",
    size: 0.7,
    features: {
      orbital_period: 11.2,
      planet_radius: 1.07,
      planet_mass: 1.27,
      semi_major_axis: 0.0485,
      eccentricity: 0.02,
      inclination: 90,
      stellar_mass: 0.12,
      stellar_radius: 0.14,
      stellar_temperature: 3042,
      stellar_luminosity: 0.0017,
      distance_from_earth: 4.24,
      discovery_year: 2016,
      detection_method: "Radial Velocity",
      equilibrium_temperature: 234,
      insolation_flux: 0.65,
      density: 5.9,
      surface_gravity: 11.1,
      escape_velocity: 14.2,
      albedo: 0.25,
      atmospheric_composition: "Possible thin atmosphere",
      magnetic_field_strength: 0.5,
      rotation_period: 11.2,
      axial_tilt: 0,
      number_of_moons: 0,
      ring_system: false,
      habitability_score: 0.87,
    },
  },
  {
    id: "trappist-1e",
    name: "TRAPPIST-1e",
    position: [2, -3, -5],
    color: "#7fff4a",
    size: 0.65,
    features: {
      orbital_period: 6.1,
      planet_radius: 0.92,
      planet_mass: 0.62,
      semi_major_axis: 0.028,
      eccentricity: 0.005,
      inclination: 89.86,
      stellar_mass: 0.089,
      stellar_radius: 0.117,
      stellar_temperature: 2559,
      stellar_luminosity: 0.000553,
      distance_from_earth: 39.5,
      discovery_year: 2017,
      detection_method: "Transit",
      equilibrium_temperature: 251,
      insolation_flux: 0.66,
      density: 5.4,
      surface_gravity: 9.8,
      escape_velocity: 12.5,
      albedo: 0.3,
      atmospheric_composition: "Possible water vapor",
      magnetic_field_strength: 0.6,
      rotation_period: 6.1,
      axial_tilt: 0,
      number_of_moons: 0,
      ring_system: false,
      habitability_score: 0.85,
    },
  },
  {
    id: "k2-18b",
    name: "K2-18b",
    position: [-6, 1, -1],
    color: "#4affff",
    size: 0.9,
    features: {
      orbital_period: 33,
      planet_radius: 2.61,
      planet_mass: 8.63,
      semi_major_axis: 0.143,
      eccentricity: 0,
      inclination: 89.56,
      stellar_mass: 0.52,
      stellar_radius: 0.52,
      stellar_temperature: 3457,
      stellar_luminosity: 0.033,
      distance_from_earth: 124,
      discovery_year: 2015,
      detection_method: "Transit",
      equilibrium_temperature: 265,
      insolation_flux: 1.33,
      density: 3.3,
      surface_gravity: 12.6,
      escape_velocity: 22.4,
      albedo: 0.35,
      atmospheric_composition: "Water vapor detected",
      magnetic_field_strength: 1.2,
      rotation_period: 33,
      axial_tilt: 15,
      number_of_moons: 0,
      ring_system: false,
      habitability_score: 0.73,
    },
  },
  {
    id: "gliese-667cc",
    name: "Gliese 667 Cc",
    position: [3, 4, 2],
    color: "#ff4aff",
    size: 0.75,
    features: {
      orbital_period: 28.1,
      planet_radius: 1.54,
      planet_mass: 3.82,
      semi_major_axis: 0.125,
      eccentricity: 0.02,
      inclination: 30,
      stellar_mass: 0.33,
      stellar_radius: 0.42,
      stellar_temperature: 3350,
      stellar_luminosity: 0.014,
      distance_from_earth: 23.62,
      discovery_year: 2011,
      detection_method: "Radial Velocity",
      equilibrium_temperature: 277,
      insolation_flux: 0.88,
      density: 5.8,
      surface_gravity: 15.8,
      escape_velocity: 19.2,
      albedo: 0.28,
      atmospheric_composition: "Unknown",
      magnetic_field_strength: 0.9,
      rotation_period: 28.1,
      axial_tilt: 20,
      number_of_moons: 0,
      ring_system: false,
      habitability_score: 0.77,
    },
  },
  {
    id: "hd-40307g",
    name: "HD 40307 g",
    position: [-2, -4, 4],
    color: "#ffff4a",
    size: 0.85,
    features: {
      orbital_period: 197.8,
      planet_radius: 2.4,
      planet_mass: 7.1,
      semi_major_axis: 0.6,
      eccentricity: 0.29,
      inclination: 45,
      stellar_mass: 0.75,
      stellar_radius: 0.72,
      stellar_temperature: 4956,
      stellar_luminosity: 0.23,
      distance_from_earth: 42,
      discovery_year: 2012,
      detection_method: "Radial Velocity",
      equilibrium_temperature: 198,
      insolation_flux: 0.62,
      density: 4.1,
      surface_gravity: 12.3,
      escape_velocity: 20.1,
      albedo: 0.32,
      atmospheric_composition: "Possible thick atmosphere",
      magnetic_field_strength: 1.1,
      rotation_period: 197.8,
      axial_tilt: 28,
      number_of_moons: 1,
      ring_system: false,
      habitability_score: 0.74,
    },
  },
]

type GalaxyMapProps = {
  onPlanetSelect: (planet: PlanetData) => void
  selectedPlanet: PlanetData | null
}

export function GalaxyMap({ onPlanetSelect, selectedPlanet }: GalaxyMapProps) {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
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
