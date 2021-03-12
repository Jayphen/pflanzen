<script lang="ts">
  import type { AirtableRecord, Image, PlantField } from "../../../../airtable";
  import { stores, goto } from "@sapper/app";
  const { page } = stores();

  export let plant: AirtableRecord<PlantField>;

  let highlightedImage: Image;

  // toggle full-screen image based on query param
  $: if ($page.query.image) {
    highlightedImage = plant.fields.Images.find(
      (image) => image.id === $page.query.image
    );
  } else {
    highlightedImage = undefined;
  }

  function resetView() {
    const url = new URL(window.location.toString());
    url.searchParams.delete("image");
    goto(url.toString());
  }
</script>

{#if highlightedImage}
  <figure>
    <button class="back" on:click={resetView}>go back to all images</button>
    <img
      src={highlightedImage.thumbnails.full.url}
      alt={`Picture of ${plant.fields.Name}`}
      id={highlightedImage.id}
    />
    <figcaption>{highlightedImage.filename}</figcaption>
  </figure>
{:else}
  <div class="image-grid">
    {#each plant.fields.Images as image}
      <figure>
        <img
          src={image.thumbnails.large.url}
          alt={`Picture of ${plant.fields.Name}`}
          id={image.id}
        />
        <figcaption>{image.filename}</figcaption>
      </figure>
    {/each}
  </div>
{/if}

<style>
  .back {
    border: 2px solid black;
    padding: 0.5em;
    background: transparent;
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
    display: grid;
    grid-gap: 0.5em;
  }
</style>
