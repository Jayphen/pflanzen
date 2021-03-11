<script lang="ts" context="module">
  import type { Preload } from "@sapper/common";

  export const preload: Preload = async function preload(this, page) {
    const plant = await fetcher(`api/plants/${page.params.slug}.json`, {
      f: this.fetch,
    }).then((r) => r.json());

    return { plant };
  };
</script>

<script lang="ts">
  import type { AirtableRecord, PlantField } from "../../../airtable";
  import { fetcher } from "../../../lib/fetcher";
  import Notes from "./_components/Notes.svelte";

  export let plant: AirtableRecord<PlantField>;
</script>

<div class="wrapper">
  <h1>{plant.fields.Name}</h1>

  {#if plant.fields.Notes}<Notes {plant} />{/if}

  {#if plant.fields.Images}
    <div class="image-grid">
      {#each plant.fields.Images as image}
        <figure>
          <img
            src={image.thumbnails.large.url}
            alt={`Picture of ${plant.fields.Name}`}
          />
          <figcaption>{image.filename}</figcaption>
        </figure>
      {/each}
    </div>
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
  .image-grid {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(2, minmax(auto, 1fr));
  }
  img {
    width: 100%;
  }
  figure {
    padding: 1em;
    margin: 0;
    background: white;
    text-align: center;
    font-size: 0.875em;
  }
</style>
