import { createMachine } from "@xstate/fsm";
import { useMachine } from "xstate-svelte/dist/fsm";
import { fetcher } from "../lib/fetcher";

interface DiaryFields {
  title: string;
  entry: string;
}

interface Context {
  plantId: string;
}
type Event =
  | { type: "START" }
  | { type: "SUBMIT"; vals: DiaryFields }
  | { type: "SUCCESS" }
  | { type: "FAIL" }
  | { type: "RETRY" };

type State =
  | { value: "idle"; context: Context }
  | { value: "inputting"; context: Context }
  | { value: "submitting"; context: Context }
  | { value: "success"; context: Context }
  | { value: "fail"; context: Context };

export const createDiaryMachine = (plantId: string) => {
  const diaryMachine = createMachine<Context, Event, State>({
    id: "diary",
    context: { plantId },
    initial: "idle",
    states: {
      idle: {
        on: {
          START: "inputting",
        },
      },
      inputting: {
        on: {
          SUBMIT: "submitting",
        },
      },
      submitting: {
        entry: ["submit"],
        on: {
          SUCCESS: {
            target: "success",
          },
          FAIL: {
            target: "fail",
          },
        },
      },
      success: {},
      fail: { on: { RETRY: "inputting" } },
    },
  });

  const { state, send } = useMachine(diaryMachine, {
    actions: {
      submit: async (context, event) => {
        if (event.type === "SUBMIT") {
          let authed = await post(context.plantId, event.vals);

          if (authed.status === 200) {
            send({ type: "SUCCESS" });
          } else {
            send({ type: "FAIL" });
          }
        }
      },
    },
  });

  return {
    state,
    begin: () => send("START"),
    submit: (vals: DiaryFields) => {
      console.log("submitting", vals);
      send({ type: "SUBMIT", vals });
    },
  };
};

function post(plantId: string, vals: DiaryFields) {
  return fetcher(`api/plants/${plantId}/diary.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vals),
  });
}
