<script context="module" lang="ts">
  export async function preload() {
    const data = await fetcher("plants.json", {
      f: this.fetch,
    }).then((r) => r.json());

    return { data };
  }
</script>

<script lang="ts">
  import { setContext } from "svelte";

  import type { AirtableRecord, PlantField } from "../../airtable";
  import { initPlantsStore, plantsContext } from "../../stores/plants.store";
  import { fetcher } from "../../lib/fetcher";
  import { flip } from "svelte/animate";
  import Plant from "./_components/Plant.svelte";

  export let data: AirtableRecord<PlantField>[];

  const plants = initPlantsStore(data);
  setContext(plantsContext, plants);
</script>

<svelte:head>
  <title>Pflanzen</title>
</svelte:head>

<ul>
  {#each Array.from($plants) as [id, plant] (id)}
    <li animate:flip data-plant={id}>
      <Plant {plant} />
    </li>
  {/each}
</ul>

<style>
  ul {
    line-height: 1.5;
    list-style: none;
    display: grid;
    grid-gap: 2em;
    margin: 0;
  }
  li {
    margin: 0;
    padding: 0;
  }
</style>
