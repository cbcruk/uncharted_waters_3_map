import { useState } from 'react'
import { DiscoveryMap } from './components/DiscoveryMap'
import { FilterPanel } from './components/FilterPanel'
import { MapTitle } from './components/MapTitle'
import { regions } from './data/discoveries'
import { cityRegions } from './data/cities'
import type { RegionVisibility } from './types'
import 'leaflet/dist/leaflet.css'
import './App.css'

function App() {
  const [visibility, setVisibility] = useState<RegionVisibility>(() => {
    const initial: RegionVisibility = {}
    regions.forEach((region) => {
      initial[region] = true
    })
    return initial
  })

  const [cityVisibility, setCityVisibility] = useState<RegionVisibility>(() => {
    const initial: RegionVisibility = {}
    cityRegions.forEach((region) => {
      initial[region] = true
    })
    return initial
  })

  const [showLabels, setShowLabels] = useState(false)
  const [showCities, setShowCities] = useState(false)

  const handleToggle = (region: string) => {
    setVisibility((prev) => ({
      ...prev,
      [region]: !prev[region],
    }))
  }

  const handleCityToggle = (region: string) => {
    setCityVisibility((prev) => ({
      ...prev,
      [region]: !prev[region],
    }))
  }

  return (
    <>
      <DiscoveryMap
        visibility={visibility}
        cityVisibility={cityVisibility}
        showLabels={showLabels}
        showCities={showCities}
      />
      <MapTitle />
      <FilterPanel
        visibility={visibility}
        onToggle={handleToggle}
        cityVisibility={cityVisibility}
        onCityToggle={handleCityToggle}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((prev) => !prev)}
        showCities={showCities}
        onToggleCities={() => setShowCities((prev) => !prev)}
      />
    </>
  )
}

export default App
