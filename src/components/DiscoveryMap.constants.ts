import type L from 'leaflet'

const isProd = import.meta.env.PROD

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

const TILE_PROVIDERS = {
  stadia: {
    url: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
    labelsUrl:
      'https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://stamen.com/">Stamen Design</a>',
  },
  cartodb: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    labelsUrl:
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
}

const currentProvider = isProd ? TILE_PROVIDERS.cartodb : TILE_PROVIDERS.stadia

export const TILE_URLS = {
  base: currentProvider.url,
  labels: currentProvider.labelsUrl,
}

export const TILE_ATTRIBUTION = currentProvider.attribution
