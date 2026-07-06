import L from 'leaflet'
import 'leaflet.markercluster'

type RegionColorMap = Record<string, string>

/**
 * 클러스터에 포함된 자식 마커들의 지역(region) 중 가장 많은 지역을 찾아
 * 해당 색상을 클러스터 대표 색으로 사용한다.
 */
function getDominantColor(
  cluster: L.MarkerCluster,
  regionColors: RegionColorMap,
): string {
  const counts: Record<string, number> = {}

  for (const marker of cluster.getAllChildMarkers()) {
    const region = (marker.options as { region?: string }).region
    if (!region) continue
    counts[region] = (counts[region] ?? 0) + 1
  }

  let dominant = ''
  let max = 0
  for (const [region, count] of Object.entries(counts)) {
    if (count > max) {
      max = count
      dominant = region
    }
  }

  return regionColors[dominant] || '#666'
}

/**
 * 자식 마커 수(작을수록 작게)에 따라 클러스터 아이콘 크기를 단계별로 조정한다.
 */
function getSize(count: number): number {
  if (count < 10) return 34
  if (count < 50) return 40
  return 48
}

/**
 * react-leaflet-cluster의 iconCreateFunction으로 사용할 팩토리.
 * 지역 색상을 반영한 원형 divIcon(숫자 표시)을 생성한다.
 */
export function createClusterIcon(regionColors: RegionColorMap) {
  return (cluster: L.MarkerCluster): L.DivIcon => {
    const count = cluster.getChildCount()
    const color = getDominantColor(cluster, regionColors)
    const size = getSize(count)

    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="cluster-marker" style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
      ">${count}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }
}
