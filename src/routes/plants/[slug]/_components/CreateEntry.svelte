<script lang="ts">
  import { getContext } from "svelte";
  import type { AirtableRecord, PlantField } from "../../../../airtable";

  import { createDiaryMachine } from "../../../../machines/diary.machine";

  const plant = getContext<AirtableRecord<PlantField>>("plant");
  const { state, begin, submit } = createDiaryMachine(plant.id);

  let vals = {
    title: "",
    entry: "",
  };
</script>

<form>
  {#if $state.matches("idle")}
    <button on:click={begin}>Add new diary entry</button>
  {:else if $state.matches("inputting")}
    <div class="fields">
      <label for="title">Title (optional)</label>
      <input
        type="text"
        id="title"
        bind:value={vals.title}
        autocomplete="off"
      />
    </div>
    <div class="fields">
      <label for="entry">Entry (optional, markdown is ok)</label>
      <textarea id="entry" bind:value={vals.entry} />
    </div>
    <button on:click={() => submit(vals)}>Submit</button>
  {:else if $state.matches("submitting")}
    <button disabled={true}>Submitting...</button>
  {:else if $state.matches("success")}
    <button on:click={begin}>Done! Add another?</button>
  {:else}
    <button on:click={begin}>Something went wrong. Retry?</button>
  {/if}
</form>

<style>
  form {
    display: grid;
    grid-gap: 0.5em;
  }
  .fields {
    display: grid;
    grid-gap: 0.25em;
  }
  button,
  input,
  textarea {
    border: 2px solid black;
    padding: 0.5em;
    background: transparent;
    width: max-content;
  }
  label {
    font-size: 0.875em;
  }
</style>
