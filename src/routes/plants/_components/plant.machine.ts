import { createMachine, assign } from "@xstate/fsm";
import { useMachine } from "xstate-svelte/dist/fsm";
import { getContext } from "svelte";
import type { AirtableRecord, PlantField } from "../../../airtable";
import { fetcher } from "../../../lib/fetcher";
import { plantsContext, PlantsStore } from "../../../stores/plants.store";

export const createPlantMachine = (plant: AirtableRecord<PlantField>) => {
  const plants = getContext<PlantsStore>(plantsContext);
  let $plants: Map<string, AirtableRecord<PlantField>>;

  const unsubscribe = plants.subscribe((store) => ($plants = store));

  const plantMachine = createMachine({
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
          FAIL: {
            target: "error",
          },
        },
      },
      watered: {},
      error: {
        on: {
          FETCH: "loading",
        },
      },
    },
  });

  const { state, send } = useMachine(plantMachine, {
    actions: {
      load: async () => {
        let watered: AirtableRecord<PlantField> = await fetcher(
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
        );

        if (watered.status === 200) {
          watered = await watered.json();

          send({ type: "RESOLVE", data: watered });
        } else {
          send({ type: "FAIL" });
        }
      },
    },
  });

  return {
    unsubscribe,
    state,
    init: () => send("INIT"),
    water: () => send("FETCH"),
  };
};

function today() {
  const _date = new Date();
  return `${_date.getFullYear()}-${(_date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${_date.getDate().toString().padStart(2, "0")}`;
}
