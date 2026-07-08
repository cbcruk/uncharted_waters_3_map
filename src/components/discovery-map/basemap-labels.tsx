import { useEffect } from 'react'
import { useMap } from '@/components/ui/map'

/**
 * Hides the basemap's English city/town/state place labels so they don't
 * duplicate our Korean city labels. Country and continent labels are kept for
 * orientation. Applied once after the style loads (theme is fixed to dark).
 */
export function BasemapLabels() {
  const { map, isLoaded } = useMap()

  useEffect(() => {
    if (!isLoaded || !map) return

    for (const layer of map.getStyle().layers) {
      if (layer.type !== 'symbol') continue
      const sourceLayer = (layer as { 'source-layer'?: string })['source-layer']
      if (sourceLayer !== 'place') continue
      if (layer.id.includes('country') || layer.id.includes('continent')) {
        continue
      }
      map.setLayoutProperty(layer.id, 'visibility', 'none')
    }
  }, [isLoaded, map])

  return null
}
