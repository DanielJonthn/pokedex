<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";
  export let data: PageData;

  const pokemon = data.pokemon;

  const goBack = () => {
    goto("/");
  };
</script>

<button class="back-button" on:click={goBack}>⬅ Back</button>

<h1 class="title-detail">
  {pokemon.name} <span class="pokemon-id">#{pokemon.id}</span>
</h1>

<div class="details-container">
  <!-- Pokémon Image -->
  <div class="image-container">
    <img
      src={pokemon.sprites.front_default}
      alt={pokemon.name}
      class="pokemon-image"
    />
  </div>

  <!-- Pokémon Info -->
  <div class="details-card">
    <!-- Type Section -->
    <h2>Type</h2>
    <div class="types">
      {#each pokemon.types as { type }}
        <span class="type-badge {type.name}">{type.name}</span>
      {/each}
    </div>

    <!-- Stats Section -->
    <h2>Stats</h2>
    <ul class="stats-list">
      {#each pokemon.stats as stat}
        <li class="stat-item">
          <span class="stat-name">{stat.stat.name}</span>
          <div class="stat-bar">
            <div class="stat-fill" style="width: {stat.base_stat}%"></div>
          </div>
          <span class="stat-value">{stat.base_stat}</span>
        </li>
      {/each}
    </ul>

    <!-- Abilities Section -->
    <h2>Abilities</h2>
    <ul class="abilities-list">
      {#each pokemon.abilities as ability}
        <li class="ability">{ability.ability.name}</li>
      {/each}
    </ul>
  </div>
</div>
