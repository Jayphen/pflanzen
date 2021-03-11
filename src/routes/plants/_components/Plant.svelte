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
  import type { AirtableRecord, PlantField } from "../../../airtable";
  import Water from "./Water.svelte";
  import { createWaterMachine } from "../../../machines/water.machine";

  export let plant: AirtableRecord<PlantField>;

  const { state, init, water } = createWaterMachine(plant);

  init();
</script>

<div class="plant">
  <div class="media">
    {#if plant.fields.Images}
      <img
        src={plant.fields.Images[0].thumbnails.small.url}
        alt={`${plant.fields.Name}'s latest image`}
        height={plant.fields.Images[0].thumbnails.small.height}
        width={plant.fields.Images[0].thumbnails.small.width}
      />
    {:else}
      <img
        src="images/plant.png"
        alt={`${plant.fields.Name} placeholder image`}
      />
    {/if}
    <header class:watered={$state.matches("watered")}>
      <h2><a href={`plants/${plant.id}`}>{plant.fields.Name}</a></h2>
      {#if $state.matches("watered")}
        <span>Watered today!</span>
      {:else}
        <span>
          last watered
          {formatDate(plant.fields["Last Watered"])}
        </span>
      {/if}
    </header>
  </div>

  <Water state={$state} {water} />
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
  .media img {
    max-width: 2em;
  }
  .watered span {
    color: #2cb5fb;
  }

  img {
    padding-right: 1em;
  }
</style>
