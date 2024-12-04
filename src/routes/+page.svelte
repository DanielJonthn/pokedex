<script lang="ts">
  import type { PageData } from "./$types";
  import { generations } from "$lib/types/generations";
  import type { IndexPokemon } from "$lib/types/pokemons";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  export let data: PageData;

  let pokemonID: string = $page.url.searchParams.get("pokemonID") || "";
  $: pokemon = data.pokemon.find((pokemon) => pokemon.id === pokemonID);
  const detailHandler = (pokemon: IndexPokemon) => {
    pokemonID = pokemon.id;
    goto(`?pokemonID=${pokemonID}`);
  };
</script>

<h1>Welcome to Pokedex</h1>
<h1>{pokemonID}</h1>
<h2>{pokemon?.name}</h2>

<div class="container">
  <div class="grid">
    {#each generations as gen (gen.id)}
      <div class="gens">{gen.main_region}</div>
    {/each}
  </div>

  <!-- svelte-ignore missing-declaration -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="grid">
    {#each data.pokemon as pokemon (pokemon.id)}
      <div class="cards" on:click={() => detailHandler(pokemon)}>
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
