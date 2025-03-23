<script lang="ts">
  import type { PageData } from "./$types";
  import { generations } from "$lib/types/generations";
  import {
    pokemonTypes,
    type IndexPokemon,
    type PokemonTypeName,
  } from "$lib/types/pokemons";
  import { goto } from "$app/navigation";

  export let data: PageData;

  const detailHandler = (pokemon: IndexPokemon) => {
    goto(`/pokemon/${pokemon.id}`);
  };

  let searchQuery = "";
  let selectedRegions: string[] = [];
  let selectedTypes: string[] = [];
  let showTypeFilter = false;

  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      selectedRegions = selectedRegions.filter((r) => r !== region);
    } else {
      selectedRegions = [...selectedRegions, region];
    }
  };

  const toggleType = (type: PokemonTypeName) => {
    if (selectedTypes.includes(type)) {
      selectedTypes = selectedTypes.filter((t) => t !== type);
    } else {
      selectedTypes = [...selectedTypes, type];
    }
  };

  $: filteredPokemon = data.pokemon.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const region = generations.find((gen) =>
      gen.pokemon_species?.includes(pokemon.name)
    )?.main_region;
    const matchesRegion =
      selectedRegions.length === 0 ||
      (region && selectedRegions.includes(region));

    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.some((type) =>
        pokemonTypes
          .find((t) => t.name === type)
          ?.pokemon_species?.includes(pokemon.name)
      );

    return matchesSearch && matchesRegion && matchesType;
  });
</script>

<h1 class="title">Welcome to Pokedex</h1>

<div class="container">
  <div class="grid">
    <div class="gens-selected">
      {#each generations as gen (gen.id)}
        <button
          class="gens"
          class:active={selectedRegions.includes(gen.main_region)}
          on:click={() => toggleRegion(gen.main_region)}
        >
          {gen.main_region}
        </button>
      {/each}
    </div>
  </div>

  <div class="search-container">
    <input
      type="text"
      placeholder="Search Pokémon..."
      bind:value={searchQuery}
      class="search-bar"
    />

    <button
      class="filter-button"
      on:click={() => (showTypeFilter = !showTypeFilter)}
    >
      ⚙️
    </button>

    {#if showTypeFilter}
      <div class="filter-dropdown">
        {#if pokemonTypes?.length > 0}
          {#each pokemonTypes as type}
            <label>
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.name)}
                on:change={() => toggleType(type.name)}
              />
              {type.name}
            </label>
          {/each}
        {/if}
      </div>
    {/if}
  </div>

  <div class="grid">
    {#each filteredPokemon as pokemon (pokemon.id)}
      <button class="cards" on:click={() => detailHandler(pokemon)}>
        <div class="cards-id">
          {pokemon.id}
        </div>
        <div class="cards-content">
          <img src={pokemon.image} alt={pokemon.name} />
          {pokemon.name}
        </div>
      </button>
    {/each}
  </div>
</div>
