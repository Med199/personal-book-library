import type { PageLoad } from './$types';
import { error as svelteError } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent, params }) => {
    const { supabase } = await parent();
    const { bookId } = params;

    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

    if (data) {
        return { book: data };
    }
    throw svelteError(404, 'Book not found');
};
