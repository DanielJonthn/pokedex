<script lang="ts">
  import type { PageData } from "./$types";
  import { generations } from "$lib/types/generations";

  export let data: PageData;
</script>

<h1>Welcome to Pokedex</h1>

<div class="container">
  <div class="grid">
    {#each generations as gen (gen.id)}
      <div class="gens">{gen.main_region}</div>
    {/each}
  </div>

  <div class="grid">
    {#each data.pokemon as pokemon (pokemon.id)}
      <div class="cards">
        <div class="cards-id">
          {pokemon.id}
        </div>
        <div class="cards-content">
          <img src={pokemon.image} alt={pokemon.name} />
          {pokemon.name}
        </div>
      </div>
    {/each}
  </div>
</div>
