# Trainline Connections SPA

Single-page application for searching train connections between cities.

## Architecture

Vue 3 with Composition API, Vite, Tailwind CSS, and MSW for API mocking. Uses composables for reusable logic and co-located tests.

## Test Data

Available cities for autocomplete: Vienna, Berlin, Paris, London, Rome, Madrid, Amsterdam, Prague.

Example searches:

- Vienna → Berlin
- Paris → London
- Rome → Madrid
- Amsterdam → Prague

## API Limitations

We cannot use the live trainline.com API:

- CORS limitations (could be overcome by proxy server)
- JS execution API checks (difficult to hack)

## UI limitations

- proposed table format (gist) show only departure/arrival times, not datetimes, but dates can differ

## Assumptions

- Readability, simplicity and conventions represent code-quality metrics
- aesthetics (colors, icons etc) are not important - KISS approach
- API returns connections allready sorted by time distance
- API returns fares sorted by price (cheapest first)
- Connection API data structure follows documented format
- Autocomplete API data structure follows trainline.com format

## Limitations and Future Improvements

- Animation visual tuning and fixing sort relaunch animation bug
- Dynamic generative mock data - mock API has no datetime filtering
- No accessibility (ARIA) attributes
- Debounce API calls, especially autocomplete
- Add loading state for autocomplete
- No explicit localization of time handling

## Installation

```bash
npm install
```

## Running

```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

## Testing

```bash
npm run test:run
```

Watch mode: `npm test`
