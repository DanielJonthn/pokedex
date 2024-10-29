import { fetchPokemon } from "$lib/api/pokemon";
import type { PageLoad } from "./$types";

export const load = (async () => {
  const pokemon = await fetchPokemon();
  return {
    pokemon,
  };
}) satisfies PageLoad;
