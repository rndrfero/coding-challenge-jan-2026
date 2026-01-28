import { http, HttpResponse } from "msw";
import connections from "./data/connections.json";
import autocompleteData from "./data/autocomplete.json";

export const handlers = [
  http.post("/api/connections", async ({ request }) => {
    const body = await request.json();
    // body: { from, to, departureAt } - not used yet
    return HttpResponse.json(connections);
  }),

  http.get("/api/autocomplete", ({ request }) => {
    const url = new URL(request.url);
    const query = (url.searchParams.get("q") || "").toLowerCase();

    if (!query) {
      return HttpResponse.json({ searchLocations: [] });
    }

    const matches = autocompleteData.searchLocations.filter((item) =>
      item.name.toLowerCase().startsWith(query),
    );

    return HttpResponse.json({ searchLocations: matches });
  }),
];
