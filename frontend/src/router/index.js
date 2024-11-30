import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../components/Dashboard.vue';
import Login from '../components/Login.vue';
import Enable2FA from '../components/Enable2FA.vue';

const routes = [
    { path: '/login', component: Login }, // Root path
    { path: '/', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/enable-2fa', component: Enable2FA, meta: { requiresAuth: true } }, 
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token'); // Check for token

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next('/login'); // Redirect to login if not authenticated
        } else {
            next(); // Proceed to the route
        }
    } else {
        next(); // Proceed for non-protected routes
    }
});

export default router;
