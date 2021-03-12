<script lang="ts" context="module">
  import type { Preload } from "@sapper/common";

  export const preload: Preload = async function preload(this, page) {
    const data = await fetcher(`api/plants/${page.params.slug}.json`, {
      f: this.fetch,
    }).then((r) => r.json());

    return { data };
  };
</script>

<script lang="ts">
  import { setContext } from "svelte";

  import type { AirtableRecord, PlantField } from "../../../airtable";
  import { fetcher } from "../../../lib/fetcher";
  import Diary from "./_components/Diary.svelte";
  import Gallery from "./_components/Gallery.svelte";
  import Notes from "./_components/Notes.svelte";

  export let data: {
    plant: AirtableRecord<PlantField>;
    diary: AirtableRecord<any>[];
  };

  const plant = data.plant;

  setContext("plant", plant);
</script>

<div class="wrapper">
  <h1>{plant.fields.Name}</h1>

  {#if plant.fields.Notes}<Notes {plant} />{/if}

  {#if data.diary}<Diary diary={data.diary} />{/if}

  {#if plant.fields.Images}
    <Gallery {plant} />
  {:else}
    <p>No image!</p>
  {/if}
</div>

<style>
  .wrapper {
    display: grid;
    grid-gap: 1em;
  }
  .wrapper > :global(*) {
    margin: 0;
  }
</style>
