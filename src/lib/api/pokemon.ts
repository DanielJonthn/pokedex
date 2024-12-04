import type { IndexPokemon, Pokemon } from "$lib/types/pokemons";

export async function fetchPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151/");
  const json = await response.json();

  const pokemon: [IndexPokemon] = json.results.map((pokemon: Pokemon) => {
    const id = pokemon.url.slice(34, -1);
    return {
      id,
      name: pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      url: pokemon.url,
    };
  });
  return pokemon;
}
