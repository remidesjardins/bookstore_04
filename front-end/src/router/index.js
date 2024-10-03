import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
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
        meta: { requiresAuth: true }, // Indicate whether authentication is required
    },
    {

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

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => { //Function to control authentication for routes
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !store.state.isAuthenticated) {

        next('/login');
    } else {

        next();
    }
});

export default router

