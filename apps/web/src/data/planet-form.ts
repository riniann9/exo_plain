import type { PlanetFormData } from "@/types/planet-form"

type FormSection = {
  title: string
  icon: string
  fields: Array<{
    key: Exclude<keyof PlanetFormData, "light_curve_file">
    label: string
    type: string
    placeholder: string
  }>
}

export const inputSections = [
    {
      title: "Orbital & Transit Properties",
      icon: "🔄",
      fields: [
        { key: "orbital_period", label: "Orbital Period [days]", type: "number", placeholder: "e.g., 112.3" },
        { key: "transit_epoch", label: "Transit Epoch [BKJD]", type: "number", placeholder: "e.g., 2454833.0" },
        { key: "impact_parameter", label: "Impact Parameter", type: "number", placeholder: "e.g., 0.1" },
        { key: "transit_duration", label: "Transit Duration [hrs]", type: "number", placeholder: "e.g., 2.5" },
        { key: "transit_depth", label: "Transit Depth [ppm]", type: "number", placeholder: "e.g., 150" },
      ],
    },
    {
      title: "Planetary Properties",
      icon: "🌍",
      fields: [
        { key: "planetary_radius", label: "Planetary Radius [Earth radii]", type: "number", placeholder: "e.g., 1.34" },
        { key: "equilibrium_temperature", label: "Equilibrium Temperature [K]", type: "number", placeholder: "e.g., 233" },
        { key: "insolation_flux", label: "Insolation Flux [Earth flux]", type: "text", placeholder: "e.g., 93.59 (+29.45/-16.65)" },
      ],
    },
    {
      title: "Detection & Signal Properties",
      icon: "📡",
      fields: [
        { key: "transit_snr", label: "Transit Signal-to-Noise", type: "number", placeholder: "e.g., 35.80" },
        { key: "tce_planet_number", label: "TCE Planet Number", type: "number", placeholder: "e.g., 1" },
      ],
    },
    {
      title: "Stellar Properties",
      icon: "⭐",
      fields: [
        { key: "stellar_effective_temperature", label: "Stellar Effective Temperature [K]", type: "number", placeholder: "e.g., 4402" },
        { key: "stellar_surface_gravity", label: "Stellar Surface Gravity [log10(cm/s**2)]", type: "number", placeholder: "e.g., 4.5" },
        { key: "stellar_radius", label: "Stellar Radius [Solar radii]", type: "number", placeholder: "e.g., 0.6" },
      ],
    },
    {
      title: "Observational Properties",
      icon: "🔭",
      fields: [
        { key: "ra", label: "RA [decimal degrees]", type: "number", placeholder: "e.g., 285.0" },
        { key: "dec", label: "Dec [decimal degrees]", type: "number", placeholder: "e.g., 45.0" },
        { key: "kepler_band_mag", label: "Kepler-band [mag]", type: "number", placeholder: "e.g., 12.5" },
      ],
    },
  ] satisfies FormSection[]
