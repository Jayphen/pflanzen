<script lang="ts" context="module">
  export async function preload(page) {
    const plant = await fetcher(`api/plants/${page.params.slug}.json`, {
      f: this.fetch,
    }).then((r) => r.json());

    return { plant };
  }
</script>

<script lang="ts">
  import { fetcher } from "../../../lib/fetcher";

  export let plant;
</script>

<h1>{plant.fields.Name}</h1>

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

<style>
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
