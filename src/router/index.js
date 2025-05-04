import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import DashboardView from '@/views/DashboardView.vue'
import EditProfile from '@/views/EditProfile.vue'
import ObjectivesView from '../views/ObjectivesView.vue'
import TimelineView from '@/views/TimelineView.vue'
import SkillsView from '@/views/SkillsView.vue'
import VisComp from '@/components/VisCompskills1.vue'

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
        path: '/skills/:id',
        name: 'skills',
        component: SkillsView,
        props: true
    },
    {
        path: '/timeline',
        name: 'timeline',
        component: TimelineView
    },
    {
        path: '/dashboard/:id',
        name: 'dashboard',
        component: DashboardView,
        props: true
    },
    {
        path: '/viscomp/:id',
        name: 'viscomp',
        component: VisComp,
        props: true
    },
    {
        path: '/editprofile/:id',
        name: 'editprofile',
        component: EditProfile
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router