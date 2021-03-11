<script lang="ts">
  import type { WaterMachineState } from "../../../machines/water.machine";

  export let state: WaterMachineState;
  export let water: () => void;
</script>

{#if state.matches("watered")}
  <span class="watered">💦 Watered!</span>
{:else if state.matches("loading")}
  <button disabled={true}>Watering</button>
{:else if state.matches("error")}
  <button on:click={water}
    >Try again. <small>Maybe you are not me?</small></button
  >
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
