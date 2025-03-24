<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";
  import TypeBadge from "$lib/components/TypeBadge.svelte";
  import { browser } from "$app/environment";

  export let data: PageData;

  const pokemon = data.pokemon;
  let isLoading = true;

  onMount(() => {
    isLoading = false;
  });

  const goBack = () => {
    if (browser) {
      window.history.back();
    } else {
      goto("/");
    }
  };

  const formatStatName = (name: string): string => {
    const statNames: Record<string, string> = {
      hp: "HP",
      attack: "Attack",
      defense: "Defense",
      "special-attack": "Sp. Attack",
      "special-defense": "Sp. Defense",
      speed: "Speed",
    };

    return statNames[name] || name;
  };

  const getStatColor = (value: number): string => {
    if (value < 50) return "#ff5959";
    if (value < 80) return "#ffdd57";
    return "#78c850";
  };

  const calculateStatPercent = (value: number): number => {
    return Math.min(Math.max((value / 255) * 100, 5), 100);
  };
</script>

<div class="pokemon-detail-container">
  {#if isLoading}
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading Pokémon data...</p>
    </div>
  {:else}
    <div class="detail-header">
      <button class="back-button" on:click={goBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1>
        <span class="pokemon-name">{pokemon.name}</span>
        <span class="pokemon-id">#{pokemon.id.toString().padStart(3, "0")}</span
        >
      </h1>
    </div>

    <div class="pokemon-content">
      <div class="image-container">
        <div class="image-wrapper">
          <img
            src={pokemon.sprites.other?.["official-artwork"]?.front_default ||
              pokemon.sprites.front_default}
            alt={pokemon.name}
            class="pokemon-image"
          />
        </div>

        <div class="types-container">
          {#each pokemon.types as { type }}
            <TypeBadge type={type.name} />
          {/each}
        </div>

        <div class="physical-info">
          <div class="info-item">
            <span class="info-label">Height</span>
            <span class="info-value">{(pokemon.height / 10).toFixed(1)} m</span>
          </div>
          <div class="info-item">
            <span class="info-label">Weight</span>
            <span class="info-value">{(pokemon.weight / 10).toFixed(1)} kg</span
            >
          </div>
        </div>
      </div>

      <div class="details-card">
        <section class="card-section">
          <h2>Base Stats</h2>
          <div class="stats-container">
            {#each pokemon.stats as stat}
              <div class="stat-item">
                <div class="stat-name">{formatStatName(stat.stat.name)}</div>
                <div class="stat-value">{stat.base_stat}</div>
                <div class="stat-bar">
                  <div
                    class="stat-fill"
                    style="width: {calculateStatPercent(
                      stat.base_stat
                    )}%; background-color: {getStatColor(stat.base_stat)}"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </section>

        <section class="card-section">
          <h2>Abilities</h2>
          <div class="abilities-container">
            {#each pokemon.abilities as ability}
              <div class="ability-badge">
                {ability.ability.name.replace("-", " ")}
                {#if ability.is_hidden}
                  <span class="hidden-ability">(Hidden)</span>
                {/if}
              </div>
            {/each}
          </div>
        </section>

        <section class="card-section">
          <h2>Moves</h2>
          <div class="moves-container">
            {#each pokemon.moves.slice(0, 6) as move}
              <div class="move-badge">
                {move.move.name.replace("-", " ")}
              </div>
            {/each}
            {#if pokemon.moves.length > 6}
              <div class="more-moves">+{pokemon.moves.length - 6} more</div>
            {/if}
          </div>
        </section>
      </div>
    </div>
  {/if}
</div>

<style>
  .pokemon-detail-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    font-family: "Arial", sans-serif;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
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
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3d7dca;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }

  .detail-header {
    margin-bottom: 30px;
  }

  .back-button {
    background: #ff5350;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .back-button:hover {
    background: #e74c3c;
  }

  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin: 25px 0;
  }

  .pokemon-name {
    font-size: 2.5rem;
    text-transform: capitalize;
    color: #333;
  }

  .pokemon-id {
    font-size: 1.5rem;
    color: #666;
    font-weight: normal;
  }

  .pokemon-content {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 30px;
  }

  @media (max-width: 768px) {
    .pokemon-content {
      grid-template-columns: 1fr;
    }
  }

  .image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .image-wrapper {
    background: radial-gradient(
      circle,
      rgba(240, 240, 240, 1) 0%,
      rgba(220, 220, 220, 1) 100%
    );
    border-radius: 50%;
    padding: 20px;
    width: 250px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .pokemon-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2));
  }

  .types-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .physical-info {
    display: flex;
    gap: 20px;
    margin-top: 15px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px 20px;
    border-radius: 10px;
  }

  .info-label {
    font-size: 14px;
    color: #666;
  }

  .info-value {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .details-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .card-section {
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  .card-section:last-child {
    border-bottom: none;
  }

  h2 {
    margin: 0 0 15px 0;
    font-size: 1.3rem;
    color: #3d7dca;
    position: relative;
    padding-bottom: 8px;
  }

  h2::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: #ffcb05;
    border-radius: 3px;
  }

  .stats-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .stat-item {
    display: grid;
    grid-template-columns: 100px 40px 1fr;
    align-items: center;
    gap: 10px;
  }

  .stat-name {
    font-weight: bold;
    color: #555;
  }

  .stat-value {
    font-weight: bold;
    text-align: right;
  }

  .stat-bar {
    height: 8px;
    background-color: #eee;
    border-radius: 4px;
    overflow: hidden;
  }

  .stat-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease-out;
  }

  .abilities-container,
  .moves-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .ability-badge,
  .move-badge {
    background-color: #f5f5f5;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    text-transform: capitalize;
    color: #333;
  }

  .hidden-ability {
    font-size: 12px;
    color: #666;
    font-style: italic;
    margin-left: 4px;
  }

  .more-moves {
    font-size: 14px;
    color: #666;
    display: flex;
    align-items: center;
    padding: 6px 12px;
  }
</style>
