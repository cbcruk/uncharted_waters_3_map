import { useState } from 'react'
import { DiscoveryMap } from './components/discovery-map/discovery-map'
import { FilterPanel } from './components/FilterPanel'
import { MapTitle } from './components/MapTitle'
import { regions } from './data/discoveries'
import { cityRegions } from './data/cities'
import type { RegionVisibility } from './types'
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

  const [showCities, setShowCities] = useState(true)

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
        showCities={showCities}
      />
      <MapTitle />
      <FilterPanel
        visibility={visibility}
        onToggle={handleToggle}
        cityVisibility={cityVisibility}
        onCityToggle={handleCityToggle}
        showCities={showCities}
        onToggleCities={() => setShowCities((prev) => !prev)}
      />
    </>
  )
}

export default App
