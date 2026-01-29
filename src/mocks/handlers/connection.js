import { http, HttpResponse } from "msw";
import connections from "../data/connections.json";
import { normalize } from "../matchUtils";

function equalsOperator(a, b) {
  return normalize(a) === normalize(b);
}

export const connectionHandlers = [
  http.post("/api/connections", async ({ request }) => {
    const body = await request.json();
    const from = body.from;
    const to = body.to;

    const filtered = connections.filter((segment) => {
      return (
        equalsOperator(segment.departure_station, from) &&
        equalsOperator(segment.arrival_station, to)
      );
    });

    return HttpResponse.json(filtered);
  }),
];
