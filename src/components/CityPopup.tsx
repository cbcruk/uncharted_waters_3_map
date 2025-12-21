import type { City } from '../types'
import { books } from '../data/books'
import { discoveries } from '../data/discoveries'

interface CityPopupProps {
  city: City
}

export function CityPopup({ city }: CityPopupProps) {
  const {
    name,
    region,
    lat,
    lng,
    specialProduct,
    marketItems,
    hasLibrary,
    churchOrGuild,
  } = city

  const availableBooks = hasLibrary
    ? books.filter((book) => book.libraries.includes(name))
    : []

  const cityDiscoveries = discoveries.filter((d) => d.city === name)

  const getChurchLabel = (code: string) => {
    switch (code) {
      case '양':
        return '서양 교회'
      case '교':
        return '이슬람 사원'
      case '조':
        return '조합'
      default:
        return ''
    }
  }

  return (
    <div>
      <div className="text-lg font-bold text-brown-dark border-b-2 border-gold pb-1.5 mb-2.5">
        {name}
      </div>
      <div className="text-brown-light text-xs mb-2">{region}</div>

      <div className="text-brown-medium [&_strong]:text-brown-dark">
        <strong>좌표:</strong> {lat >= 0 ? '북위' : '남위'} {Math.abs(lat)}°,{' '}
        {lng >= 0 ? '동경' : '서경'} {Math.abs(lng)}°
        {specialProduct && (
          <>
            <br />
            <strong>특산물:</strong> {specialProduct}
          </>
        )}
        {marketItems && (
          <>
            <br />
            <strong>시장:</strong> {marketItems}
          </>
        )}
        <br />
        <strong>도서관:</strong> {hasLibrary ? '有' : '無'}
        {churchOrGuild && (
          <>
            {' | '}
            <strong>{getChurchLabel(churchOrGuild)}</strong>
          </>
        )}
      </div>

      {availableBooks.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-gray-300">
          <div className="text-[13px] font-bold text-brown-dark mb-1.5">
            열람 가능한 도서 ({availableBooks.length}권)
          </div>
          <ul className="list-none p-0 m-0 text-xs">
            {availableBooks.slice(0, 5).map((book, idx) => (
              <li key={idx} className="py-0.5 text-brown-medium">
                <span className="text-blue-dark">{book.name}</span>
                {book.hintDiscovery && (
                  <span className="text-brown-light text-[11px]"> → {book.hintDiscovery}</span>
                )}
              </li>
            ))}
            {availableBooks.length > 5 && (
              <li className="text-brown-light italic py-0.5">
                ...외 {availableBooks.length - 5}권
              </li>
            )}
          </ul>
        </div>
      )}

      {cityDiscoveries.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-gray-300">
          <div className="text-[13px] font-bold text-brown-dark mb-1.5">
            이 도시의 발견물 ({cityDiscoveries.length}개)
          </div>
          <ul className="list-none p-0 m-0 text-xs">
            {cityDiscoveries.map((discovery, idx) => (
              <li key={idx} className="py-0.5 text-brown-medium">
                <span className="text-brown-dark">{discovery.name}</span>
                {discovery.evidence && (
                  <span className="text-brown-light text-[11px]">
                    {' '}
                    ({discovery.evidence})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
