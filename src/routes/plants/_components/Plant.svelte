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
    <h2><a href={`plants/${plant.id}`}>{plant.fields.Name}</a></h2>
    {#if plant.fields.Images}
      <img
        src={plant.fields.Images[plant.fields.Images.length - 1].thumbnails
          .large.url}
        alt={`${plant.fields.Name}'s latest image`}
        width={plant.fields.Images[plant.fields.Images.length - 1].thumbnails
          .large.width}
        loading="lazy"
      />
    {:else}
      <img
        src="images/plant.png"
        alt={`${plant.fields.Name} placeholder image`}
      />
    {/if}
  </a>
  <header class:watered={$state.matches("watered")}>
    {#if $state.matches("watered")}
      <span class="watered-today">Watered today!</span>
    {:else if plant.fields["Last Watered"]}
      <span class="last-watered">
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
  .plant > a {
    display: block;
  }
  .plant {
    display: grid;
    grid-gap: 0.5em;
    align-items: center;
    height: 100%;
    text-align: center;
    grid-template-columns: 1fr;
    grid-template-rows: min-content;
    grid-template-areas:
      "img img"
      "content content"
      "button button";
  }
  .plant img {
    margin-top: 0.5em;
    padding-right: 0;
  }

  .plant :global(:first-child) {
    grid-area: img;
  }
  .plant :global(:nth-child(2)) {
    grid-area: content;
    margin-bottom: auto;
  }
  .plant :global(:last-child) {
    grid-area: button;
    margin-top: auto;
  }
  img {
    max-width: 100%;
    aspect-ratio: 3/4;
  }
  .watered span {
    color: #2cb5fb;
  }
  .never-watered,
  .last-watered,
  .watered-today {
    font-size: 0.75em;
    line-height: 1.3;
    display: block;
  }

  img {
    padding-right: 0.25em;
  }
</style>
