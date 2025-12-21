export interface Discovery {
  region: string
  name: string
  hint: string
  city: string
  lat: number
  lng: number
  evidence: string
  condition: string
}

export interface City {
  region: string
  name: string
  lat: number
  lng: number
  specialProduct: string
  marketItems: string
  hasLibrary: boolean
  churchOrGuild: string
}

export interface Book {
  name: string
  language: string
  libraries: string[]
  hintDiscovery: string
  requiredSkill: string
  condition: string
}

export type RegionColors = Record<string, string>

export interface RegionVisibility {
  [region: string]: boolean
}
