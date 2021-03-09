<script lang="ts">
  import Nav from "../components/Nav.svelte";

  export let segment: string;
</script>

<div class="layout">
  <Nav {segment} />

  <main>
    <div class="content">
      <slot />
    </div>
  </main>
</div>

<style>
  :global(html, body, #sapper) {
    height: 100%;
  }
  .layout {
    display: grid;
    height: 100%;
    grid-template-rows: auto 1fr;
  }
  main {
    position: relative;
    background-color: #afd2a3;
    box-sizing: border-box;
  }
  .content {
    max-width: 56em;
    margin: 0 auto;
    padding: 2em;
  }
</style>
