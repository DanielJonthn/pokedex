import type { IndexPokemon } from "$lib/types/indexPokemon";

export async function fetchPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151/");
  const json = await response.json();

  const pokemon = json.results.map((pokemon: IndexPokemon) => {
    const id = pokemon.url.slice(34, -1);
    return {
      name: pokemon.name,
      url: pokemon.url,
      id,
    };
  });
  return pokemon;
}
