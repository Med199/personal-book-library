<script>
	import { Button } from '$components';
	import HeaderLogo from '$assets/app-logo.svg';
	import { getUserState } from '$components/state/user-state.svelte';

	let userContext = getUserState();
	let { user, userName } = $derived(userContext);
</script>

<header>
	<a href="/private/dashboard">
		<img class="logo" src={HeaderLogo} alt="go to home page" />
	</a>
	<nav>
		{#if !user}
			<ul>
				<li>
					<Button href="/register" isMenu={true}>Create Account</Button>
				</li>
				<li>
					<Button href="/login" isMenu={true} isSecondary={true}>Login</Button>
				</li>
			</ul>
		{:else}
			<ul>
				<li class="userName">
					{userName}
				</li>
				<li>
					<Button onclick={() => userContext.logout()} isMenu={true} isSecondary={false}
						>Logout</Button
					>
				</li>
			</ul>
		{/if}
	</nav>
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 2.5vw;
	}
	ul {
		display: flex;
		column-gap: 24px;
		align-items: center;
	}
	.logo {
		height: 72px;
	}
	.userName {
		font-size: 30px;
		font-weight: 500;
	}
</style>
