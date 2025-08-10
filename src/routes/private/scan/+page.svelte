<script lang="ts">
	import Button from '$components/Button.svelte';
	import { getUserState, type OpenAiBook } from '$components/state/user-state.svelte';
	import { convertFileToBase64 } from '$lib/utils/openai-helpers';
	import Icon from '@iconify/svelte';
	import { error } from '@sveltejs/kit';
	import Dropzone from 'svelte-file-dropzone';
	import { get } from 'svelte/store';

	let userContext = getUserState();
	let isLoading = $state(false);
	let messageError = $state('');
	let recognizedBooks = $state<OpenAiBook[]>([]);
	let booksSuccefullyAded = $state(false);

	async function handleDrop(e: CustomEvent<any>) {
		const { acceptedFiles } = e.detail;

		if (acceptedFiles.length) {
			isLoading = true;
			const fileToSendToAi = acceptedFiles[0];
			const base64String = await convertFileToBase64(fileToSendToAi);
			try {
				const response = await fetch('/api/scan', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ base64: base64String })
				});
				isLoading = false;
				const result = (await response.json()) as { bookArray: OpenAiBook[] };
				recognizedBooks = result.bookArray;
				console.log(result);
			} catch (error) {
				messageError = 'Error processing the uploaded file';
			}
		} else {
			messageError = 'Could not upload given file';
		}
	}

	function removeBook(index: number) {
		recognizedBooks.splice(index, 1);
	}
	async function addAllBooks() {
		isLoading = true;
		try {
			await userContext.addBooksToLibrary(recognizedBooks);
			isLoading = false;
			booksSuccefullyAded = true;
		} catch (error: any) {
			messageError = error.message;
		}
	}
</script>

<h2 class="mt-m mb-l">Take a picture to add books</h2>
{#if recognizedBooks.length === 0}
	<div class="upload-area">
		<div class="upload-container">
			{#if messageError}
				<h4 class="text-center mb-s upload-error">{messageError}</h4>
			{/if}
			{#if isLoading}
				<div class="spinner-container">
					<div class="spinner"></div>
					<p>Preccesing Your Image</p>
				</div>
			{:else}
				<Dropzone
					on:drop={handleDrop}
					multiple={false}
					accept="image/*"
					maxSize={10 * 1024 * 1024}
					containerClasses={'dropzone-cover dropzone-books'}
				>
					<Icon icon="bi:camera-fill" width={'48px'} />
					<p>Drag a picture or click to select a file</p>
				</Dropzone>
			{/if}
		</div>
	</div>
{:else if !booksSuccefullyAded}
	<div class="found-book">
		<table class="book-list mb-m">
			<thead>
				<tr>
					<th>Title</th>
					<th>Author</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each recognizedBooks as book, i}
					<tr>
						<td>{book.bookTitle}</td>
						<td>{book.author}</td>
						<td>
							<button
								type="button"
								aria-label="Remove book"
								class="remove-book"
								onclick={() => removeBook(i)}
							>
								<Icon icon="streamline:delete-1-solid" width={'24'} />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<Button onclick={() => addAllBooks()}>Add all books</Button>
	</div>
{:else}
	<h4>The selected {recognizedBooks.length} books have been added to your library</h4>
	<Button href="/private/dashboard">Go to your library</Button>
{/if}

<style>
	.book-list {
		width: 800px;
		background-color: white;
		border-radius: 8px;
		border-collapse: collapse;
	}

	.book-list th {
		font-size: 22px;
		text-align: left;
		padding: 8px 16px;
		border-bottom: 3px solid black;
	}

	.book-list td {
		padding: 12px 16px;
		border-bottom: 1px solid rgb(205, 205, 205);
		font-size: 22px;
	}

	.book-list tr:last-child td {
		border-bottom: none;
	}
	:global(.remove-book svg) {
		color: red;
	}

	.upload-error {
		color: rgb(131, 0, 0);
	}

	.upload-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.upload-container {
		width: 600px;
	}

	.spinner-container {
		display: flex;
	}

	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-left-color: black;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: inline-block;
		margin-right: 8px;
		animation: spin 0.5s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	:global(.dropzone-books) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 600px !important;
		min-height: 400px !important;
		flex: 0 !important;
		cursor: pointer;
	}
</style>
