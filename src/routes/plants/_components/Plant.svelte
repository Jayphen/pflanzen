<script lang="ts" context="module">
  import { formatDistanceToNow } from "date-fns";

  const formatDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return formatDistanceToNow(new Date(+year, +month - 1, +day), {
      addSuffix: true,
    });
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
  <a href={`plants/${plant.id}`}>
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
  </a>
  <header class:watered={$state.matches("watered")}>
    <h2><a href={`plants/${plant.id}`}>{plant.fields.Name}</a></h2>
    {#if $state.matches("watered")}
      <span>Watered today!</span>
    {:else if plant.fields["Last Watered"]}
      <span>
        last watered
        {formatDate(plant.fields["Last Watered"])}
      </span>
    {:else}
      <span class="never-watered"
        >Not watered yet! Welcome to the family, {plant.fields.Name}</span
      >
    {/if}
  </header>

  <Water state={$state} {water} />
</div>

<style>
  h2 {
    margin: 0;
    font-size: 1.2em;
    font-weight: bold;
  }
  .plant {
    display: grid;
    grid-gap: 0.5em;
    align-items: center;
    height: 100%;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "img content"
      "button button";
  }

  .plant :global(:last-child) {
    grid-area: button;
    margin-top: auto;
  }
  img {
    max-width: 2em;
  }
  .watered span {
    color: #2cb5fb;
  }
  .never-watered {
    font-size: 0.75em;
    line-height: 1.3;
    display: block;
  }

  img {
    padding-right: 0.25em;
  }
</style>
