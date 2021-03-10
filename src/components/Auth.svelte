<script lang="ts">
  import { createMachine } from "@xstate/fsm";
  import { useMachine } from "xstate-svelte/dist/fsm";
  import { stores } from "@sapper/app";
  const { session } = stores();

  import { fetcher } from "../lib/fetcher";

  let secret: string;

  function auth() {
    return fetcher("auth.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
  }

  const authMachine = createMachine({
    id: "auth",
    initial: "init",
    states: {
      init: {
        on: {
          AUTHED: "success",
          UNAUTHED: "idle",
        },
      },
      idle: {
        on: {
          AUTH: "authing",
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
      load: async () => {
        let authed = await auth();

        if (authed.status === 200) {
          send({ type: "SUCCESS" });
        } else {
          send({ type: "FAIL" });
        }
      },
    },
  });

  send($session.auth ? "AUTHED" : "UNAUTHED");
</script>

<div class="auth" class:active={$state.matches("authing")}>
  {#if $state.matches("idle")}
    <button on:click={() => send("AUTH")}>are you me?</button>
  {:else if $state.matches("authing")}
    <form>
      <label for="secret">Secret password:</label>
      <input
        id="secret"
        bind:value={secret}
        type="password"
        autocomplete="current-password"
      />
      <button on:click={() => send("SUBMIT")}>auth</button>
    </form>
  {:else if $state.matches("loading")}
    <button disabled={true}>authing...</button>
  {:else if $state.matches("success")}
    You are logged in!
  {:else}
    <button on:click={() => send("RETRY")}>Try again?</button>
  {/if}
</div>

<style>
  .active {
    width: 100%;
  }
  button,
  input {
    border: 2px solid black;
    padding: 0.5em;
    background: transparent;
  }
  label {
    font-size: 0.875em;
  }
</style>
