import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CategoryBookList from '../views/CategoryBookList.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/categories/:category',
        name: 'category',
        component: CategoryBookList,
        props: (route) => ({
            category: route.params.category,
        })
}]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

