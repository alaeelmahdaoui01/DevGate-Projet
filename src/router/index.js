import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import DashboardView from '@/views/DashboardView.vue'
import EditProfile from '@/views/EditProfile.vue'
import ObjectivesView from '../views/ObjectivesView.vue'
import TimelineView from '@/views/TimelineView.vue'

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
        path: '/editprofile/:id',
        name: 'editprofile',
        component: EditProfile
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
    },
    {
        path: '/dashboard/:userId',
        name: 'dashboard',
        component: DashboardView,
        props: true
    },
    {
        path: '/timeline',
        name: 'timeline',
        component: TimelineView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router