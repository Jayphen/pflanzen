<script context="module" lang="ts">
  export async function preload({ host }) {
    const data = await fetcher("plants.json", {
      host,
      f: this.fetch,
    }).then((r) => r.json());

    return { data };
  }
</script>

<script lang="ts">
  import { setContext } from "svelte";
  import { flip } from "svelte/animate";

  import type { AirtableRecord, PlantField } from "../../airtable";
  import LastWatered from "./_components/LastWatered.svelte";
  import { initPlantsStore, plantsContext } from "../../stores/plants.store";
  import { fetcher } from "../../lib/fetcher";
  export let data: AirtableRecord<PlantField>[];

  const plants = initPlantsStore(data);
  setContext(plantsContext, plants);
</script>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<ul>
  {#each Array.from($plants) as [id, plant] (id)}
    <li data-plant={id} animate:flip>
      {#if plant.fields.Images}
        <img
          src={plant.fields.Images[0].thumbnails.small.url}
          alt={`${plant.fields.Name}'s latest image`}
        />
      {/if}
      {plant.fields.Name}
      <LastWatered {plant} />
    </li>
  {/each}
</ul>

<style>
  ul {
    line-height: 1.5;
    list-style: none;
    display: grid;
    grid-gap: 2em;
  }

  li {
    padding: 1em;
    background: white;
    display: flex;
    align-items: center;
    border-radius: 1em;
  }
  img {
    padding-right: 1em;
  }
</style>
