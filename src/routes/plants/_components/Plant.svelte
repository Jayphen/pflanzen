<script lang="ts">
  import { onDestroy } from "svelte";
  import { useMachine } from "xstate-svelte/dist/fsm";

  import type { AirtableRecord, PlantField } from "../../../airtable";
  import { fetcher } from "../../../lib/fetcher";
  import LastWatered from "./LastWatered.svelte";
  import { createPlantMachine } from "./plant.machine";
  import { stores } from "@sapper/app";
  const { page } = stores();

  export let plant: AirtableRecord<PlantField>;

  const { plantMachine, unsubscribe } = createPlantMachine(plant);

  const { state, send } = useMachine(plantMachine, {
    actions: {
      load: async () => {
        const watered: AirtableRecord<PlantField> = await fetcher(
          "plants/water.json",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: plant.id,
            }),
          }
        ).then((r) => r.json());

        send({ type: "RESOLVE", data: watered });
      },
    },
  });

  send("INIT");

  function water() {
    send("FETCH");
  }

  onDestroy(unsubscribe);
</script>

<div class="plant">
  <div class="media">
    {#if plant.fields.Images}
      <img
        src={plant.fields.Images[0].thumbnails.small.url}
        alt={`${plant.fields.Name}'s latest image`}
      />
    {/if}
    {plant.fields.Name}
  </div>
  <LastWatered state={$state} {water} />
</div>

<style>
  .plant {
    padding: 1em;
    background: white;
    display: grid;
    align-items: center;
    border-radius: 1em;
    grid-template-columns: auto 1fr auto;
  }
  .media {
    display: flex;
    align-items: center;
  }

  img {
    padding-right: 1em;
  }
</style>
