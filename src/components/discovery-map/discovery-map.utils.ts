import type { FeatureCollection, Point } from 'geojson'
import { discoveries } from '@/data/discoveries'
import { cities, cityRegionColors } from '@/data/cities'

export interface DiscoveryFeatureProps {
  idx: number
}

export interface CityFeatureProps {
  idx: number
  name: string
  labelColor: string
}

const FALLBACK_CITY_COLOR = '#5a4a3a'

/**
 * Lightens a color toward white until it reaches a minimum perceived
 * luminance, so region-colored text stays readable on the dark basemap.
 * Colors already bright enough are returned unchanged.
 */
function brightenForDark(hex: string, targetLum = 178): string {
  const m = hex.replace('#', '')
  const r = parseInt(m.slice(0, 2), 16)
  const g = parseInt(m.slice(2, 4), 16)
  const b = parseInt(m.slice(4, 6), 16)
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  if (lum >= targetLum) return hex
  const t = (targetLum - lum) / (255 - lum)
  const mix = (c: number) => Math.round(c + (255 - c) * t)
  const toHex = (c: number) => mix(c).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function buildDiscoveryCollectionsByRegion(): Record<
  string,
  FeatureCollection<Point, DiscoveryFeatureProps>
> {
  const byRegion: Record<
    string,
    FeatureCollection<Point, DiscoveryFeatureProps>
  > = {}

  discoveries.forEach((discovery, idx) => {
    const collection = (byRegion[discovery.region] ??= {
      type: 'FeatureCollection',
      features: [],
    })
    collection.features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [discovery.lng, discovery.lat] },
      properties: { idx },
    })
  })

  return byRegion
}

export function buildCityCollection(
  isVisible: (region: string) => boolean,
): FeatureCollection<Point, CityFeatureProps> {
  return {
    type: 'FeatureCollection',
    features: cities.flatMap((city, idx) =>
      isVisible(city.region)
        ? [
            {
              type: 'Feature' as const,
              geometry: {
                type: 'Point' as const,
                coordinates: [city.lng, city.lat],
              },
              properties: {
                idx,
                name: city.name,
                labelColor: brightenForDark(
                  cityRegionColors[city.region] || FALLBACK_CITY_COLOR,
                ),
              },
            },
          ]
        : [],
    ),
  }
}
