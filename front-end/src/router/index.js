import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CategoryBookList from '../views/CategoryBookList.vue'
import Favorites from "@/views/Favorites.vue";
import LogIn from "@/views/LogIn.vue";
import SignIn from "@/views/SignIn.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }, // Indique que la route nécessite une authentification
    },
    {
        path: '/categories/:category',
        name: 'category',
        component: CategoryBookList,
        props: (route) => ({
            category: route.params.category,
        }),
        meta: { requiresAuth: true }, // Indique que la route nécessite une authentification
    },
    {
        path: '/update-book/:bookId',
        name: 'UpdateBook',
        component: () => import('@/components/UpdateBookForm.vue'), // Adjust path if needed
        props: true,
        meta: { requiresAuth: true }, // Indique que la route nécessite une authentification
    },
    {
        path: '/favorites',
        name: 'Favorites',
        component: Favorites,
        meta: { requiresAuth: true }, // Indique que la route nécessite une authentification
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

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !store.state.isAuthenticated) {
        // L'utilisateur n'est pas authentifié
        next('/login'); // Redirige vers la page de connexion
    } else {
        // L'utilisateur est authentifié ou la route ne nécessite pas d'authentification
        next();
    }
});

export default router

