import type { RegionVisibility } from '@/types'

export interface DiscoveryMapProps {
  visibility: RegionVisibility
  cityVisibility: RegionVisibility
  showCities: boolean
}

export interface ActivePopup {
  kind: 'discovery' | 'city'
  idx: number
  lng: number
  lat: number
}
