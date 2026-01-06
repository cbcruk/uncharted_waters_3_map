import type { Discovery } from '../types'

interface DiscoveryPopupProps {
  discovery: Discovery
}

export function DiscoveryPopup({ discovery }: DiscoveryPopupProps) {
  const { name, region, lat, lng, city, evidence, hint, condition } = discovery

  return (
    <div>
      <div className="text-lg font-bold text-brown-dark border-b-2 border-gold pb-1.5 mb-2.5">
        {name}
      </div>
      <div className="text-brown-light text-xs mb-2">{region}</div>
      <div className="text-brown-medium [&_strong]:text-brown-dark">
        <strong>좌표:</strong> {lat >= 0 ? '북위' : '남위'} {Math.abs(lat)}°,{' '}
        {lng >= 0 ? '동경' : '서경'} {Math.abs(lng)}°
        {city && (
          <>
            <br />
            <strong>도시:</strong> {city}
          </>
        )}
        {evidence && (
          <>
            <br />
            <strong>증거품:</strong> {evidence}
          </>
        )}
      </div>
      {hint && (
        <div className="bg-cream p-2 border-l-3 border-gold mt-2 italic">
          "{hint}"
        </div>
      )}
      {condition && <div className="text-saddle mt-2 text-xs">{condition}</div>}
    </div>
  )
}
