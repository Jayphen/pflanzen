<script lang="ts" context="module">
  const formatDate = (date: string) => {
    if (!date) return "Never";
    const _date = new Date(date);
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(
      _date
    );
  };

  function today() {
    const _date = new Date();
    return `${_date.getFullYear()}-${(_date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${_date.getDate().toString().padStart(2, "0")}`;
  }
</script>

<script lang="ts">
  import type { AirtableRecord, PlantField } from "../../../airtable";
  import { createMachine, assign } from "@xstate/fsm";
  import { useMachine } from "xstate-svelte/dist/fsm";
  import { getContext } from "svelte";
  import { plantsContext } from "../../../stores/plants.store";
  import type { PlantsStore } from "../../../stores/plants.store";

  export let plant: AirtableRecord<PlantField>;
  const plants = getContext<PlantsStore>(plantsContext);

  const fetchMachine = createMachine({
    id: "fetch",
    initial: "boot",
    context: {
      data: plant,
      plants: $plants,
    },
    states: {
      boot: {
        on: {
          // use an explicit INIT event to determine whether we should
          // start out in the 'watered' state
          // todo: maybe this is bad. "just watered" and "already watered" are
          // maybe 2 different states
          INIT: [
            {
              cond: () => plant.fields["Last Watered"] === today(),
              target: "watered",
            },
            { target: "idle" },
          ],
        },
      },
      idle: {
        on: {
          FETCH: "loading",
        },
      },
      loading: {
        entry: ["load"],
        on: {
          RESOLVE: {
            target: "watered",
            actions: assign({
              data: (_, event) => {
                plants.patch(event.data);

                return event.data;
              },
            }),
          },
        },
      },
      watered: {},
    },
  });
  const { state, send } = useMachine(fetchMachine, {
    actions: {
      load: async () => {
        const watered: AirtableRecord<PlantField> = await fetch(
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

  let fields: PlantField;
  $: ({
    context: {
      data: { fields },
    },
  } = $state);

  function water() {
    send("FETCH");
  }

  console.log($state);
</script>

<span>
  - last watered {$state.matches("watered")
    ? "Today"
    : formatDate(fields["Last Watered"])}
</span>

{#if $state.matches("watered")}
  <span class="watered">💦 Watered!</span>
{:else if $state.matches("loading")}
  <button disabled={true}>Watering</button>
{:else}
  <button on:click={water}>Water plant</button>
{/if}

<style>
  span {
    color: #737373;
    font-size: 0.75em;
  }
  .watered {
    margin-left: auto;
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
