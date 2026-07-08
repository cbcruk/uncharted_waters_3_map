import { useEffect, useRef } from 'react'
import type { GeoJSONSource, MapLayerMouseEvent } from 'maplibre-gl'
import type { Point } from 'geojson'
import { useMap } from '@/components/ui/map'
import type { RegionVisibility } from '@/types'
import { buildCityCollection } from './discovery-map.utils'

interface CityLayerProps {
  cityVisibility: RegionVisibility
  onSelect: (idx: number, lng: number, lat: number) => void
}

const SOURCE_ID = 'cities'
const CLUSTER_LAYER = 'cities-clusters'
const CLUSTER_COUNT_LAYER = 'cities-cluster-count'
const POINT_LAYER = 'cities-unclustered'
const TEXT_FONT = ['Open Sans Regular']

export function CityLayer({ cityVisibility, onSelect }: CityLayerProps) {
  const { map, isLoaded } = useMap()
  const onSelectRef = useRef(onSelect)
  const cityVisibilityRef = useRef(cityVisibility)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    cityVisibilityRef.current = cityVisibility
  }, [cityVisibility])

  useEffect(() => {
    if (!isLoaded || !map) return

    const removeLayersAndSource = () => {
      try {
        if (map.getLayer(CLUSTER_COUNT_LAYER)) map.removeLayer(CLUSTER_COUNT_LAYER)
        if (map.getLayer(POINT_LAYER)) map.removeLayer(POINT_LAYER)
        if (map.getLayer(CLUSTER_LAYER)) map.removeLayer(CLUSTER_LAYER)
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID)
      } catch {
        // style may be mid-reload
      }
    }

    removeLayersAndSource()

    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: buildCityCollection((region) => cityVisibilityRef.current[region]),
      cluster: true,
      clusterRadius: 60,
      clusterMaxZoom: 14,
    })

    map.addLayer({
      id: CLUSTER_LAYER,
      type: 'circle',
      source: SOURCE_ID,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#475569',
        'circle-opacity': 0.92,
        'circle-stroke-width': 1.5,
        'circle-stroke-color': '#cbd5e1',
        'circle-radius': ['step', ['get', 'point_count'], 16, 10, 20, 50, 26],
      },
    })

    map.addLayer({
      id: CLUSTER_COUNT_LAYER,
      type: 'symbol',
      source: SOURCE_ID,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': TEXT_FONT,
        'text-size': 12,
      },
      paint: { 'text-color': '#f1f5f9' },
    })

    map.addLayer({
      id: POINT_LAYER,
      type: 'symbol',
      source: SOURCE_ID,
      filter: ['!', ['has', 'point_count']],
      layout: {
        'text-field': ['get', 'name'],
        'text-font': TEXT_FONT,
        'text-size': 12,
        'text-anchor': 'top',
        'text-offset': [0, 0.4],
      },
      paint: {
        'text-color': ['get', 'labelColor'],
        'text-halo-color': 'rgba(6, 8, 12, 0.9)',
        'text-halo-width': 1.4,
        'text-halo-blur': 0.4,
      },
    })

    const handlePointClick = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0]
      if (!feature) return
      const idx = feature.properties?.idx as number
      const coordinates = (feature.geometry as Point).coordinates.slice() as [
        number,
        number,
      ]
      while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360
      }
      onSelectRef.current(idx, coordinates[0], coordinates[1])
    }

    const handleClusterClick = (event: MapLayerMouseEvent) => {
      const feature = map.queryRenderedFeatures(event.point, {
        layers: [CLUSTER_LAYER],
      })[0]
      if (!feature) return
      const clusterId = feature.properties?.cluster_id as number
      const source = map.getSource(SOURCE_ID) as GeoJSONSource
      source.getClusterExpansionZoom(clusterId).then((zoom) => {
        map.easeTo({
          center: (feature.geometry as Point).coordinates as [number, number],
          zoom,
        })
      })
    }

    const showPointer = () => {
      map.getCanvas().style.cursor = 'pointer'
    }
    const resetPointer = () => {
      map.getCanvas().style.cursor = ''
    }

    map.on('click', POINT_LAYER, handlePointClick)
    map.on('click', CLUSTER_LAYER, handleClusterClick)
    map.on('mouseenter', POINT_LAYER, showPointer)
    map.on('mouseleave', POINT_LAYER, resetPointer)
    map.on('mouseenter', CLUSTER_LAYER, showPointer)
    map.on('mouseleave', CLUSTER_LAYER, resetPointer)

    return () => {
      map.off('click', POINT_LAYER, handlePointClick)
      map.off('click', CLUSTER_LAYER, handleClusterClick)
      map.off('mouseenter', POINT_LAYER, showPointer)
      map.off('mouseleave', POINT_LAYER, resetPointer)
      map.off('mouseenter', CLUSTER_LAYER, showPointer)
      map.off('mouseleave', CLUSTER_LAYER, resetPointer)
      removeLayersAndSource()
    }
  }, [isLoaded, map])

  useEffect(() => {
    if (!isLoaded || !map) return
    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined
    source?.setData(buildCityCollection((region) => cityVisibility[region]))
  }, [isLoaded, map, cityVisibility])

  return null
}
