import { z } from "zod";

export const LocationSchema = z.object({
  name: z.string(),
  translatedName: z.string(),
  countryCode: z.string(),
  code: z.string(),
  score: z.number(),
  longitude: z.number(),
  latitude: z.number(),
  extraInfo: z.object({
    attributes: z.array(z.string()),
  }),
  locationType: z.string(),
  defaultLanguage: z.string(),
  timezone: z.string(),
  connections: z.array(z.unknown()),
});

export const AutocompleteResponseSchema = z.object({
  searchLocations: z.array(LocationSchema),
});

/**
 * @typedef {Object} Location
 * @property {string} name
 * @property {string} translatedName
 * @property {string} countryCode
 * @property {string} code
 * @property {number} score
 * @property {number} longitude
 * @property {number} latitude
 * @property {Object} extraInfo
 * @property {string[]} extraInfo.attributes
 * @property {string} locationType
 * @property {string} defaultLanguage
 * @property {string} timezone
 * @property {unknown[]} connections
 */

/**
 * @typedef {Object} AutocompleteResponse
 * @property {Location[]} searchLocations
 */
