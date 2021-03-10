<script lang="ts">
  import type { PlantField } from "../../../airtable";

  export let state: any;
  export let water: () => void;

  let fields: PlantField;
  $: ({
    context: {
      data: { fields },
    },
  } = state);
</script>

{#if state.matches("watered")}
  <span class="watered">💦 Watered!</span>
{:else if state.matches("loading")}
  <button disabled={true}>Watering</button>
{:else}
  <button on:click={water}>Water plant</button>
{/if}

<style>
  span {
    color: #737373;
    font-size: 0.75em;
  }
  .watered {
    margin-left: auto;
  }
  button {
    background: white;
    border: 0;
    border-radius: 0.5em;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-left: auto;
    border: 1px solid #afd2a3;
    padding: 1em;
    cursor: pointer;
  }
</style>
