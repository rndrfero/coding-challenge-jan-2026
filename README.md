# 🚂 Trainline Connections SPA

Single-page application for searching train connections between cities.

## ⚙️ Architecture

Vue 3 with Composition API, Vite. Composables for logic, co-located tests. No inline CSS — visuals are separated.

### Dependencies

- **@vueuse/core** — composables (useFetch for race condition handling)
- **Zod** — runtime API validation and type safety
- **Tailwind CSS** — utility-first styling
- **Vitest** — unit testing framework
- **@vue/test-utils** — Vue component testing utilities
- **MSW** — API mocking for development and testing

## 🧪 Test Data - End user testing

Available cities for autocomplete: **Vienna, Berlin, Paris, London, Rome, Madrid, Amsterdam, Prague**.

**Example searches:**

- Vienna → Berlin
- Paris → London
- Rome → Madrid
- Amsterdam → Prague

## ⚠️ Live API Limitations

We cannot use the live trainline.com API:

- CORS limitations (could be overcome by proxy server)
- JS execution API checks (difficult to hack)

## 📱 UI Limitations

- Proposed table format (gist) shows only departure/arrival times, not datetimes, but dates can differ

## 📋 Assumptions

- Readability, simplicity and conventions represent code-quality metrics
- Aesthetics (colors, icons etc) are not important — KISS approach
- Self-explanatory code without comments is preferred, comprehensive documentation is not needed in AI era
- API returns connections already sorted by time distance
- API returns fares sorted by price (cheapest first)
- Connection API data structure follows documented format
- Autocomplete API data structure follows trainline.com format

## 🔮 Limitations and Future Improvements

- Type definitions and safety
- Production-ready error handling
- Animation visual tuning and fixing sort relaunch animation bug
- Dynamic generative mock data
- Loading state for autocomplete
- Timezone awareness
- More tests for edge cases
- E2E tests, visual regression tests, accessibility tests
- Keyboard support for autocomplete
- API rate limiting
- Loading skeletons
- etc

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Running

```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Testing

```bash
npm run test:run
```

Watch mode: `npm test`
