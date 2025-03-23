import type { IndexPokemon, Pokemon, PokemonType } from "$lib/types/pokemons";

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

export async function fetchPokemonDetails(id: string) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
      console.error(`Error fetching Pokémon details: ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    return null;
  }
}

export async function fetchPokemonByRegion(region: string) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokedex/${region.toLowerCase()}`
    );

    if (!response.ok) {
      console.error(
        `Error fetching region ${region}:`,
        response.status,
        response.statusText
      );
      return [];
    }

    const json = await response.json();
    return json.pokemon_entries.map((entry: any) => entry.pokemon_species.name);
  } catch (error) {
    console.error("Error fetching Pokémon by region:", error);
    return [];
  }
}

export async function fetchPokemonTypes() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type/");
    if (!response.ok) throw new Error("Failed to fetch Pokémon types");

    const json = await response.json();

    const types = await Promise.all(
      json.results.map(async (type: { name: string; url: string }) => {
        const typeResponse = await fetch(type.url);
        if (!typeResponse.ok) return { name: type.name, pokemon_species: [] };

        const typeData = await typeResponse.json();
        return {
          name: type.name,
          pokemon_species: typeData.pokemon.map((p: any) => p.pokemon.name),
        };
      })
    );

    return types;
  } catch (error) {
    console.error("Error fetching Pokémon types:", error);
    return [];
  }
}
