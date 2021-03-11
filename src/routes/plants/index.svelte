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
</script>

<svelte:head>
  <title>Pflanzen</title>
</svelte:head>

<p>
  Wow, you have {$plants.size} plants. Have you thought about buying some more?
</p>

<ul>
  {#each Array.from($plants) as [id, plant] (id)}
    <li animate:flip={{ duration: 500 }} data-plant={id}>
      <Plant {plant} />
    </li>
  {/each}
</ul>

<style>
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
  }
</style>
