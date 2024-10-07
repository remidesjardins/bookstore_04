---
title: Store
---
# Introduction

Path : <SwmPath>[front-end/src/store/index.js](/front-end/src/store/index.js)</SwmPath>

This document will walk you through the implementation of the store feature in the front-end of our application.

The feature manages user authentication, favorite books, and admin status using Vuex for state management.

We will cover:

1. Initial state setup
2. Mutations for state changes
3. Actions for asynchronous operations
4. Handling login and logout

# Initial state setup

<SwmSnippet path="/front-end/src/store/index.js" line="1">

---

We initialize the Vuex store with the necessary state variables. This includes authentication status, user token, user ID, favorite books, and admin status. These values are fetched from <SwmToken path="/front-end/src/store/index.js" pos="6:5:5" line-data="        isAuthenticated: !!localStorage.getItem(&#39;authToken&#39;),">`localStorage`</SwmToken> to persist user data across sessions.

```
import { createStore } from 'vuex';
import router from '@/router'

const store = createStore({
    state: { // Get all element stock in the store
        isAuthenticated: !!localStorage.getItem('authToken'),
        userToken: localStorage.getItem('authToken'),
        userId: localStorage.getItem('userId'),
        favoriteBooks: [],
        isAdmin: localStorage.getItem('isAdmin'),
    },
```

---

</SwmSnippet>

# Mutations for state changes

<SwmSnippet path="/front-end/src/store/index.js" line="12">

---

Mutations are defined to handle state changes. The <SwmToken path="/front-end/src/store/index.js" pos="13:1:1" line-data="        login(state, { authToken, userId, isAdmin }) { // Store information get during login">`login`</SwmToken> mutation updates the state with user information upon successful login. The <SwmToken path="/front-end/src/store/index.js" pos="20:1:1" line-data="        logout(state) { // Empty store information">`logout`</SwmToken> mutation clears the state when the user logs out. The <SwmToken path="/front-end/src/store/index.js" pos="26:1:1" line-data="        setFavorites(state, favoriteBooks) {  // Add mutation for setting favorite books">`setFavorites`</SwmToken> mutation updates the favorite books list and persists it to <SwmToken path="/front-end/src/store/index.js" pos="28:1:1" line-data="            localStorage.setItem(&#39;favoriteBooks&#39;, JSON.stringify(favoriteBooks));">`localStorage`</SwmToken>.

```
    mutations: {
        login(state, { authToken, userId, isAdmin }) { // Store information get during login
            state.isAuthenticated = true;
            state.userToken = authToken;
            state.userId = userId;
            state.favoriteBooks = [];
            state.isAdmin = isAdmin;
        },
        logout(state) { // Empty store information
            state.isAuthenticated = false;
            state.userToken = '';
            state.userId = undefined;
            state.isAdmin = undefined;
        },
        setFavorites(state, favoriteBooks) {  // Add mutation for setting favorite books
            state.favoriteBooks = favoriteBooks;
            localStorage.setItem('favoriteBooks', JSON.stringify(favoriteBooks));
        },
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/store/index.js" line="30">

---

Additional mutations handle adding and removing favorite books. These mutations update the state and ensure the changes are persisted in <SwmToken path="/front-end/src/store/index.js" pos="33:1:1" line-data="            localStorage.setItem(&#39;favoriteBooks&#39;, JSON.stringify(state.favoriteBooks)); // Persist favorites after adding">`localStorage`</SwmToken>.

```

        addFavorite(state, book) {
            state.favoriteBooks.push(book); // Add the book to the list
            localStorage.setItem('favoriteBooks', JSON.stringify(state.favoriteBooks)); // Persist favorites after adding
        },
        removeFavorite(state, bookId) { // Remove the book to the list
            state.favoriteBooks = state.favoriteBooks.filter(book => book.book_id !== bookId);
            localStorage.setItem('favoriteBooks', JSON.stringify(state.favoriteBooks)); // Persist favorites after removal
        },
    },
```

---

</SwmSnippet>

# Actions for asynchronous operations

<SwmSnippet path="front-end/src/store/index.js" line="81">

---

The <SwmToken path="/front-end/src/store/index.js" pos="82:3:3" line-data="        async fetchFavoriteBooks({ state, commit }) { // Function to create a new favorite">`fetchFavoriteBooks`</SwmToken> action retrieves the user's favorite books from the API. It uses the stored user ID and token for authentication. The result is committed to the state using the <SwmToken path="/front-end/src/store/index.js" pos="99:4:4" line-data="                    commit(&#39;setFavorites&#39;, result);  // Ensure the response is an array">`setFavorites`</SwmToken> mutation.

```
        },
        async fetchFavoriteBooks({ state, commit }) { // Function to create a new favorite
            try {
                const userId = state.userId;
                const token = state.userToken;

                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
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
```

---

</SwmSnippet>

<SwmSnippet path="front-end/src/store/index.js" line="107">

---

The <SwmToken path="/front-end/src/store/index.js" pos="107:1:1" line-data="        initFavorites({ commit }) { // Fetch favorite store in local storage">`initFavorites`</SwmToken> action initializes the favorite books list. It first checks <SwmToken path="/front-end/src/store/index.js" pos="108:7:7" line-data="            const storedFavorites = localStorage.getItem(&#39;favoriteBooks&#39;);">`localStorage`</SwmToken> for stored favorites. If not found, it fetches the favorites from the API.

```
        initFavorites({ commit }) { // Fetch favorite store in local storage
            const storedFavorites = localStorage.getItem('favoriteBooks');
            if (storedFavorites) {
                commit('setFavorites', JSON.parse(storedFavorites)); // Restore from localStorage
            } else {
                this.dispatch('fetchFavoriteBooks'); // Fetch from API if not found in localStorage
            }
        },
```

---

</SwmSnippet>

# Handling login and logout

<SwmSnippet path="front-end/src/store/index.js" line="41">

---

During login, the user's role is checked to determine if they are an admin. This information, along with the authentication token and user ID, is committed to the state. The <SwmToken path="/front-end/src/store/index.js" pos="72:8:8" line-data="                    await this.dispatch(&#39;fetchFavoriteBooks&#39;);">`fetchFavoriteBooks`</SwmToken> action is dispatched to load the user's favorite books.

```
        async login({ commit }, { email, password }) {  // Function to login with password and email
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
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/store/index.js" line="74">

---

If the login fails, an error is thrown and logged.

```
                } else {
                    throw new Error("Login failed");
                }
            } catch (error) {
                console.error("Login error:", error);
                throw error;
            }
```

---

</SwmSnippet>

<SwmSnippet path="front-end/src/store/index.js" line="115">

---

The <SwmToken path="/front-end/src/store/index.js" pos="115:1:1" line-data="        logout({ commit }) { // Function to logout">`logout`</SwmToken> action clears the state and removes the authentication token from <SwmToken path="/front-end/src/store/index.js" pos="108:7:7" line-data="            const storedFavorites = localStorage.getItem(&#39;favoriteBooks&#39;);">`localStorage`</SwmToken>. The user is then redirected to the login page.

```
        logout({ commit }) { // Function to logout
            commit('logout');
            localStorage.removeItem('authToken'); // Delete the token
            !router.push('/login');
        },
```

---

</SwmSnippet>

This concludes the walkthrough of the store feature implementation. The design ensures that user data is managed efficiently and persists across sessions using Vuex and <SwmToken path="/front-end/src/store/index.js" pos="6:5:5" line-data="        isAuthenticated: !!localStorage.getItem(&#39;authToken&#39;),">`localStorage`</SwmToken>.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
