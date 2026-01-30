import { z } from "zod";

const FareSchema = z.object({
  name: z.string(),
  price_in_cents: z.number().int().positive(),
  currency: z.string(),
  comfort_class: z.number().int().min(1).max(2),
});

export const ConnectionSchema = z.object({
  departure_station: z.string(),
  departure_at: z.string(),
  arrival_station: z.string(),
  arrival_at: z.string(),
  duration_in_minutes: z.number().int().positive(),
  changeovers: z.number().int().min(0),
  products: z.array(z.string()),
  fares: z.array(FareSchema).min(1),
});

export const ConnectionsResponseSchema = z.array(ConnectionSchema);
