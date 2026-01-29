import { http, HttpResponse } from "msw";
import autocompleteData from "../data/autocomplete.json";
import { normalize } from "../matchUtils";

function matchOperator(value, query) {
  const v = normalize(value);
  const q = normalize(query);
  return q !== "" && v.includes(q);
}

export const autocompleteHandlers = [
  http.get("/api/autocomplete", ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";

    if (!query) {
      return HttpResponse.json({ searchLocations: [] });
    }

    const matches = autocompleteData.searchLocations.filter(
      (item) =>
        matchOperator(item.name, query) ||
        matchOperator(item.translatedName, query),
    );

    return HttpResponse.json({ searchLocations: matches });
  }),
];

