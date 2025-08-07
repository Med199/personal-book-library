<script lang="ts">
	import { Button, StarRating } from '$components';
	import { getUserState, type Book } from '$components/state/user-state.svelte';
	import Icon from '@iconify/svelte';
	import Dropzone from 'svelte-file-dropzone';
	let isEditMode = $state(false);
	interface BookPageProps {
		data: {
			book: Book;
		};
	}

	let { data }: BookPageProps = $props();
	let userContext = getUserState();
	let book = $derived(userContext.allBooks.find((book) => book.id === data.book.id) || data.book);

	let title = $state(book.title);
	let author = $state(book.author);
	let description = $state(book.description || '');
	let genre = $state(book.genre || '');

	function goBack() {
		history.back();
	}

	// togle to the edit mode or save changes
	async function toggleEditModeAndSaveChanges() {
		if (isEditMode) {
			await userContext.updateBook(book.id, {
				title,
				author,
				description,
				genre
			});
		}
		isEditMode = !isEditMode;
	}

	// update the reading Status
	async function updateReadingStatus() {
		const currentDate = new Date().toISOString();
		const hasStartedReading = Boolean(book.started_reading_om);
		if (hasStartedReading) {
			await userContext.updateBook(book.id, { finished_read_on: currentDate });
		} else {
			await userContext.updateBook(book.id, { started_reading_om: currentDate });
		}
	}

	// update the book's rating
	async function updateDatabaseRating(newRating: number) {
		await userContext.updateBook(book.id, { rating: newRating });
	}

	//handle the drop to upload new books'cover
	async function handleDrop(e: CustomEvent<any>) {
		console.log('droped');
		const { acceptedFiles } = e.detail;
		if (acceptedFiles.length) {
			const file = acceptedFiles[0] as File;
			await userContext.uploadBookCover(file, book.id);
		}
	}
</script>

{#snippet bookInfo()}
	<h2 class="book-title mt-m">{book.title}</h2>
	<p class="book-author">by {book.author}</p>
	<h4 class="mt-m mb-xs semi-bold">Your rating</h4>
	<StarRating value={book.rating || 0} {updateDatabaseRating} />
	<p class="small-font">
		Click to {book.rating ? 'change' : 'give'} rating
	</p>
	{#if book.description}
		<h4 class="mt-m mb-xs semi-bold">Description</h4>
		<p class="mb-m">{book.description}</p>
	{:else}
		<h4 class="mt-m mb-xs semi-bold">No description yet.</h4>
		<button class="block mb-m" onclick={() => console.log('toggle on the edit mode')}>
			<p>Click to add one.</p>
		</button>
	{/if}
	{#if !book.finished_read_on}
		<Button isSecondary={Boolean(book.started_reading_om)} onclick={() => updateReadingStatus()}>
			{book.started_reading_om ? 'I finished reading this book!' : 'I started reading this book'}
		</Button>
	{/if}
	{#if book.genre}
		<h4 class="mt-m mb-xs semi-bold">Genre</h4>
		<p>{book.genre}</p>
	{/if}
{/snippet}
{#snippet editFields()}
	<form>
		<input class="input input-title mt-m mb-xs" bind:value={title} type="text" name="title" />
		<div class="input-author">
			<p>by</p>
			<input class="input" bind:value={author} type="text" name="author" />
		</div>
		<h4 class="mt-m mb-xs semi-bold">Your rating</h4>
		<StarRating value={book.rating || 0} {updateDatabaseRating} />
		<p class="small-font">
			Click to {book.rating ? 'change' : 'give'} rating
		</p>
		<h4 class="mt-m mb-xs semi-bold">Description</h4>
		<textarea
			class="textarea mb-m"
			name="description"
			bind:value={description}
			placeholder={'Give a description.'}
		></textarea>
		{#if !book.finished_read_on}
			<Button isSecondary={Boolean(book.started_reading_om)} onclick={() => updateReadingStatus()}>
				{book.started_reading_om ? 'I finished reading this book!' : 'I started reading this book'}
			</Button>
		{/if}
		<h4 class="mt-m mb-xs semi-bold">Genre</h4>
		<input class="input" bind:value={genre} type="text" name="genre" />
	</form>
{/snippet}
<div class="book-page">
	<button onclick={goBack} aria-label="Go back">
		<Icon icon="ep:back" width={'40'} />
	</button>
	<div class="book-container">
		<div class="book-info">
			{#if isEditMode}
				{@render editFields()}
			{:else}
				{@render bookInfo()}
			{/if}

			<div class="buttons-container">
				<Button isSecondary={true} onclick={() => toggleEditModeAndSaveChanges()}
					>{isEditMode ? 'Save changes' : 'Edit'}</Button
				>
				<Button isDanger={true} onclick={() => console.log('delete')}>Delete book</Button>
			</div>
		</div>
		<div class="book-cover">
			{#if book.cover_image}
				<img src={book.cover_image} alt="" />
			{:else}
				<Dropzone
					on:drop={handleDrop}
					multiple={false}
					accept="image/*"
					maxSize={5 * 1024 * 1024}
					containerClasses={'dropzone-cover'}
				>
					<Icon icon="bi:camera-fill" width={'40'} />
					<p>Add book cover</p>
				</Dropzone>
			{/if}
		</div>
	</div>
</div>

<style>
	.book-container {
		display: flex;
		justify-content: flex-start;
	}

	.book-info {
		width: 50%;
	}

	.book-cover {
		width: 40%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid black;
		border-radius: 15px;
		min-height: 400px;
		max-width: 450px;
		margin-left: 80px;
	}

	.book-cover img {
		object-fit: cover;
		width: 100%;
		height: 100%;
		border-radius: inherit;
	}
	.input {
		padding: 8px 4px;
		width: 100%;
	}

	.textarea {
		width: 100%;
	}

	.input-title {
		font-size: 60px;
		font-weight: bold;
		font-family: 'EB Garamond', serif;
	}

	.input-author {
		display: flex;
		align-items: center;
	}
	.input-author p {
		margin-right: 8px;
	}
	.buttons-container {
		margin-top: 40px;
	}
	:global(.dropzone-cover) {
		height: 100%;
		border-radius: 15px !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: center !important;
		align-items: center !important;
		border: unset !important;
		cursor: pointer;
		border-style: solid !important;
	}
</style>
