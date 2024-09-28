import { createStore } from 'vuex';

export const store = createStore({
    state: {
        books: [
            {
                id: "B-154-343",
                title: "A Game of Thrones",
                author: "George R. R. Martin",
                img: "https://covers.openlibrary.org/b/isbn/9780553103540-M.jpg",
                isbn: 9780553103540,
                price: 20,
                category: "Science-Fiction",
                summary: "Long ago...",
                isFavorite: false
            },
            {
                id: "B-123-456",
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                img: "https://covers.openlibrary.org/b/isbn/9780618968633-M.jpg",
                price: 15,
                category: "Fantasy",
                summary: "Bilbo's adventure...",
                isFavorite: false
            },
            {
                id: "B-123-456",
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                img: "https://covers.openlibrary.org/b/isbn/9780618968633-M.jpg",
                price: 15,
                category: "Fantasy",
                summary: "Bilbo's adventure...",
                isFavorite: false
            },
            {
                id: "B-123-456",
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                img: "https://covers.openlibrary.org/b/isbn/9780618968633-M.jpg",
                price: 15,
                category: "Fantasy",
                summary: "Bilbo's adventure...",
                isFavorite: false
            },

            // Add more books here
        ]
    },
    mutations: {
        setBooks(state, books) {
            state.books = books;
        },
        addBook(state, book) {
            state.books.push(book);  // Ajoute un nouveau livre à la liste existante
        }
    },
    getters: {
        getBooks(state) {
            return state.books;
        }
    }
});