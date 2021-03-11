<script lang="ts">
  import { stores } from "@sapper/app";
  const { session } = stores();

  import { createAuthMachine } from "../machines/auth.machine";

  let secret: string;

  const { init, state, begin, auth, retry } = createAuthMachine();

  init($session.auth);
</script>

<div class="auth" class:active={$state.matches("authing")}>
  {#if $state.matches("idle")}
    <button on:click={begin}>are you me?</button>
  {:else if $state.matches("authing")}
    <form>
      <label for="secret">Secret password:</label>
      <input
        id="secret"
        bind:value={secret}
        type="password"
        autocomplete="current-password"
      />
      <button on:click={() => auth(secret)}>auth</button>
    </form>
  {:else if $state.matches("loading")}
    <button disabled={true}>authing...</button>
  {:else if $state.matches("success")}
    You are logged in!
  {:else}
    <button on:click={retry}>Try again?</button>
  {/if}
</div>

<style>
  @media (max-width: 768px) {
    .active {
      width: 100%;
    }
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
