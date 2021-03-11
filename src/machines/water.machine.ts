import { createMachine, assign } from "@xstate/fsm";
import { useMachine } from "xstate-svelte/dist/fsm";
import { getContext } from "svelte";
import type { AirtableRecord, PlantField } from "../airtable";
import { fetcher } from "../lib/fetcher";
import { plantsContext, PlantsStore } from "../stores/plants.store";

interface Context {
  plant: AirtableRecord<PlantField>;
}

type Event =
  | { type: "INIT" }
  | { type: "RESOLVE"; data: Context["plant"] }
  | { type: "FETCH" }
  | { type: "FAIL" };

type State =
  | { value: "boot"; context: Context }
  | { value: "idle"; context: Context }
  | { value: "loading"; context: Context }
  | { value: "watered"; context: Context }
  | { value: "error"; context: Context };

export const createWaterMachine = (plant: Context["plant"]) => {
  const plants = getContext<PlantsStore>(plantsContext);

  const waterMachine = createMachine<Context, Event, State>({
    id: "fetch",
    initial: "boot",
    context: {
      plant,
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
            actions: [
              (_, event) => {
                if (event.type === "RESOLVE") {
                  plants.patch(event.data);
                }
              },
              assign({
                plant: (_, event) => event.data,
              }),
            ],
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

  const { state, send } = useMachine(waterMachine, {
    actions: {
      load: async () => {
        const _watered = await fetcher("api/plants/water.json", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: plant.id,
          }),
        });

        if (_watered.status === 200) {
          const watered = await _watered.json();

          send({ type: "RESOLVE", data: watered });
        } else {
          send({ type: "FAIL" });
        }
      },
    },
  });

  return {
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
