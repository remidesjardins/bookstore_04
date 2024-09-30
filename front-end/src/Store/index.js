import { createStore } from 'vuex';
import router from '@/router'

const store = createStore({
    state: {
        isAuthenticated: !!localStorage.getItem('authToken'),
        userToken: localStorage.getItem('authToken'),
        userId: localStorage.getItem('userId'),
        favoriteBooks: [],
    },
    mutations: {
        login(state, authToken, userId) {
            state.isAuthenticated = true;
            state.userToken = authToken;
            state.userId = userId;
            state.favoriteBooks = [];
        },
        logout(state) {
            state.isAuthenticated = false;
            state.userToken = '';
            state.userId = undefined;
        },
        setFavorites(state, favoriteBooks) {  // Add mutation for setting favorite books
            state.favoriteBooks = favoriteBooks;
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
                    commit("login", result.token, result.userId);
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
        async fetchFavoriteBooks({ state, commit }) {  // Add action to fetch favorite books
            try {
                const userId = state.userId;
                const response = await fetch(`https://bot.servhub.fr/api/favorites/${userId}`);
                const result = await response.json();
                commit('setFavorites', result); // Commit the result to the store
            } catch (error) {
                console.error("Error fetching favorites:", error);
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