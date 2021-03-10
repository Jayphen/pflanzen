<script lang="ts" context="module">
  const formatDate = (date: string) => {
    if (!date) return "Never";
    const _date = new Date(date);
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(
      _date
    );
  };
</script>

<script lang="ts">
  import { onDestroy } from "svelte";

  import type { AirtableRecord, PlantField } from "../../../airtable";
  import LastWatered from "./LastWatered.svelte";
  import { createPlantMachine } from "./plant.machine";

  export let plant: AirtableRecord<PlantField>;

  const { state, init, water, unsubscribe } = createPlantMachine(plant);

  init();

  onDestroy(unsubscribe);
</script>

<div class="plant">
  <div class="media">
    {#if plant.fields.Images}
      <img
        src={plant.fields.Images[0].thumbnails.small.url}
        alt={`${plant.fields.Name}'s latest image`}
      />
    {/if}
    <header>
      <h2>{plant.fields.Name}</h2>
      <span>
        last watered {$state.matches("watered")
          ? "Today"
          : formatDate(plant.fields["Last Watered"])}
      </span>
    </header>
  </div>

  <LastWatered state={$state} {water} />
</div>

<style>
  h2 {
    margin: 0;
    font-size: 1.2em;
    font-weight: bold;
  }
  .plant {
    padding: 1em;
    background: white;
    display: grid;
    align-items: center;
    border-radius: 1em;
    grid-template-columns: auto 1fr auto;
  }
  .media {
    display: flex;
    align-items: center;
  }

  img {
    padding-right: 1em;
  }
</style>
