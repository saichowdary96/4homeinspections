/**
 * Service areas. Designed to support multi-location expansion later — each
 * region groups multiple cities. Add regions/cities as your coverage grows.
 */

export type ServiceRegion = {
  region: string;
  description: string;
  cities: string[];
};

export const serviceRegions: ServiceRegion[] = [
  {
    region: "Greater Austin",
    description: "Our home base — full coverage across the metro core.",
    cities: ["Austin", "Round Rock", "Cedar Park", "Pflugerville", "Lakeway"],
  },
  {
    region: "North Corridor",
    description: "Fast-growing communities north of the city.",
    cities: ["Leander", "Georgetown", "Hutto", "Liberty Hill", "Jarrell"],
  },
  {
    region: "Hill Country",
    description: "Scenic communities to the west and southwest.",
    cities: ["Dripping Springs", "Bee Cave", "Spicewood", "Wimberley", "Buda"],
  },
  {
    region: "South & East",
    description: "Expanding suburbs to the south and east.",
    cities: ["Kyle", "San Marcos", "Manor", "Elgin", "Bastrop"],
  },
];

/** Flat list of all served cities (used for SEO and quick checks). */
export const allCities = serviceRegions.flatMap((r) => r.cities);
