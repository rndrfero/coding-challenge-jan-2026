import { http, HttpResponse } from 'msw';
import connections from './data/connections.json';

export const handlers = [
  http.post('/api/connections', async ({ request }) => {
    const body = await request.json();
    // body: { from, to, departureAt } - not used yet
    return HttpResponse.json(connections);
  }),

  http.get('/api/autocomplete', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';

    const allStations = [
      'Ashchurch For Tewkesbury',
      'Ash',
      'London',
      'Bristol',
      'Cardiff'
    ];

    const results = allStations
      .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
      .map((name, index) => ({ id: index + 1, name }));

    return HttpResponse.json(results);
  })
];

