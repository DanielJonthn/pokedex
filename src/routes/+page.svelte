<script lang="ts">
  import type { PageData } from "./$types";
  import { generations } from "$lib/types/generations";

  export let data: PageData;
</script>

<h1>Welcome to Pokedex</h1>

{#each data.pokemon as pokemon (pokemon.id)}
  <p>{pokemon.id}: {pokemon.name}</p>
{/each}

{#each generations as gen (gen.id)}
  <h2>{gen.name}</h2>
  <p>Games: {gen.games.join(", ")}</p>
  <p>Region: {gen.main_region}</p>
{/each}

<style>
  h1 {
    color: orange;
    text-align: center;
  }
</style>
