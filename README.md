## Evopark Coding Challenge – Trainline Connections SPA

This project implements the Trainline connections SPA challenge described in  
[`evopark_coding_challenge.md`](https://gist.github.com/christianrolle/bec77ed8afa3be9ebeb3959a29772fde).

### Tech stack

- **Framework**: Vue 3 (Composition API, plain JavaScript)
- **Bundler**: Vite
- **Styling**: Tailwind CSS (utility classes + `@apply` in SFC `<style scoped>`)
- **Mocking**: Mock Service Worker (MSW) for frontend-only API mocks

### Project structure (high level)

- `src/App.vue` – Single-page layout, wires form + results table + API composable.
- `src/components/ConnectionSearchForm.vue` – From/To/Departure form.
- `src/components/ConnectionResultsTable.vue` – Connections list/table UI.
- `src/composables/useConnectionsApi.js` – Calls `POST /api/connections`, exposes `connections`, `isLoading`, `error`.
- `src/composables/useAutocompleteApi.js` – Autocomplete composable with switchable mock/real base URL (stub for later).
- `src/mocks/handlers.js` – MSW handlers for:
  - `POST /api/connections` (returns mock data from `src/mocks/data/connections.json`)
  - `GET /api/autocomplete` (simple mocked station suggestions)
- `src/mocks/browser.js` – MSW `setupWorker` for the browser.
- `public/mockServiceWorker.js` – **Generated** MSW worker script (project-agnostic, do not edit manually).

### MSW integration

- `src/main.js` imports `./assets/tailwind.css` and, in `DEV` mode, dynamically imports `src/mocks/browser.js` and starts the worker:

  ```js
  if (import.meta.env.DEV) {
    import('./mocks/browser').then(({ worker }) => {
      worker.start();
    });
  }
  ```

- All frontend API calls use `fetch`:
  - `/api/connections` is always mocked by MSW.
  - `/api/autocomplete` is currently mocked, but `useAutocompleteApi` is structured so a real endpoint can be plugged in later.

### Tailwind CSS

- Configuration: `tailwind.config.cjs`
- PostCSS: `postcss.config.cjs`
- Entry stylesheet: `src/assets/tailwind.css` with:

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

- Components use Tailwind utility classes in templates and `@apply` inside `<style scoped>` blocks for small design tokens (e.g. `form-label`, `form-input`, `btn-primary`).

### Development

```bash
nvm use 22          # or ensure Node 22 is active
npm install
npm run dev         # starts Vite dev server with MSW in dev mode
```

Open `http://localhost:5173/`, adjust the form, and click **Search**.  
The app will call the mocked `POST /api/connections` endpoint and render the table of connections from `src/mocks/data/connections.json`.
