import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { discoveries, regionColors } from '../data/discoveries'
import { cities, cityRegionColors } from '../data/cities'
import { DiscoveryPopup } from './DiscoveryPopup'
import { CityPopup } from './CityPopup'
import {
  MAP_CONFIG,
  TILE_URLS,
  TILE_ATTRIBUTION,
} from './DiscoveryMap.constants'
import type { DiscoveryMapProps } from './DiscoveryMap.types'
import { createCityIcon } from './DiscoveryMapCityIcon'
import { createDiscoveryIcon } from './DiscoveryMapDiscoveryIcon'

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
      center={MAP_CONFIG.center}
      zoom={MAP_CONFIG.zoom}
      minZoom={MAP_CONFIG.minZoom}
      maxBounds={MAP_CONFIG.bounds}
      maxBoundsViscosity={MAP_CONFIG.boundsViscosity}
      style={{ width: '100%', height: '100vh' }}
    >
      <TileLayer
        url={TILE_URLS.base}
        attribution={TILE_ATTRIBUTION}
        maxZoom={MAP_CONFIG.maxZoom}
      />
      {showLabels && (
        <TileLayer url={TILE_URLS.labels} maxZoom={MAP_CONFIG.maxZoom} />
      )}
      {visibleCities.map((city, index) => (
        <Marker
          key={`city-${city.name}-${index}`}
          position={[city.lat, city.lng]}
          icon={createCityIcon({
            name: city.name,
            color: cityRegionColors[city.region],
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
          icon={createDiscoveryIcon(regionColors[discovery.region])}
        >
          <Popup>
            <DiscoveryPopup discovery={discovery} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
