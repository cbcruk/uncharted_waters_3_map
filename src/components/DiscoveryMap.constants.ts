import type L from 'leaflet'

export const MAP_CONFIG = {
  center: [38, -9] as L.LatLngExpression,
  zoom: 6,
  minZoom: 3,
  maxZoom: 16,
  bounds: [
    [-85, -180],
    [85, 180],
  ] as L.LatLngBoundsExpression,
  boundsViscosity: 1.0,
}

export const TILE_URLS = {
  watercolor:
    'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
  labels:
    'https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png',
}

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com/">Stamen Design</a>'
