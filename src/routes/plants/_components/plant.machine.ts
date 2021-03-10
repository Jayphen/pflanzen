import { createMachine, assign } from "@xstate/fsm";
import { getContext } from "svelte";
import type { AirtableRecord, PlantField } from "../../../airtable";
import { plantsContext, PlantsStore } from "../../../stores/plants.store";

export const createPlantMachine = (plant: AirtableRecord<PlantField>) => {
  const plants = getContext<PlantsStore>(plantsContext);
  let $plants: Map<string, AirtableRecord<PlantField>>;

  const unsubscribe = plants.subscribe((store) => ($plants = store));

  return {
    unsubscribe,
    plantMachine: createMachine({
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
    }),
  };
};

function today() {
  const _date = new Date();
  return `${_date.getFullYear()}-${(_date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${_date.getDate().toString().padStart(2, "0")}`;
}
