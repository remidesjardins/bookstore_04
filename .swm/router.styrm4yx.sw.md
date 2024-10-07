---
title: Router
---
# Introduction

Path : <SwmPath>[front-end/src/router/index.js](/front-end/src/router/index.js)</SwmPath>

This document will walk you through the implementation of the router feature in the front-end of our application.

The feature sets up routing for different views and ensures that certain routes require authentication.

We will cover:

1. Defining the routes and their components.
2. Creating the router instance.
3. Implementing route guards for authentication.

# Defining the routes and their components

<SwmSnippet path="/front-end/src/router/index.js" line="9">

---

We define the routes for our application, specifying the path, name, component, and whether authentication is required.

```
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }, // Indicate whether authentication is required
    },
    {
```

---

</SwmSnippet>

<SwmSnippet path="/front-end/src/router/index.js" line="17">

---

We also include dynamic routes and lazy-loaded components for better performance and flexibility.

```

        path: '/categories/:category',
        name: 'category',
        component: CategoryBookList,
        props: (route) => ({
            category: route.params.category,
        }),
        meta: { requiresAuth: true }, // Indicate whether authentication is required
    },
    {
        path: '/update-book/:bookId',
        name: 'UpdateBook',
        component: () => import('@/components/UpdateBookForm.vue'), // Adjust path if needed
        props: true,
        meta: { requiresAuth: true }, // Indicate whether authentication is required
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: Favorites,
        meta: { requiresAuth: true }, // Indicate whether authentication is required
    },
    {
        path: '/login',
        name: 'Login',
        component: LogIn,
    },
    {
        path: '/register',
        name: 'Signup',
        component: SignIn,
    }
]
```

---

</SwmSnippet>

# Creating the router instance

<SwmSnippet path="/front-end/src/router/index.js" line="51">

---

We create the router instance using <SwmToken path="/front-end/src/router/index.js" pos="51:6:6" line-data="const router = createRouter({">`createRouter`</SwmToken> and <SwmToken path="/front-end/src/router/index.js" pos="52:4:4" line-data="    history: createWebHistory(),">`createWebHistory`</SwmToken>, and pass the defined routes to it.

```
const router = createRouter({
    history: createWebHistory(),
    routes,
})
```

---

</SwmSnippet>

# Implementing route guards for authentication

<SwmSnippet path="/front-end/src/router/index.js" line="56">

---

We add a global navigation guard to check if a route requires authentication and if the user is authenticated. If not, the user is redirected to the login page.

```
router.beforeEach((to, from, next) => { //Function to control authentication for routes
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !store.state.isAuthenticated) {

        next('/login');
    } else {

        next();
    }
});
```

---

</SwmSnippet>

This setup ensures that only authenticated users can access certain routes, enhancing the security of our application.

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBYm9va3N0b3JlXzA0JTNBJTNBcmVtaWRlc2phcmRpbnM=" repo-name="bookstore_04"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
