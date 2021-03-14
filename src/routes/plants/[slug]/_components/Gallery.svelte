<script lang="ts">
  import type { AirtableRecord, Image, PlantField } from "../../../../airtable";
  import { stores, goto } from "@sapper/app";
  const { page } = stores();

  // disabling animation until I have time to figure out how to prevent it
  // running when exiting the page

  /* import { crossfade, scale } from "svelte/transition"; */

  /* const [send, receive] = crossfade({ */
  /*   duration: 300, */
  /*   fallback: scale, */
  /* }); */

  export let plant: AirtableRecord<PlantField>;

  let highlightedImage: Image;
  /* let lastHighlighted: string = $page.query.image?.toString(); */

  // toggle full-screen image based on query param
  // this also enables sharing a link with a full image view
  $: if ($page.query.image) {
    highlightedImage = plant.fields.Images.find(
      (image) => image.id === $page.query.image
    );
    /* lastHighlighted = highlightedImage.id; */
  } else {
    highlightedImage = undefined;
  }

  // resetting the search params will transition back to regular view
  function resetView() {
    const url = new URL(window.location.toString());
    url.searchParams.delete("image");
    goto(url.toString(), { replaceState: true });
  }

  function highlight(image: Image) {
    // a little hackery - load the image in the background
    // before transitioning to it (to make this slightly less janky)
    const img = new Image();
    img.src = image.thumbnails.full.url;

    img.onload = () => {
      const url = new URL(window.location.toString());
      url.searchParams.set("image", image.id);
      goto(url.toString(), { replaceState: true });
      /* lastHighlighted = image.id; */
    };
  }
</script>

<div class="container">
  {#if highlightedImage}
    <figure class="highlighted-view">
      <button class="back" on:click={resetView}>go back to all images</button>
      <img
        src={highlightedImage.thumbnails.full.url}
        alt={`Picture of ${plant.fields.Name}`}
        id={highlightedImage.id}
        on:click={resetView}
      />
      <figcaption>{highlightedImage.filename}</figcaption>
    </figure>
  {:else}
    <div class="image-grid">
      {#each plant.fields.Images as image (image.id)}
        <figure>
          <img
            src={image.thumbnails.large.url}
            alt={`Picture of ${plant.fields.Name}`}
            id={image.id}
            on:click={() => highlight(image)}
          />
          <figcaption>{image.filename}</figcaption>
        </figure>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    position: relative;
  }
  .highlighted-view,
  .image-grid {
    position: absolute;
    left: 0;
    top: 0;
  }
  .back {
    border: 2px solid black;
    padding: 0.5em;
    background: transparent;
  }
  .image-grid {
    width: 100%;
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(2, minmax(auto, 1fr));
  }
  img {
    width: 100%;
    object-fit: fill;
    cursor: pointer;
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
