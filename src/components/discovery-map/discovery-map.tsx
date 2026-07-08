import { useState } from 'react'
import { Map, MapControls, MapPopup } from '@/components/ui/map'
import { discoveries } from '@/data/discoveries'
import { cities } from '@/data/cities'
import { DiscoveryPopup } from '@/components/DiscoveryPopup'
import { CityPopup } from '@/components/CityPopup'
import { DiscoveryLayers } from './discovery-layers'
import { CityLayer } from './city-layer'
import { MAP_CONFIG } from './discovery-map.constants'
import type { ActivePopup, DiscoveryMapProps } from './discovery-map.types'

export function DiscoveryMap({
  visibility,
  cityVisibility,
  showCities,
}: DiscoveryMapProps) {
  const [popup, setPopup] = useState<ActivePopup | null>(null)

  return (
    <Map
      theme="dark"
      projection={MAP_CONFIG.projection}
      center={MAP_CONFIG.center}
      zoom={MAP_CONFIG.zoom}
      minZoom={MAP_CONFIG.minZoom}
      maxZoom={MAP_CONFIG.maxZoom}
      localIdeographFontFamily="'Noto Serif KR', sans-serif"
      className="h-screen w-full"
    >
      <MapControls position="bottom-left" />
      <DiscoveryLayers
        visibility={visibility}
        onSelect={(idx, lng, lat) =>
          setPopup({ kind: 'discovery', idx, lng, lat })
        }
      />
      {showCities && (
        <CityLayer
          cityVisibility={cityVisibility}
          onSelect={(idx, lng, lat) => setPopup({ kind: 'city', idx, lng, lat })}
        />
      )}
      {popup && (
        <MapPopup
          longitude={popup.lng}
          latitude={popup.lat}
          onClose={() => setPopup(null)}
          closeButton
          className="m-0! max-w-none! border-0! bg-transparent! p-0! shadow-none!"
        >
          {popup.kind === 'discovery' ? (
            <DiscoveryPopup discovery={discoveries[popup.idx]} />
          ) : (
            <CityPopup city={cities[popup.idx]} />
          )}
        </MapPopup>
      )}
    </Map>
  )
}
