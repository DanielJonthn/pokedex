import { fetchPokemonDetails } from "$lib/api/pokemon";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load = (async ({ params }) => {
  try {
    const pokemon = await fetchPokemonDetails(params.id);

    if (!pokemon) {
      throw error(404, {
        message: `Pokémon with ID ${params.id} not found`,
      });
    }

    return {
      pokemon,
    };
  } catch (err) {
    console.error("Error loading Pokemon details:", err);
    throw error(404, {
      message: "Pokémon not found or error loading data",
    });
  }
}) satisfies PageLoad;
