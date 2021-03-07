<script context="module" lang="ts">
	export function preload() {
		return this.fetch(`blog.json`)
			.then((r: { json: () => any }) => r.json())
			.then((fields: { Name: string }) => {
				return { fields };
			});
	}
</script>

<script lang="ts">
	export let fields: { Name: string }[];
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<ul>
	{#each fields as field}
		<!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event -->
		<li>{field.Name}</li>
	{/each}
</ul>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
	}
</style>
