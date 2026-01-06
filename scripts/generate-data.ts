import * as fs from 'node:fs'
import * as path from 'node:path'
import Papa from 'papaparse'

const DB_DIR = path.resolve(import.meta.dirname, '../db')
const OUTPUT_DIR = path.resolve(import.meta.dirname, '../src/data/generated')

interface RawDiscovery {
  지역: string
  발견물: string
  '도서관 힌트': string
  도시: string
  위도: string
  경도: string
  증거품: string
  '조건 및 기타': string
}

interface RawCity {
  지역: string
  도시명: string
  위도: string
  경도: string
  특산물: string
  '시장에서 판매되는 아이템': string
  도서관: string
  '교회 또는 조합': string
}

interface RawBook {
  도서명: string
  언어: string
  '소재 도서관': string
  '게제 힌트': string
  필요: string
  개제조건: string
}

function parseCSV<T>(filePath: string): T[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const result = Papa.parse<T>(content, {
    header: true,
    skipEmptyLines: true,
  })

  return result.data
}

function generateDiscoveries(): void {
  const raw = parseCSV<RawDiscovery>(path.join(DB_DIR, 'discoveries.csv'))

  const discoveries = raw.map((row) => ({
    region: row.지역?.trim() || '',
    name: row.발견물?.trim() || '',
    hint: row['도서관 힌트']?.trim() || '',
    city: row.도시?.trim() || '',
    lat: parseFloat(row.위도) || 0,
    lng: parseFloat(row.경도) || 0,
    evidence: row.증거품?.trim() || '',
    condition: row['조건 및 기타']?.trim() || '',
  }))

  const regions = [...new Set(discoveries.map((d) => d.region))]

  const regionColors: Record<string, string> = {
    '지중해 연안 및 이베리아': '#e74c3c',
    '북부 유럽 및 북극해': '#3498db',
    '그리스 및 이집트': '#9b59b6',
    '서남 아시아 및 페르시아': '#e67e22',
    아프리카: '#27ae60',
    신대륙: '#f39c12',
    인도: '#e91e63',
    '동남아시아 및 티베트': '#00bcd4',
    '중국 및 몽골': '#ff5722',
    '동아시아, 호주 및 태평양 연안': '#795548',
  }

  const output = `import type { Discovery, RegionColors } from '../../types'

export const discoveries: Discovery[] = ${JSON.stringify(discoveries, null, 2)}

export const regionColors: RegionColors = ${JSON.stringify(
    regionColors,
    null,
    2
  )}

export const regions = ${JSON.stringify(regions, null, 2)}
`

  fs.writeFileSync(path.join(OUTPUT_DIR, 'discoveries.ts'), output)
  console.log(`Generated discoveries.ts (${discoveries.length} items)`)
}

function generateCities(): void {
  const raw = parseCSV<RawCity>(path.join(DB_DIR, 'cities.csv'))

  const cities = raw.map((row) => ({
    region: row.지역?.trim() || '',
    name: row.도시명?.trim() || '',
    lat: parseFloat(row.위도) || 0,
    lng: parseFloat(row.경도) || 0,
    specialProduct: row.특산물?.trim() || '',
    marketItems: row['시장에서 판매되는 아이템']?.trim() || '',
    hasLibrary: row.도서관?.trim() === '有',
    churchOrGuild: row['교회 또는 조합']?.trim() || '',
  }))

  const cityRegions = [...new Set(cities.map((c) => c.region))]

  const cityRegionColors: Record<string, string> = {
    이베리아: '#c0392b',
    '남부 유럽': '#8e44ad',
    '북부 유럽': '#2980b9',
    '발트해 연안 및 동부 유럽': '#16a085',
    '지중해 및 흑해 연안의 이슬람권': '#d35400',
    서아프리카: '#27ae60',
    동아프리카: '#2ecc71',
    인도: '#e91e63',
    동남아시아: '#00bcd4',
    중국: '#ff5722',
    동아시아: '#795548',
    신대륙: '#f39c12',
    서아시아: '#e67e22',
    중앙아시아: '#9c27b0',
  }

  const output = `import type { City } from '../../types'

export const cities: City[] = ${JSON.stringify(cities, null, 2)}

export const cityRegions = ${JSON.stringify(cityRegions, null, 2)}

export const cityRegionColors: Record<string, string> = ${JSON.stringify(
    cityRegionColors,
    null,
    2
  )}
`

  fs.writeFileSync(path.join(OUTPUT_DIR, 'cities.ts'), output)

  console.log(`Generated cities.ts (${cities.length} items)`)
}

function generateBooks(): void {
  const raw = parseCSV<RawBook>(path.join(DB_DIR, 'books.csv'))

  const books = raw.map((row) => ({
    name: row.도서명?.trim() || '',
    language: row.언어?.trim() || '',
    libraries: (row['소재 도서관'] || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    hintDiscovery: row['게제 힌트']?.trim() || '',
    requiredSkill: row.필요?.trim() || '',
    condition: row.개제조건?.trim() || '',
  }))

  const libraryByCities = [...new Set(books.flatMap((b) => b.libraries))]

  const output = `import type { Book } from '../../types'

export const books: Book[] = ${JSON.stringify(books, null, 2)}

export const libraryByCities = ${JSON.stringify(libraryByCities, null, 2)}
`

  fs.writeFileSync(path.join(OUTPUT_DIR, 'books.ts'), output)

  console.log(`Generated books.ts (${books.length} items)`)
}

function main(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  generateDiscoveries()
  generateCities()
  generateBooks()

  console.log('\nData generation complete!')
}

main()
