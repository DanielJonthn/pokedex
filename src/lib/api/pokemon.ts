import type {
  IndexPokemon,
  Pokemon,
  PokemonTypeCategory,
  PokemonDetail,
} from "$lib/types/pokemons";

const cache = new Map();

async function fetchWithCache(url: string) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(url, data);
  return data;
}

export async function fetchPokemon(limit = 1510): Promise<IndexPokemon[]> {
  try {
    const data = await fetchWithCache(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
    );

    const pokemonWithDetails = await Promise.all(
      data.results.map(async (pokemon: Pokemon) => {
        const id = pokemon.url.split("/").filter(Boolean).pop();
        const details = await fetchWithCache(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        return {
          id,
          name: formatPokemonName(pokemon.name),
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          url: pokemon.url,
          types: details.types || [],
        };
      })
    );

    return pokemonWithDetails;
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    return [];
  }
}

export async function fetchPokemonDetails(
  id: string
): Promise<PokemonDetail | null> {
  try {
    const data = await fetchWithCache(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    );

    data.name = formatPokemonName(data.name);

    data.stats = data.stats.map((stat: any) => {
      return {
        ...stat,
        base_stat: stat.base_stat,
        percentage: Math.min(Math.floor((stat.base_stat / 255) * 100), 100),
        stat: {
          ...stat.stat,
          name: formatStatName(stat.stat.name),
        },
      };
    });

    data.abilities = data.abilities.map((ability: any) => {
      return {
        ...ability,
        ability: {
          ...ability.ability,
          name: formatPokemonName(ability.ability.name),
        },
      };
    });

    return data;
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    return null;
  }
}

export async function fetchPokemonByGeneration(
  genID: number
): Promise<string[]> {
  try {
    const data = await fetchWithCache(
      `https://pokeapi.co/api/v2/generation/${genID}`
    );
    return data.pokemon_species.map((species: any) => species.name);
  } catch (error) {
    console.error(`Error fetching Pokemon for generation ${genID}:`, error);
    return [];
  }
}

export async function fetchPokemonTypes(): Promise<PokemonTypeCategory[]> {
  try {
    const data = await fetchWithCache("https://pokeapi.co/api/v2/type/");

    const mainTypes = data.results.filter(
      (type: any) => !["unknown", "shadow"].includes(type.name)
    );

    const types = await Promise.all(
      mainTypes.map(async (type: { name: string; url: string }) => {
        const typeData = await fetchWithCache(type.url);
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

function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatStatName(name: string): string {
  const statNameMap: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };

  return statNameMap[name] || name;
}
