import { fetchPokemonTypes } from "$lib/api/pokemon";

export type Pokemon = {
  name: string;
  url: string;
};

export type PokemonTypeName = string;

export type PokemonType = {
  slot: number;
  type: {
    name: PokemonTypeName;
    url?: string;
  };
};

export type IndexPokemon = Pokemon & {
  id: string;
  image: string;
  types: PokemonType[];
};

export type PokemonTypeCategory = {
  name: PokemonTypeName;
  pokemon_species?: string[];
};

export const pokemonTypes: PokemonTypeCategory[] = await fetchPokemonTypes();
