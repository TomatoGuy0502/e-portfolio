import { createRouter, createWebHistory } from 'vue-router'
import Experience from '../views/Experience.vue'
import Portfolio from '../views/Portfolio.vue'
import Landing from '../views/Landing.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/',
    name: 'DefaultLayout',
    component: DefaultLayout,
    children: [
      {
        path: 'experience/:type?',
        name: 'Experience',
        component: Experience,
        props: (route) => ({ type: route.params.type || 'course' }),
        meta: {
          transition: 'slide-left'
        }
      },
      {
        path: 'portfolio',
        name: 'Portfolio',
        component: Portfolio,
        meta: {
          transition: 'slide-right'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
