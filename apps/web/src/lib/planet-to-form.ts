import type { PlanetData } from "@/types/planet"
import type { PlanetFormData } from "@/types/planet-form"

export function catalogPlanetToFormData(planet: PlanetData): PlanetFormData {
  const f = planet.features
  return {
    orbital_period: String(f.orbital_period),
    transit_epoch: "0",
    impact_parameter: "0",
    transit_duration: "0",
    transit_depth: "0",
    planetary_radius: String(f.planet_radius),
    equilibrium_temperature: String(f.equilibrium_temperature),
    insolation_flux: String(f.insolation_flux),
    transit_snr: "10",
    tce_planet_number: "1",
    stellar_effective_temperature: String(f.stellar_temperature),
    stellar_surface_gravity: "4.5",
    stellar_radius: String(f.stellar_radius),
    ra: "0",
    dec: "0",
    kepler_band_mag: "15",
    ring_system: String(f.ring_system),
  }
}
