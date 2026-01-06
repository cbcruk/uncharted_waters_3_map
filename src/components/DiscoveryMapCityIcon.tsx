import L from 'leaflet'

interface CityMarkerOptions {
  name: string
  color: string
  hasLibrary: boolean
  churchOrGuild: string
}

function getFacilityIcon(churchOrGuild: CityMarkerOptions['churchOrGuild']) {
  switch (churchOrGuild) {
    case '양':
      return '🕍'
    case '교':
      return '⛪️'
    case '조':
      return '🏢'
    default:
      return ''
  }
}

export function createCityIcon({
  name,
  color,
  hasLibrary,
  churchOrGuild,
}: CityMarkerOptions) {
  const facilityIcon = getFacilityIcon(churchOrGuild)
  const libraryIcon = hasLibrary ? '📖' : ''
  const icons = [libraryIcon, facilityIcon].filter(Boolean).join('')
  const classes = ['city-name-marker', hasLibrary ? 'has-library' : '']
    .filter(Boolean)
    .join(' ')

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="${classes}" style="background-color: ${color || '#666'};">
        <span class="city-name"">${name}</span>
        ${icons ? `<span class="city-icons">${icons}</span>` : ''}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 10],
  })
}
