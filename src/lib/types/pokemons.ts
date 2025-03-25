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

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: any;
  sprites: {
    front_default: string;
    other?: {
      "official-artwork"?: {
        front_default: string;
      };
    };
  };
};

export type PokemonStat = {
  base_stat: number;
  percentage: number;
  stat: {
    name: string;
  };
};

export type PokemonAbility = {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
};

export function isPokemonDetail(obj: any): obj is PokemonDetail {
  return obj && typeof obj === "object" && "types" in obj && "stats" in obj;
}
