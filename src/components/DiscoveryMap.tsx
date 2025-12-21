import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { discoveries, regionColors } from '../data/discoveries'
import { cities, cityRegionColors } from '../data/cities'
import { DiscoveryPopup } from './DiscoveryPopup'
import { CityPopup } from './CityPopup'
import type { RegionVisibility } from '../types'

interface DiscoveryMapProps {
  visibility: RegionVisibility
  cityVisibility: RegionVisibility
  showLabels: boolean
  showCities: boolean
}

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 12px;
      height: 12px;
      background-color: ${color};
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

interface CityMarkerOptions {
  name: string
  color: string
  hasLibrary: boolean
  churchOrGuild: string
}

function createCityIcon({
  name,
  color,
  hasLibrary,
  churchOrGuild,
}: CityMarkerOptions) {
  let facilityIcon = ''
  if (churchOrGuild === '양') {
    facilityIcon = '🕍'
  } else if (churchOrGuild === '교') {
    facilityIcon = '⛪️'
  } else if (churchOrGuild === '조') {
    facilityIcon = '🏢'
  }

  const libraryIcon = hasLibrary ? '📖' : ''
  const icons = [libraryIcon, facilityIcon].filter(Boolean).join('')

  const classes = ['city-name-marker', hasLibrary ? 'has-library' : '']
    .filter(Boolean)
    .join(' ')

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="${classes}" style="background-color: ${color};">
        <span class="city-name"">${name}</span>
        ${icons ? `<span class="city-icons">${icons}</span>` : ''}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 10],
  })
}

export function DiscoveryMap({
  visibility,
  cityVisibility,
  showLabels,
  showCities,
}: DiscoveryMapProps) {
  const visibleDiscoveries = discoveries.filter((d) => visibility[d.region])
  const visibleCities = showCities
    ? cities.filter((c) => cityVisibility[c.region])
    : []

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ width: '100%', height: '100vh' }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com/">Stamen Design</a>'
        maxZoom={16}
      />
      {showLabels && (
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png"
          maxZoom={16}
        />
      )}
      {visibleCities.map((city, index) => (
        <Marker
          key={`city-${city.name}-${index}`}
          position={[city.lat, city.lng]}
          icon={createCityIcon({
            name: city.name,
            color: cityRegionColors[city.region] || '#666',
            hasLibrary: city.hasLibrary,
            churchOrGuild: city.churchOrGuild,
          })}
          zIndexOffset={-1000}
        >
          <Popup>
            <CityPopup city={city} />
          </Popup>
        </Marker>
      ))}
      {visibleDiscoveries.map((discovery, index) => (
        <Marker
          key={`discovery-${discovery.name}-${index}`}
          position={[discovery.lat, discovery.lng]}
          icon={createMarkerIcon(regionColors[discovery.region] || '#999')}
        >
          <Popup>
            <DiscoveryPopup discovery={discovery} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
