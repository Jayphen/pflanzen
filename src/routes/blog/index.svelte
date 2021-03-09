<script context="module" lang="ts">
  export async function preload() {
    const data = await this.fetch("blog.json").then((r) => r.json());

    return { data };
  }
</script>

<script lang="ts">
  import type { AirtableRecord, PlantField } from "../../airtable";
  import LastWatered from "./_components/LastWatered.svelte";
  export let data: AirtableRecord<PlantField>[];
  console.log(data);
</script>

<svelte:head>
  <title>Blog</title>
</svelte:head>

<ul>
  {#each data as plant}
    <li>
      {#if plant.fields.Images}
        <img src={plant.fields.Images[0].thumbnails.small.url} />
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
