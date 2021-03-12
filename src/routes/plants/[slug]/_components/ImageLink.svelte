<script lang="ts">
  import { stores, goto } from "@sapper/app";
  const { page } = stores();
  export let id: string;

  const fullUrl = new URL(
    $page.path,
    (process.env.NODE_ENV === "production" ? "https://" : "http://") +
      $page.host
  );

  function gotoFullImage() {
    fullUrl.searchParams.set("image", id);
    goto(fullUrl.toString());
  }
</script>

<button on:click={gotoFullImage}>View photo full-size</button>

<style>
  button {
    background: transparent;
    padding: 0;
    display: inline;
    border: 0;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
