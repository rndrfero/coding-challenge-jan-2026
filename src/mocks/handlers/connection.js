import { http, HttpResponse } from "msw";
import connections from "../data/connections.json";
import { normalize } from "../../utils/formatters";

function equalsOperator(a, b) {
  return normalize(a) === normalize(b);
}

export const connectionHandlers = [
  http.post("/api/connections", async ({ request }) => {
    const body = await request.json();
    const from = body.from;
    const to = body.to;
    const maxChangeovers = body.maxChangeovers;

    const departureAt = body.departureAt;
    const searchDateTime = departureAt ? new Date(departureAt).getTime() : null;

    const filtered = connections.filter((segment) => {
      const matchesRoute =
        equalsOperator(segment.departure_station, from) &&
        equalsOperator(segment.arrival_station, to);

      const matchesChangeovers =
        typeof maxChangeovers !== "number" ||
        segment.changeovers <= maxChangeovers;

      const matchesDateTime =
        !searchDateTime ||
        new Date(segment.departure_at).getTime() >= searchDateTime;

      return matchesRoute && matchesChangeovers && matchesDateTime;
    });

    return HttpResponse.json(filtered);
  }),
];
