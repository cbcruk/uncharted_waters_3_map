# Uncharted Waters 3 Map

대항해시대 3의 발견물과 도시 정보를 지도에서 확인할 수 있는 웹 앱입니다.

## Features

- 발견물 위치 표시 (지역별 필터링)
- 도시 정보 표시 (도서관, 교회/조합 여부)
- 수채화 스타일 지도 (Stamen Watercolor)

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Leaflet / React-Leaflet

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Data Management

데이터는 CSV 파일로 관리되며, 빌드 시 자동으로 TypeScript로 변환됩니다.

```
db/
├── discoveries.csv   # 발견물 데이터
├── cities.csv        # 도시 데이터
└── books.csv         # 도서 데이터
```

### Workflow

1. Google Sheets에서 데이터 수정
2. CSV로 내보내서 `db/` 폴더에 저장
3. `pnpm dev` 또는 `pnpm build` 실행 시 자동 변환

### Manual Generation

```bash
pnpm generate
```

## Project Structure

```
src/
├── components/       # React components
├── data/
│   └── generated/    # Auto-generated TypeScript data (gitignored)
├── types/            # TypeScript type definitions
└── App.tsx           # Main application
```
