
import { goto } from "$app/navigation";
import type { SupabaseClient, Session, User } from "@supabase/supabase-js";
import { getContext, setContext } from "svelte";
interface UserStateProps {
    session: Session | null;
    supabase: SupabaseClient | null;
    user: User | null;
}
export interface Book {
    author: string | null
    cover_image: string | null
    created_at: string
    description: string | null
    finished_read_on: string | null
    genre: string | null
    id: number
    rating: number | null
    started_reading_om: string | null
    title: string | null
    user_id: string
}

// restrict the book fields that can not be changed 
type updatabkeBookfields = Omit<Book, "id" | "user_id" | "created_at">;
export class UserState {
    session = $state<Session | null>(null);
    supabase = $state<SupabaseClient | null>(null);
    user = $state<User | null>(null);
    allBooks = $state<Book[]>([]);
    userName = $state<string | null>(null);

    constructor(data: UserStateProps) {
        this.updateState(data);
    }

    updateState(data: UserStateProps) {
        this.session = data.session;
        this.supabase = data.supabase;
        this.user = data.user;
        this.fetchUserData();
    }
    async fetchUserData() {
        if (!this.user || !this.supabase) {
            return;
        }

        const [booksResponse, userNameResponse] = await Promise.all([
            this.supabase.from("books").select("*").eq("user_id", this.user.id),
            this.supabase.from("user_names").select("name").eq("user_id", this.user.id).single()
        ]);
        if (booksResponse.error || !booksResponse.data || userNameResponse.error || !userNameResponse.data) {
            console.log("Error while fetching the user's Data ");
            console.log(`BooksError:${booksResponse.error}, userName error:${userNameResponse.error}`);
        } else {
            this.allBooks = booksResponse.data;
            this.userName = userNameResponse.data.name;
        }
    }

    // Get highest rated books
    getHighestRatedBooks() {
        return this.allBooks.filter((book) => book.rating).toSorted((a, z) => z.rating! - a.rating!).slice(0, 5);
    }
    // Get unread books
    getUnreadBooks() {
        return this.allBooks.filter((book) => !book.started_reading_om);
    }
    //update the book
    async updateBook(bookId: number, updateObject: Partial<updatabkeBookfields>) {
        if (!this.supabase) {
            return;
        }
        const { status, error } = await this.supabase.from('books').update(updateObject).eq('id', bookId);
        if (status === 204 && !error) {
            this.allBooks = this.allBooks.map((book) => {
                if (book.id == bookId) {
                    return {
                        ...book,
                        ...updateObject
                    }
                } else {
                    return book;
                }
            })
        }
    }

    // upload a new book's cover 
    async uploadBookCover(file: File, bookId: number) {
        if (!this.user || !this.supabase) {
            return
        }
        console.log('droped from userContext');
        const filePath = `${this.user.id}/${new Date().getTime()}_${file.name}`;
        const { error: uploadError } = await this.supabase.storage
            .from('bookcovers')
            .upload(filePath, file);
        if (uploadError) {
            return console.log(uploadError);
        }
        const data = this.supabase.storage.from('bookcovers').getPublicUrl(filePath);
        const publicUrl = data.data.publicUrl;

        this.updateBook(bookId, { cover_image: publicUrl });

    }
    // Delete a book from the library
    async deleteBook(bookId: number) {
        console.log("book deleted");
        if (!this.supabase) {
            return;
        }
        const { error, status } = await this.supabase.from('books').delete().eq("id", bookId);
        if (!error && status === 204) {
            this.allBooks = this.allBooks.filter((book) => book.id !== bookId);
        }
        goto("/private/dashboard");
    }
    async logout() {
        await this.supabase?.auth.signOut();
        goto("/login");
    }



}

// to ensure that we are having the same instance of this 
// class on all files, we have to define a context

const USER_STATE_KEY = Symbol("USER_STATE");
export function setUserState(data: UserStateProps) {
    return setContext(USER_STATE_KEY, new UserState(data));
}

export function getUserState() {
    return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}

