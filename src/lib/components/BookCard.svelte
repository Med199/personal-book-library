<script lang="ts">
	import StarRating from './StarRating.svelte';
	import type { Book } from './state/user-state.svelte';

	interface BookCardProps {
		book: Book;
	}
	let { book }: BookCardProps = $props();
	let bookStatus = $derived(
		book.finished_read_on ? 'Finished' : book.started_reading_om ? 'Started' : 'Not Started'
	);
</script>

<a class="book-card" href={`/private/books/${book.id}`}>
	<div class="book-status">
		<span>{bookStatus}</span>
	</div>
	<div class="book-cover">
		{#if book.cover_image}
			<img src={book.cover_image} alt="" />
		{/if}
	</div>
	<div class="book-info">
		<h4>{book.title}</h4>
		<p class="mb-s">{book.author}</p>
		<StarRating isReadOnly={true} value={book.rating || 0} />
	</div>
</a>

<style>
	.book-card {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		min-width: 360px;
		height: 300px;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgb(0, 0, 0, 0.1);
		color: white;
		text-decoration: none;
		text-align: left;
		max-width: 450px;
		z-index: 5;
	}
	.book-cover {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.book-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		border-radius: 12px;
	}
	.book-info {
		background: rgba(0, 0, 0, 0.4);
		height: 100%;
		width: 100%;
		padding: 60px 16px 0 16px;
		border-radius: 12px;
	}
	.book-info h4 {
		font-family: 'EB Garamong', serif;
		font-size: 35px;
	}
	.book-info p {
		font-size: 14px;
		font-weight: 400;
		font-style: italic;
	}
	.book-status {
		position: absolute;
		top: 16px;
		right: 0;
		padding: 4px 8px;
		width: auto;
		background-color: rgba(4, 59, 92, 0.7);
	}
</style>
