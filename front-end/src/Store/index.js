import { createStore } from 'vuex';
import router from '@/router'

const store = createStore({
    state: {
        isAuthenticated: !!localStorage.getItem('authToken'),
        userToken: localStorage.getItem('authToken'),
        userId: localStorage.getItem('userId'),
    },
    mutations: {
        login(state, authToken, userId) {
            state.isAuthenticated = true;
            state.userToken = authToken;
            state.userId = userId;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.userToken = '';
            state.userId = undefined;
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
                    router.push('/');
                } else {
                    throw new Error("Login failed");
                }
            } catch (error) {
                console.error("Login error:", error);
                throw error;
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