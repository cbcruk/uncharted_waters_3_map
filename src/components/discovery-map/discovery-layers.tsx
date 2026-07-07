import { useMemo } from 'react'
import { MapClusterLayer } from '@/components/ui/map'
import { regionColors } from '@/data/discoveries'
import type { RegionVisibility } from '@/types'
import { buildDiscoveryCollectionsByRegion } from './discovery-map.utils'

interface DiscoveryLayersProps {
  visibility: RegionVisibility
  onSelect: (idx: number, lng: number, lat: number) => void
}

const FALLBACK_COLOR = '#999'

export function DiscoveryLayers({ visibility, onSelect }: DiscoveryLayersProps) {
  const layers = useMemo(() => {
    const byRegion = buildDiscoveryCollectionsByRegion()
    return Object.entries(byRegion).map(([region, data]) => {
      const color = regionColors[region] || FALLBACK_COLOR
      return {
        region,
        data,
        color,
        clusterColors: [color, color, color] as [string, string, string],
      }
    })
  }, [])

  return (
    <>
      {layers.map(({ region, data, color, clusterColors }) =>
        visibility[region] ? (
          <MapClusterLayer
            key={region}
            data={data}
            pointColor={color}
            clusterColors={clusterColors}
            clusterRadius={60}
            onPointClick={(feature, coordinates) =>
              onSelect(feature.properties.idx, coordinates[0], coordinates[1])
            }
          />
        ) : null,
      )}
    </>
  )
}
