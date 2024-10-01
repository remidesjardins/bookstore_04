import { createStore } from 'vuex';
import router from '@/router'

const store = createStore({
    state: {
        isAuthenticated: !!localStorage.getItem('authToken'),
        userToken: localStorage.getItem('authToken'),
        userId: localStorage.getItem('userId'),
        favoriteBooks: [],
        isAdmin: localStorage.getItem('isAdmin'),
    },
    mutations: {
        login(state, { authToken, userId, isAdmin }) {
            state.isAuthenticated = true;
            state.userToken = authToken;
            state.userId = userId;
            state.favoriteBooks = [];
            state.isAdmin = isAdmin;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.userToken = '';
            state.userId = undefined;
            state.isAdmin = undefined;
        },
        setFavorites(state, favoriteBooks) {  // Add mutation for setting favorite books
            state.favoriteBooks = favoriteBooks;
            localStorage.setItem('favoriteBooks', JSON.stringify(favoriteBooks));
        },

        addFavorite(state, book) {
            state.favoriteBooks.push(book); // Add the book to the list
            localStorage.setItem('favoriteBooks', JSON.stringify(state.favoriteBooks)); // Persist favorites after adding
        },
        removeFavorite(state, bookId) {
            state.favoriteBooks = state.favoriteBooks.filter(book => book.book_id !== bookId);
            localStorage.setItem('favoriteBooks', JSON.stringify(state.favoriteBooks)); // Persist favorites after removal
        },
    },
    actions: {
        async login({ commit }, { email, password }) {  // Destructure the payload
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "email": email,
                "password": password
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            try {
                const response = await fetch("https://bot.servhub.fr/api/users/login", requestOptions);
                const result = await response.json();

                if (response.ok && result.token) {
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('userId', result.userId);
                    let isAdmin;
                    if (result.role === 'ADMIN'){
                        isAdmin = true;
                    }else {
                        isAdmin = false;
                    }
                    localStorage.setItem('isAdmin', isAdmin);
                    commit("login", { authToken: result.token, userId: result.userId, isAdmin: isAdmin });
                    await this.dispatch('fetchFavoriteBooks');
                    router.push('/');
                } else {
                    throw new Error("Login failed");
                }
            } catch (error) {
                console.error("Login error:", error);
                throw error;
            }
        },
        async fetchFavoriteBooks({ state, commit }) {
            try {
                const userId = state.userId;
                const token = state.userToken;

                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,  // Add the Authorization header
                        "Content-Type": "application/json",
                    },
                };

                const response = await fetch(`https://bot.servhub.fr/api/favorites/${userId}`, requestOptions);
                const result = await response.json();

                if (Array.isArray(result)) {
                    commit('setFavorites', result);  // Ensure the response is an array
                } else {
                    console.error('Error: Favorites API did not return an array');
                }
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        },
        initFavorites({ commit }) {
            const storedFavorites = localStorage.getItem('favoriteBooks');
            if (storedFavorites) {
                commit('setFavorites', JSON.parse(storedFavorites)); // Restore from localStorage
            } else {
                this.dispatch('fetchFavoriteBooks'); // Fetch from API if not found in localStorage
            }
        },
        logout({ commit }) {
            commit('logout');
            localStorage.removeItem('authToken'); // Supprimez le token
            !router.push('/login');
        },
    },
});

export default store;