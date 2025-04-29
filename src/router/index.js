import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ObjectivesView from '../views/ObjectivesView.vue'

const routes = [{
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },

    {
        path: '/projects/:id',
        name: 'projects',
        component: ProjectsView,
        props: true,
    },
    {
        path: '/objectives/:id',
        name: 'objectives',
        component: ObjectivesView,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router