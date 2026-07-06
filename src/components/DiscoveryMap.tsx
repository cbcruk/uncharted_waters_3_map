import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
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
import { createClusterIcon } from './DiscoveryMapClusterIcon'

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

  // 지역 토글 시 클러스터를 강제로 재계산하기 위한 key
  const discoveryClusterKey = Object.entries(visibility)
    .filter(([, v]) => v)
    .map(([r]) => r)
    .join(',')
  const cityClusterKey = Object.entries(cityVisibility)
    .filter(([, v]) => v)
    .map(([r]) => r)
    .join(',')

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
      {showCities && (
        <MarkerClusterGroup
          key={`cities-${cityClusterKey}`}
          iconCreateFunction={createClusterIcon(cityRegionColors)}
          chunkedLoading
          showCoverageOnHover={false}
          maxClusterRadius={60}
        >
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
              {...({ region: city.region } as object)}
            >
              <Popup>
                <CityPopup city={city} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      )}
      <MarkerClusterGroup
        key={`discoveries-${discoveryClusterKey}`}
        iconCreateFunction={createClusterIcon(regionColors)}
        chunkedLoading
        showCoverageOnHover={false}
        maxClusterRadius={60}
      >
        {visibleDiscoveries.map((discovery, index) => (
          <Marker
            key={`discovery-${discovery.name}-${index}`}
            position={[discovery.lat, discovery.lng]}
            icon={createDiscoveryIcon(regionColors[discovery.region])}
            {...({ region: discovery.region } as object)}
          >
            <Popup>
              <DiscoveryPopup discovery={discovery} />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}
