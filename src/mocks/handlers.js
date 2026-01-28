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

    // Simple mock: if query matches the start of any city name,
    // return all cities; otherwise return an empty result.
    const hasMatch =
      query &&
      autocompleteData.searchLocations.some((item) =>
        item.name.toLowerCase().startsWith(query),
      );

    if (!hasMatch) {
      return HttpResponse.json({ searchLocations: [] });
    }

    return HttpResponse.json(autocompleteData);
  }),
];
