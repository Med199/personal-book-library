<script>
	import { Button } from '$components';

	let { isRegistration, form } = $props();
</script>

<div class="default-margin auth-container">
	<h1 class="mb-l">{isRegistration ? 'Register' : 'login'}</h1>
	<div class="form-and-social-login">
		<form class="auth-form" method="POST">
			<div class="input-fields">
				{#if isRegistration}
					<input type="text" name="name" placeholder="Name" required value={form?.values.name} />
				{/if}
				<!-- error handling of field name-->
				{#if form?.errors?.name}
					<div class="auth-error">{form.errors.name}</div>
				{/if}

				<input type="email" name="email" placeholder="Email" required value={form?.values.email} />
				<!--error handling for email-->
				{#if form?.errors?.email}
					<div class="auth-error">{form.errors.email}</div>
				{/if}

				<!--error handling for password-->
				<input type="password" id="password" name="password" placeholder="Password" required />
				{#if form?.errors?.password}
					<div class="auth-error">{form.errors.password}</div>
				{/if}

				{#if isRegistration}
					<input
						type="password"
						id="confirm"
						name="confirm"
						placeholder="Confirm Password"
						required
					/>
				{/if}
				<!--error handling for password confirmation-->
				{#if form?.errors?.confirm}
					<div class="auth-error">{form.errors.confirm}</div>
				{/if}
			</div>

			<Button type="submit">{isRegistration ? 'Register' : 'Login'}</Button>

			{#if isRegistration}
				<p class="auth-hint mt-s">
					Already have an account?
					<a href="/login">Log In</a>
				</p>
			{:else}
				<p class="auth-hint mt-s">
					Do not have an account yet?
					<a href="/register">Register</a>
				</p>
			{/if}
		</form>
		<div class="social-login">
			<!--Add a button here later-->
		</div>
	</div>
</div>

<style>
	.auth-container {
		margin-top: 40px;
	}
	.form-and-social-login {
		display: flex;
	}
	.auth-form {
		display: flex;
		flex-direction: column;
		align-items: start;
		border-right: 1px solid gray;
		padding-right: 80px;
		width: 40%;
	}
	.auth-form input {
		width: 100%;
		margin-top: 25px;
	}
	.input-fields {
		margin-bottom: 30px;
	}
	.social-login {
		padding-left: 0px;
		width: 40%;
	}
	.auth-hint {
		font-size: 16px;
		color: gray;
	}
	.auth-error {
		color: rgb(214, 21, 21);
	}
</style>
