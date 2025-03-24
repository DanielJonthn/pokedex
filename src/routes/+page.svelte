<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import type { IndexPokemon } from "$lib/types/pokemons";
  import PokemonCard from "$lib/components/PokemonCard.svelte";
  import FilterBar from "$lib/components/FilterBar.svelte";
  import { initializeStores, filterStore } from "$lib/stores/pokemonStore";
  import { fly, fade } from "svelte/transition";
  import { theme } from "$lib/stores/themeStore";
  import Footer from "$lib/components/Footer.svelte";

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

  // Infinite Scroll
  let visiblePokemon: IndexPokemon[] = [];
  let pageSize = 24;
  let currentPage = 1;
  let isLoadingMore = false;
  let hasMore = true;

  $: {
    if (filteredPokemon) {
      if (
        visiblePokemon.length > 0 &&
        visiblePokemon[0]?.id !== filteredPokemon[0]?.id
      ) {
        currentPage = 1;
        hasMore = true;
      }

      visiblePokemon = filteredPokemon.slice(0, pageSize * currentPage);
      hasMore = visiblePokemon.length < filteredPokemon.length;
    }
  }

  async function loadMorePokemon() {
    if (isLoadingMore || !hasMore) return;

    isLoadingMore = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      currentPage++;
      visiblePokemon = filteredPokemon.slice(0, pageSize * currentPage);
      hasMore = visiblePokemon.length < filteredPokemon.length;
    } finally {
      isLoadingMore = false;
    }
  }

  let observerTarget: HTMLDivElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingMore && hasMore) {
          loadMorePokemon();
        }
      },
      { rootMargin: "200px" }
    );

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
    };
  });

  let showScrollButton = false;

  onMount(() => {
    window.addEventListener("scroll", () => {
      showScrollButton = window.scrollY > 500;
    });
  });

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function toggleTheme() {
    theme.update((current) => (current === "light" ? "dark" : "light"));
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
    <div class="header-top">
      <div class="logo-container" in:fly={{ y: -20, duration: 500 }}>
        <div class="pokeball"></div>
        <h1>Pokédex</h1>
      </div>

      <button
        class="theme-toggle"
        on:click={toggleTheme}
        aria-label="Toggle theme"
      >
        {#if $theme === "light"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        {/if}
      </button>
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
      {#each visiblePokemon as pokemon, i (pokemon.id)}
        <div in:fly={{ y: 20, duration: 300, delay: (i % 10) * 50 }}>
          <PokemonCard {pokemon} />
        </div>
      {/each}
    </div>

    {#if hasMore}
      <div class="load-more-container" bind:this={observerTarget}>
        <div class="spinner small"></div>
        <p>Loading more Pokémon...</p>
      </div>
    {:else if visiblePokemon.length > 0}
      <div class="end-message">
        <p>You've reached the end! {visiblePokemon.length} Pokémon loaded.</p>
      </div>
    {/if}
  {/if}

  <Footer />

  {#if showScrollButton}
    <button
      class="scroll-top-button"
      on:click={scrollToTop}
      in:fade={{ duration: 200 }}
      out:fade={{ duration: 200 }}
      aria-label="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  {/if}
</div>

<style>
  .header-top {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

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
    color: var(--primary-color);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    font-weight: 700;
  }

  .subtitle {
    color: var(--text-color);
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
    border-color: var(--spinner-border);
    border-top-color: var(--primary-color);
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

  /* Infinite Scroll */
  .load-more-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 25px 0;
  }

  .spinner.small {
    width: 25px;
    height: 25px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top: 3px solid #3d7dca;
    margin-bottom: 10px;
  }

  .end-message {
    text-align: center;
    color: #666;
    padding: 20px 0;
    font-style: italic;
    font-weight: 500;
  }

  .scroll-top-button {
    position: fixed;
    right: 25px;
    bottom: 25px;
    width: 45px;
    height: 45px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    z-index: 100;
    transition:
      transform 0.2s ease,
      background-color 0.2s ease;
  }

  .scroll-top-button:hover {
    transform: translateY(-3px);
    background-color: #2a5a9c;
  }
</style>
