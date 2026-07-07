import type { FeatureCollection, Point } from 'geojson'
import { discoveries } from '@/data/discoveries'
import { cities, cityRegionColors } from '@/data/cities'

export interface DiscoveryFeatureProps {
  idx: number
}

export interface CityFeatureProps {
  idx: number
  name: string
  color: string
}

const FALLBACK_CITY_COLOR = '#5a4a3a'

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
                color: cityRegionColors[city.region] || FALLBACK_CITY_COLOR,
              },
            },
          ]
        : [],
    ),
  }
}
