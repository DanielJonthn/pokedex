<script lang="ts">
  import { goto } from "$app/navigation";
  import type { IndexPokemon } from "$lib/types/pokemons";
  import TypeBadge from "./TypeBadge.svelte";

  export let pokemon: IndexPokemon;

  function navigateToDetails() {
    goto(`/pokemon/${pokemon.id}`);
  }
</script>

<div
  class="pokemon-card"
  on:click={navigateToDetails}
  on:keydown={(e) => e.key === "Enter" && navigateToDetails()}
  tabindex="0"
  role="button"
  aria-label="View {pokemon.name} details"
>
  <div class="card-id">#{pokemon.id}</div>
  <div class="card-image">
    <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
  </div>
  <div class="card-name">{pokemon.name}</div>

  {#if pokemon.types && pokemon.types.length > 0}
    <div class="card-types">
      {#each pokemon.types as { type }}
        <TypeBadge type={type.name} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .pokemon-card {
    width: 180px;
    margin: 12px;
    padding: 16px;
    background-color: var(--card-bg);
    box-shadow: 0 4px 8px var(--card-shadow);
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    cursor: pointer;
    position: relative;
    text-align: center;
    overflow: hidden;
  }

  .pokemon-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .card-id {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 0.9rem;
    color: var(--text-color);
    font-weight: bold;
  }

  .card-image {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }

  .card-image img {
    max-height: 100%;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
    transition: transform 0.3s;
  }

  .pokemon-card:hover .card-image img {
    transform: scale(1.1);
  }

  .card-name {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  .card-types {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
  }
</style>
