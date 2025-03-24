<script lang="ts">
  export let type: string;
</script>

<span class="type-badge {type}">{type}</span>

<style>
  .type-badge {
    padding: 5px 10px;
    border-radius: 15px;
    color: white;
    font-weight: bold;
    text-transform: capitalize;
    font-size: 0.9rem;
    display: inline-block;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    margin: 2px;
    transition: transform 0.2s;
  }

  .type-badge:hover {
    transform: scale(1.05);
  }
</style>
