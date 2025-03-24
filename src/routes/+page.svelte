<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import type { IndexPokemon } from "$lib/types/pokemons";
  import PokemonCard from "$lib/components/PokemonCard.svelte";
  import FilterBar from "$lib/components/FilterBar.svelte";
  import { initializeStores, filterStore } from "$lib/stores/pokemonStore";
  import { fly, fade } from "svelte/transition";

  export let data: PageData;

  let isLoading = true;
  let filteredPokemon: IndexPokemon[] = [];

  onMount(async () => {
    await initializeStores();
    isLoading = false;
  });

  $: {
    if (data.pokemon) {
      filteredPokemon = data.pokemon.filter((pokemon) => {
        const matchesSearch = pokemon.name
          .toLowerCase()
          .includes($filterStore.searchQuery.toLowerCase());

        const matchesRegion =
          $filterStore.selectedRegions.length === 0 ||
          $filterStore.selectedRegions.some((region) => {
            const regionData = data.generations.find(
              (gen) => gen.main_region === region
            );
            return regionData?.pokemon_species?.includes(
              pokemon.name.toLowerCase()
            );
          });

        const matchesType =
          $filterStore.selectedTypes.length === 0 ||
          $filterStore.selectedTypes.some((type) => {
            const typeData = data.pokemonTypes.find((t) => t.name === type);
            return typeData?.pokemon_species?.includes(
              pokemon.name.toLowerCase()
            );
          });

        return matchesSearch && matchesRegion && matchesType;
      });
    }
  }
</script>

<svelte:head>
  <title>Pokédex - Explore the World of Pokémon</title>
  <meta
    name="description"
    content="A personal Pokédex application to explore Pokémon from different regions and types."
  />
</svelte:head>

<div class="pokedex-container">
  <header>
    <div class="logo-container" in:fly={{ y: -20, duration: 500 }}>
      <div class="pokeball"></div>
      <h1>Pokédex</h1>
    </div>
    <p class="subtitle" in:fly={{ y: -10, duration: 500, delay: 200 }}>
      Explore the world of Pokémon
    </p>
  </header>

  <FilterBar />

  {#if isLoading}
    <div class="loading" in:fade={{ duration: 300 }}>
      <div class="spinner"></div>
      <p>Loading Pokémon data...</p>
    </div>
  {:else if filteredPokemon.length === 0}
    <div class="no-results" in:fade={{ duration: 300 }}>
      <p>No Pokémon found matching your filters.</p>
      <button
        on:click={() =>
          filterStore.update((state) => ({
            ...state,
            searchQuery: "",
            selectedRegions: [],
            selectedTypes: [],
          }))}
      >
        Reset Filters
      </button>
    </div>
  {:else}
    <div class="pokemon-grid" in:fade={{ duration: 300 }}>
      {#each filteredPokemon as pokemon, i (pokemon.id)}
        <div in:fly={{ y: 20, duration: 300, delay: (i % 10) * 50 }}>
          <PokemonCard {pokemon} />
        </div>
      {/each}
    </div>
  {/if}

  <footer>
    <p>
      Created by
      <a
        href="https://github.com/DanielJonthn/pokedex"
        target="_blank"
        rel="noopener noreferrer">Daniel Jonathan</a
      >
    </p>
  </footer>
</div>

<style>
  .pokedex-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    text-align: center;
    margin-bottom: 20px;
  }

  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .pokeball {
    width: 40px;
    height: 40px;
    background: linear-gradient(
      to bottom,
      #ff0000 0%,
      #ff0000 50%,
      white 50%,
      white 100%
    );
    border-radius: 50%;
    position: relative;
    border: 2px solid #333;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  .pokeball::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    background-color: white;
    border: 2px solid #333;
    border-radius: 50%;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0;
    color: #3d7dca;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: 700;
  }

  .subtitle {
    color: #666;
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 1.1rem;
    font-weight: bold;
  }

  .pokemon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
    padding: 20px 0;
    flex-grow: 1;
  }

  .loading,
  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    flex-grow: 1;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #3d7dca;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  .no-results button {
    margin-top: 15px;
    padding: 8px 16px;
    background-color: #3d7dca;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition:
      background-color 0.2s,
      transform 0.2s;
  }

  .no-results button:hover {
    background-color: #2a5a9c;
    transform: translateY(-2px);
  }

  footer {
    text-align: center;
    padding: 20px 0;
    margin-top: auto;
    color: #666;
  }

  footer a {
    color: #3d7dca;
    text-decoration: none;
    transition: color 0.2s;
  }

  footer a:hover {
    color: #2a5a9c;
    text-decoration: underline;
  }
</style>
