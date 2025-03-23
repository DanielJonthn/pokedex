import { fetchPokemonByRegion } from "$lib/api/pokemon";

export type Generation = {
  id: number;
  name: string;
  games: string[];
  main_region: string;
  pokemon_species?: string[];
};

export const generations: Generation[] = [
  {
    id: 1,
    name: "Generation I",
    games: ["Red", "Blue", "Yellow"],
    main_region: "Kanto",
    pokemon_species: await fetchPokemonByRegion("kanto"),
  },
  {
    id: 2,
    name: "Generation II",
    games: ["Gold", "Silver", "Crystal"],
    main_region: "Johto",
    pokemon_species: await fetchPokemonByRegion("johto"),
  },
  {
    id: 3,
    name: "Generation III",
    games: ["Ruby", "Sapphire", "Emerald"],
    main_region: "Hoenn",
    pokemon_species: await fetchPokemonByRegion("hoenn"),
  },
  {
    id: 4,
    name: "Generation IV",
    games: ["Diamond", "Pearl", "Platinum"],
    main_region: "Sinnoh",
    pokemon_species: await fetchPokemonByRegion("sinnoh"),
  },
  {
    id: 5,
    name: "Generation V",
    games: ["Black", "White", "Black 2", "White 2"],
    main_region: "Unova",
    pokemon_species: await fetchPokemonByRegion("unova"),
  },
  {
    id: 6,
    name: "Generation VI",
    games: ["X", "Y", "Omega Ruby", "Alpha Sapphire"],
    main_region: "Kalos",
    pokemon_species: await fetchPokemonByRegion("kalos"),
  },
  {
    id: 7,
    name: "Generation VII",
    games: ["Sun", "Moon", "Ultra Sun", "Ultra Moon"],
    main_region: "Alola",
    pokemon_species: await fetchPokemonByRegion("alola"),
  },
  {
    id: 8,
    name: "Generation VIII",
    games: ["Sword", "Shield"],
    main_region: "Galar",
    pokemon_species: await fetchPokemonByRegion("galar"),
  },
];
