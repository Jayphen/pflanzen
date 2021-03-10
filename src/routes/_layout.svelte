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
  :global(html) {
    --c-bg: #f3f8ef;
  }
  @media (max-width: 768px) {
    :global(body) {
      font-size: 14px;
    }
  }
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
    background-color: var(--c-bg);
    box-sizing: border-box;
  }
  .content {
    max-width: 56em;
    margin: 0 auto;
    padding: 1em;
  }
</style>
