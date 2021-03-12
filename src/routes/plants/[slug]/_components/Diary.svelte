<script lang="ts">
  // using automations, a diary entry is added when:
  // - a plant is added
  // - a plant is watered
  // The free plan has 100 automations/month. This may exceed the limit.
  // To avoid this, we could handle the automation in this app instead

  // also, automations run after a slight delay, so results don't show immediately

  import { format } from "date-fns";
  import type { AirtableRecord } from "../../../../airtable";
  import CreateEntry from "./CreateEntry.svelte";
  import Shortcodes from "./Shortcodes.svelte";

  export let diary: AirtableRecord<any>[];
</script>

<div class="diary">
  {#each diary as entry}
    <div class="diary-entry">
      <small>{format(new Date(entry.createdTime), "dd/MM/yyyy")}</small>
      {#if entry.fields.Title}
        <h3>{entry.fields.Title}</h3>
      {/if}
      <Shortcodes content={entry.fields.Entry} />
    </div>
  {/each}

  <CreateEntry />
</div>

<style>
  .diary {
    background: white;
    padding: 1em;
    border-radius: 1em;
    display: grid;
    grid-gap: 0.5em;
  }
  .diary-entry > :global(*) {
    display: inline;
    margin: 0;
    padding: 0;
  }
  .diary-entry small {
    color: #4caf50;
  }
  .diary-entry h3 {
    font-weight: bold;
  }
</style>
