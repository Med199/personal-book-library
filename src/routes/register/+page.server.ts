import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const passwordConfirmation = formData.get("confirm") as string;

        const errors: Record<string, string> = {};

        // Name Validation
        if (!name || name.trim().length < 3) {
            errors.name = 'Name must be at least 2 characters ';
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.email = 'Please enter a valid email.';
        }

        // Password Validation
        if (!password || password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        // Password Match
        if (password !== passwordConfirmation) {
            errors.confirm = 'Password do not match';
        }

        if (Object.keys(errors).length > 0) {
            return fail(400, {
                errors,
                values: { name, email }
            });
        }
        //Registration Start through supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error || !data.user) {
            console.log('There is an Error');
            console.log(error);
            return fail(400, {
                errors,
                values: { name, email }
            });
        } else

            redirect(303, "/private/dashboard");

    }
} satisfies Actions;