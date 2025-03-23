import { fetchPokemonDetails } from "$lib/api/pokemon";
import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
  const pokemon = await fetchPokemonDetails(params.id);
  return {
    pokemon,
  };
}) satisfies PageLoad;
