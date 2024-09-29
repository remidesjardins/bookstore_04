import { createStore } from 'vuex';

export const store = createStore({
    state: {
        isAuthenticated: !!localStorage.getItem('authToken'),
        userToken: localStorage.getItem('authToken')
    },
    mutations: {
        login(state, authToken) {
            state.isAuthenticated = true;
        },
        logout(state) {
            state.isAuthenticated = false;
        },
    },
    actions: {
        async login({ commit }, email, password) {
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

            const result = fetch("https://bot.servhub.fr/api/users/login", requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));

            localStorage.setItem('authToken', result.token);
            commit("login", result.token);
            this.$router.push('/');
        },
        logout({ commit }) {
            commit('logout');
            localStorage.removeItem('authToken'); // Supprimez le token
            this.$router.push('/login');
        },
    },
});