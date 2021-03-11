<script lang="ts">
  import type { AirtableRecord, PlantField } from "../../../../airtable";

  export let plant: AirtableRecord<PlantField>;
</script>

<section class="notes">
  <h2>Notes</h2>
  {@html plant.fields.Notes}
</section>

<style>
  .notes {
    background: white;
    padding: 1em;
    border-radius: 1em;
    font-size: 0.875em;
  }
  .notes :global(*) {
    margin: 0;
    padding: 0;
  }
  .notes :global(* + *) {
    margin-top: 1em;
  }
</style>
