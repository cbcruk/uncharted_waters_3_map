import { useState } from 'react'
import { regions, regionColors, discoveries } from '../data/discoveries'
import { cities, cityRegions, cityRegionColors } from '../data/cities'
import type { RegionVisibility } from '../types'

interface FilterPanelProps {
  visibility: RegionVisibility
  onToggle: (region: string) => void
  cityVisibility: RegionVisibility
  onCityToggle: (region: string) => void
  showLabels: boolean
  onToggleLabels: () => void
  showCities: boolean
  onToggleCities: () => void
}

export function FilterPanel({
  visibility,
  onToggle,
  cityVisibility,
  onCityToggle,
  showLabels,
  onToggleLabels,
  showCities,
  onToggleCities,
}: FilterPanelProps) {
  const [activeTab, setActiveTab] = useState<'discovery' | 'city'>('discovery')

  const getRegionCount = (region: string) => {
    return discoveries.filter((d) => d.region === region).length
  }

  const getCityRegionCount = (region: string) => {
    return cities.filter((c) => c.region === region).length
  }

  const visibleDiscoveryCount = discoveries.filter(
    (d) => visibility[d.region]
  ).length
  const totalDiscoveryCount = discoveries.length

  const visibleCityCount = showCities
    ? cities.filter((c) => cityVisibility[c.region]).length
    : 0
  const totalCityCount = cities.length

  return (
    <div className="absolute top-2.5 right-2.5 z-[1000] bg-parchment/95 border-2 border-brown-light rounded-lg p-4 max-w-[280px] shadow-lg">
      <div className="flex mb-3 border-b-2 border-gold">
        <button
          className={`flex-1 py-2 px-3 bg-transparent border-none font-inherit text-sm cursor-pointer transition-all duration-200 ${
            activeTab === 'discovery'
              ? 'text-brown-dark font-bold border-b-3 border-gold -mb-0.5'
              : 'text-brown-light hover:text-brown-dark'
          }`}
          onClick={() => setActiveTab('discovery')}
        >
          발견물
        </button>
        <button
          className={`flex-1 py-2 px-3 bg-transparent border-none font-inherit text-sm cursor-pointer transition-all duration-200 ${
            activeTab === 'city'
              ? 'text-brown-dark font-bold border-b-3 border-gold -mb-0.5'
              : 'text-brown-light hover:text-brown-dark'
          }`}
          onClick={() => setActiveTab('city')}
        >
          도시
        </button>
      </div>

      {activeTab === 'discovery' ? (
        <>
          <div>
            {regions.map((region) => (
              <label key={region} className="flex items-center my-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={visibility[region]}
                  onChange={() => onToggle(region)}
                />
                <div
                  className="w-3.5 h-3.5 rounded-full mr-2 border border-gray-500"
                  style={{ backgroundColor: regionColors[region] }}
                />
                <span className="text-brown-dark text-[13px]">
                  {region} ({getRegionCount(region)})
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 pt-2.5 border-t border-gold text-xs text-brown-medium">
            표시 중: <strong>{visibleDiscoveryCount}</strong> / {totalDiscoveryCount} 발견물
          </div>
        </>
      ) : (
        <>
          <div className="mb-2.5 pb-2.5 border-b border-dashed border-gold">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="mr-2"
                checked={showCities}
                onChange={onToggleCities}
              />
              <span className="text-brown-dark text-[13px] font-bold">도시 마커 표시</span>
            </label>
          </div>
          <div>
            {cityRegions.map((region) => (
              <label key={region} className="flex items-center my-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={cityVisibility[region]}
                  onChange={() => onCityToggle(region)}
                  disabled={!showCities}
                />
                <div
                  className="w-3.5 h-3.5 rounded-sm mr-2 border border-gray-500"
                  style={{ backgroundColor: cityRegionColors[region] }}
                />
                <span className={`text-[13px] ${showCities ? 'text-brown-dark' : 'text-brown-dark/50'}`}>
                  {region} ({getCityRegionCount(region)})
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 pt-2.5 border-t border-gold text-xs text-brown-medium">
            표시 중: <strong>{visibleCityCount}</strong> / {totalCityCount} 도시
          </div>
        </>
      )}

      <div className="mt-2.5 pt-2.5 border-t border-gold">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            checked={showLabels}
            onChange={onToggleLabels}
          />
          <span className="text-brown-dark text-[13px]">지명 표시</span>
        </label>
      </div>
    </div>
  )
}
