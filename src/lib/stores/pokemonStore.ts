import { writable } from "svelte/store";
import type { PokemonTypeCategory } from "$lib/types/pokemons";
import { fetchPokemonTypes } from "$lib/api/pokemon";
import { loadPokemonSpecies, type Generation } from "$lib/types/generations";

export const pokemonTypes = writable<PokemonTypeCategory[]>([]);

export const filterStore = writable({
  searchQuery: "",
  selectedRegions: [] as string[],
  selectedTypes: [] as string[],
  showTypeFilter: false,
});

export const generationsStore = writable<Generation[]>([]);

export async function initializeStores() {
  const types = await fetchPokemonTypes();
  pokemonTypes.set(types);

  const genData = await loadPokemonSpecies();
  generationsStore.set(genData);
}
