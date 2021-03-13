<script context="module" lang="ts">
  import type { Preload } from "@sapper/common";

  export const preload: Preload = async function preload() {
    const data = await fetcher("api/plants.json", {
      f: this.fetch,
    }).then((r) => r.json());

    if (data.error) {
      this.error(500, data.error);
    }

    return { data };
  };
</script>

<script lang="ts">
  import { setContext } from "svelte";

  import { initPlantsStore, plantsContext } from "../../stores/plants.store";
  import { fetcher } from "../../lib/fetcher";
  import { flip } from "svelte/animate";
  import Plant from "./_components/Plant.svelte";
  import type { ResolvedPlants } from "../api/plants/index.json";

  export let data: ResolvedPlants;

  const plants = initPlantsStore(data.plants);

  setContext(plantsContext, plants);

  let filterValue = "";
  $: filtered = plants.filter(filterValue);
</script>

<svelte:head>
  <title>Pflanzen</title>
</svelte:head>

<div class="wrapper">
  <p>
    Wow, you have {$plants.size} plants. Have you thought about buying some more?
  </p>

  <div>
    <label for="filter">Filter plants:</label>
    <input id="filter" bind:value={filterValue} />
  </div>

  <ul>
    {#each Array.from($filtered.plants) as [id, plant] (id)}
      <li animate:flip={{ duration: 300 }} data-plant={id}>
        <Plant {plant} />
      </li>
    {/each}
  </ul>
</div>

<style>
  .wrapper {
    display: grid;
    grid-gap: 1em;
  }
  ul,
  li {
    margin: 0;
    padding: 0;
    font-size: 1em;
  }
  ul {
    line-height: 1.5;
    list-style: none;
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(3, minmax(14em, 1fr));
  }
  @media (max-width: 768px) {
    ul {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 0.5em;
    }
  }
  li {
    padding: 1em;
    background: white;
    border-radius: 1em;
  }
</style>
