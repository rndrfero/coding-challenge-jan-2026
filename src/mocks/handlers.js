import { http, HttpResponse } from "msw";
import connections from "./data/connections.json";
import autocompleteData from "./data/autocomplete.json";

export const handlers = [
  http.post("/api/connections", async ({ request }) => {
    const body = await request.json();
    const from = (body.from || "").toString().trim().toLowerCase();
    const to = (body.to || "").toString().trim().toLowerCase();

    // Filter by translated city names only (exact, case-insensitive match)
    const filtered = connections.filter((segment) => {
      const departure = segment.departure_station
        .toString()
        .trim()
        .toLowerCase();
      const arrival = segment.arrival_station.toString().trim().toLowerCase();
      return (!from || departure === from) && (!to || arrival === to);
    });

    return HttpResponse.json(filtered);
  }),

  http.get("/api/autocomplete", ({ request }) => {
    const url = new URL(request.url);
    const query = (url.searchParams.get("q") || "").toLowerCase();

    if (!query) {
      return HttpResponse.json({ searchLocations: [] });
    }

    const matches = autocompleteData.searchLocations.filter((item) => {
      const name = (item.name || "").toLowerCase();
      const translatedName = (item.translatedName || "").toLowerCase();
      return name.startsWith(query) || translatedName.startsWith(query);
    });

    return HttpResponse.json({ searchLocations: matches });
  }),
];
