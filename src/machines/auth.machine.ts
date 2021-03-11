import { createMachine } from "@xstate/fsm";
import { useMachine } from "xstate-svelte/dist/fsm";
import { fetcher } from "../lib/fetcher";

interface Context {}
type Event =
  | { type: "ALREADY_AUTHED" }
  | { type: "NOT_AUTHED" }
  | { type: "START" }
  | { type: "SUBMIT"; secret: string }
  | { type: "SUCCESS" }
  | { type: "RETRY" }
  | { type: "FAIL" };

export const createAuthMachine = () => {
  const authMachine = createMachine<Context, Event>({
    id: "auth",
    initial: "init",
    states: {
      init: {
        on: {
          ALREADY_AUTHED: "success",
          NOT_AUTHED: "idle",
        },
      },
      idle: {
        on: {
          START: "authing",
        },
      },
      authing: {
        on: {
          SUBMIT: "loading",
        },
      },
      loading: {
        entry: ["load"],
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
      fail: { on: { RETRY: "authing" } },
    },
  });

  const { state, send } = useMachine(authMachine, {
    actions: {
      load: async (_, event) => {
        if (event.type === "SUBMIT") {
          let authed = await auth(event.secret);

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
    init: (authed: boolean) => {
      send(authed ? "ALREADY_AUTHED" : "NOT_AUTHED");
    },
    auth: (secret: string) => {
      send({ type: "SUBMIT", secret });
    },
    retry: () => send("RETRY"),
    begin: () => send("START"),
  };
};

function auth(secret: string) {
  return fetcher("api/auth.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret }),
  });
}
