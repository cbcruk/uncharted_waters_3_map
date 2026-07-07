import type { ProjectionSpecification } from 'maplibre-gl'

export const MAP_CONFIG = {
  center: [-9, 38] as [number, number],
  zoom: 3,
  minZoom: 1,
  maxZoom: 16,
  projection: { type: 'globe' } as ProjectionSpecification,
}
