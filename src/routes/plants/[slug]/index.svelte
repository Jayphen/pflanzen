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
  import { format } from "date-fns";
  import type { AirtableRecord, PlantField } from "../../../airtable";
  import { fetcher } from "../../../lib/fetcher";
  import Notes from "./_components/Notes.svelte";

  export let data: {
    plant: AirtableRecord<PlantField>;
    diary: AirtableRecord<any>[];
  };

  console.log(data);
  const plant = data.plant;
</script>

<div class="wrapper">
  <h1>{plant.fields.Name}</h1>

  {#if plant.fields.Notes}<Notes {plant} />{/if}

  {#if data.diary}
    {#each data.diary as entry}
      <h3>{entry.fields.Title}</h3>
      <small>{format(new Date(entry.createdTime), "dd/MM/yyyy")}</small>
      <p>{entry.fields.Entry}</p>
    {/each}
  {/if}

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
