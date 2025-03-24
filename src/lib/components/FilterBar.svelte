<script lang="ts">
  import { slide, fade } from "svelte/transition";
  import {
    filterStore,
    generationsStore,
    pokemonTypes,
  } from "$lib/stores/pokemonStore";
  import { clickOutside } from "$lib/utils/clickOutside";

  let searchQuery = "";
  let selectedRegions: string[] = [];
  let selectedTypes: string[] = [];
  let showTypeFilter = false;

  filterStore.subscribe((state) => {
    searchQuery = state.searchQuery;
    selectedRegions = state.selectedRegions;
    selectedTypes = state.selectedTypes;
    showTypeFilter = state.showTypeFilter;
  });

  function updateFilters() {
    filterStore.update((state) => ({
      ...state,
      searchQuery,
      selectedRegions,
      selectedTypes,
      showTypeFilter,
    }));
  }

  function toggleRegion(region: string) {
    if (selectedRegions.includes(region)) {
      selectedRegions = selectedRegions.filter((r) => r !== region);
    } else {
      selectedRegions = [...selectedRegions, region];
    }
    updateFilters();
  }

  function toggleType(type: string) {
    if (selectedTypes.includes(type)) {
      selectedTypes = selectedTypes.filter((t) => t !== type);
    } else {
      selectedTypes = [...selectedTypes, type];
    }
    updateFilters();
  }

  function resetFilters() {
    searchQuery = "";
    selectedRegions = [];
    selectedTypes = [];
    updateFilters();
  }

  function toggleTypeFilter() {
    showTypeFilter = !showTypeFilter;
    updateFilters();
  }

  function handleSearchInput() {
    updateFilters();
  }

  function handleClickOutside() {
    if (showTypeFilter) {
      showTypeFilter = false;
      updateFilters();
    }
  }
</script>

<div class="filter-container">
  <div class="region-filters" transition:fade={{ duration: 200 }}>
    {#each $generationsStore as gen (gen.id)}
      <button
        class="region-btn {selectedRegions.includes(gen.main_region)
          ? 'active'
          : ''}"
        on:click={() => toggleRegion(gen.main_region)}
      >
        {gen.main_region}
      </button>
    {/each}
  </div>

  <div class="search-container" use:clickOutside={handleClickOutside}>
    <div class="search-wrapper">
      <input
        type="text"
        placeholder="Search Pokémon..."
        bind:value={searchQuery}
        on:input={handleSearchInput}
        class="search-bar"
      />
      <button
        class="clear-btn"
        on:click={resetFilters}
        aria-label="Clear filters"
        title="Clear filters"
      >
        {#if searchQuery || selectedRegions.length > 0 || selectedTypes.length > 0}
          ×
        {/if}
      </button>
    </div>

    <button
      class="filter-button {showTypeFilter ? 'active' : ''}"
      on:click={toggleTypeFilter}
      aria-label="Filter by type"
    >
      <span class="filter-icon">⚙️</span>
      <span class="filter-label">Type Filter</span>
      {#if selectedTypes.length > 0}
        <span class="filter-count">{selectedTypes.length}</span>
      {/if}
    </button>

    {#if showTypeFilter}
      <div class="filter-dropdown" transition:slide={{ duration: 200 }}>
        <div class="filter-header">
          <h3>Filter by Type</h3>
          <button
            class="clear-type-btn"
            on:click={() => {
              selectedTypes = [];
              updateFilters();
            }}
          >
            Clear
          </button>
        </div>

        <div class="type-grid">
          {#if $pokemonTypes?.length > 0}
            {#each $pokemonTypes as type}
              <label
                class="type-checkbox {type.name} {selectedTypes.includes(
                  type.name
                )
                  ? 'selected'
                  : ''}"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.name)}
                  on:change={() => toggleType(type.name)}
                />
                <span>{type.name}</span>
              </label>
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .filter-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin: 16px 0 24px;
    width: 100%;
    margin-top: 0px;
  }

  .region-filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .region-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    background-color: #ddd;
    color: #333;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .region-btn:hover {
    background-color: #bbb;
    transform: translateY(-2px);
  }

  .region-btn.active {
    background-color: #3d7dca;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    position: relative;
    margin: 8px auto;
    width: 100%;
    max-width: 500px;
  }

  .search-wrapper {
    position: relative;
    flex-grow: 1;
  }

  .search-bar {
    width: 100%;
    padding: 12px 16px;
    padding-right: 40px;
    border: 2px solid #ddd;
    border-radius: 12px;
    font-size: 16px;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
    box-sizing: border-box;
  }

  .search-bar:focus {
    outline: none;
    border-color: #3d7dca;
    box-shadow: 0 0 0 3px rgba(61, 125, 202, 0.2);
  }

  .clear-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 24px;
    height: 24px;
  }

  .filter-button {
    background-color: #ddd;
    border: none;
    border-radius: 12px;
    padding: 10px 16px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
    position: relative;
  }

  .filter-button:hover {
    background-color: #bbb;
    transform: translateY(-2px);
  }

  .filter-button.active {
    background-color: #3d7dca;
    color: white;
  }

  .filter-icon {
    font-size: 18px;
  }

  .filter-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff5252;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }

  .filter-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    padding: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    z-index: 100;
    width: 300px;
    margin-top: 8px;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .filter-header h3 {
    margin: 0;
    font-size: 16px;
  }

  .clear-type-btn {
    background: none;
    border: none;
    color: #3d7dca;
    cursor: pointer;
    font-size: 14px;
    transition: color 0.2s;
  }

  .clear-type-btn:hover {
    color: #2a5a9c;
    text-decoration: underline;
  }

  .type-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-2px);
    }
    100% {
      transform: translateY(0);
    }
  }
  .type-checkbox {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
    font-size: 14px;
    text-transform: capitalize;
    animation: float 3s infinite ease-in-out;
  }

  .type-checkbox:hover {
    transform: translateY(-2px);
  }

  .type-checkbox input {
    width: 16px;
    height: 16px;
  }

  .type-checkbox.selected {
    box-shadow:
      0 0 0 2px white inset,
      0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 600px) {
    .filter-label {
      display: none;
    }

    .type-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
