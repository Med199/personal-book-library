<script lang="ts">
	import BookCard from './BookCard.svelte';

	interface categorieProps {
		categorieDescription: String;
		booksToDisplay: Book[];
	}
	let { categorieDescription, booksToDisplay } = $props();
</script>

<div class="categorie-container">
	<h3 class="mb-s categorie-description">{categorieDescription}</h3>
	<div class="booksContainer">
		{#each booksToDisplay as book}
			<BookCard {book} />
		{/each}
	</div>
</div>

<style>
	.categorie-container {
		margin-bottom: 50px;
	}
	.booksContainer {
		margin-top: 10px;
		background-color: rgba(240, 240, 240, 0.814);
		border-radius: 4px;
		padding: 20px 30px 20px 30px; /* top, right, bottom, left */
		display: flex;
		flex-wrap: nowrap;
		gap: 20px;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-behavior: smooth;
		z-index: -1;
	}

	.booksContainer::-webkit-scrollbar {
		height: 8px;
	}
	.booksContainer::-webkit-scrollbar-thumb {
		background: #757575;
		border-radius: 4px;
		cursor: pointer;
	}
	.categorie-description {
		font-size: 40px;
		font-weight: 500;
	}
</style>
