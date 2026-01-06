import L from 'leaflet'

export function createDiscoveryIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 12px;
      height: 12px;
      background-color: ${color || '#999'};
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}
