import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const errors: Record<string, string> = {};

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.email = 'Please enter a valid email.';
        }

        // Password Validation
        if (!password || password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (Object.keys(errors).length > 0) {
            return fail(400, {
                errors,
                values: { success: 'false', email, password }
            });
        }
        // Sign in Process
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data.user) {
            return fail(400, {
                errors,
                values: { success: 'false', email }
            });
        } else

            redirect(303, "/private/dashboard");

    }
} satisfies Actions;