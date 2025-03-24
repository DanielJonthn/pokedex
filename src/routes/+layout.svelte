<script lang="ts">
  import { fly } from "svelte/transition";
  import { page } from "$app/stores";
</script>

{#key $page.url.pathname}
  <div
    in:fly={{ y: 5, duration: 250, delay: 300 }}
    out:fly={{ y: -5, duration: 200 }}
  >
    <slot />
  </div>
{/key}
