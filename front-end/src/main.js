import { createApp } from 'vue';
import App from './App.vue';
import store from '@/Store';
import router from './router';

createApp(App)
    .use(store)
    .use(router)
    .mount('#app');

localStorage.setItem('authToken', "");
localStorage.removeItem('authToken');

