<script lang="ts">
  import { Shortcodes } from "svelte-shortcodes";
  import ImageLink from "./ImageLink.svelte";

  /* content of the snippet */
  export let content: string;

  // airtable escapes the opening [
  $: content = content.replace("\\[", "[").replace("]\\", "]");

  // airtable doesn't let us grab just the last image ID on the new image
  // automation; it instead returns a comma-delimited list. The last item
  // in the list is the latest image Id, so let's grab it
  $: content = content.replace(/id=(?:\w+, )+(?<id>\w+)/gm, "id=$1");

  const components = {
    image: ImageLink,
  };
</script>

<Shortcodes markup={content} {components} />
