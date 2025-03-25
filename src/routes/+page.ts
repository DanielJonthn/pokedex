import { fetchPokemon, fetchPokemonTypes } from "$lib/api/pokemon";
import { generations } from "$lib/types/generations";
import type { PageLoad } from "./$types";

export const load = (async () => {
  const [pokemon, pokemonTypes] = await Promise.all([
    fetchPokemon(),
    fetchPokemonTypes(),
  ]);

  return {
    pokemon,
    pokemonTypes,
    generations,
  };
}) satisfies PageLoad;
