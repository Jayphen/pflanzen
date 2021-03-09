<script lang="ts">
  import type { AirtableRecord, PlantField } from "../../../airtable";

  export let plant: AirtableRecord<PlantField>;

  let state = "idle";

  async function water() {
    state = "watering";
    const watered: AirtableRecord<PlantField> = await fetch("blog/water.json", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: plant.id,
      }),
    }).then((r) => r.json());

    plant = watered;
    state = "idle";
  }

  const formatDate = (date: string) => {
    if (!date) return "Never";
    const _date = new Date(date);
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(
      _date
    );
  };
</script>

<span>
  - last watered {formatDate(plant.fields["Last Watered"])}
</span>

<button on:click={water} disabled={state === "watering"}>Water plant</button>

<style>
  span {
    color: #737373;
    font-size: 0.75em;
  }
  button {
    background: white;
    border: 0;
    border-radius: 0.5em;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-left: auto;
    border: 1px solid #afd2a3;
    padding: 1em;
    cursor: pointer;
  }
</style>
