import { createRouter, createWebHashHistory } from 'vue-router'
import whellcome from './components/wellcome.vue'
import home from './components/home/index.vue'

const routes = [
    { path: '/', component: whellcome },
    { path: '/home', component: home },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

