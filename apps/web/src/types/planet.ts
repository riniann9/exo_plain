export type PlanetData = {
  id: string
  name: string
  position: [number, number, number]
  color: string
  size: number
  gemini_prompt: string
  features: {
    orbital_period: number
    planet_radius: number
    planet_mass: number
    semi_major_axis: number
    eccentricity: number
    inclination: number
    stellar_mass: number
    stellar_radius: number
    stellar_temperature: number
    stellar_luminosity: number
    distance_from_earth: number
    discovery_year: number
    detection_method: string
    equilibrium_temperature: number
    insolation_flux: number
    density: number
    surface_gravity: number
    escape_velocity: number
    albedo: number
    atmospheric_composition: string
    magnetic_field_strength: number
    rotation_period: number
    axial_tilt: number
    number_of_moons: number
    ring_system: boolean
    habitability_score: number
  }
}
