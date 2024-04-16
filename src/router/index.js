import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue';
import NavTabItem from '../components/NavTabItem.vue';



const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/',
    component: NavTabItem,
    children: [
      {
        path: 'home',
        component: () => {
          if (localStorage.getItem('token')) {
            return HomePage;
          } else {
            return import('../views/LoginPage.vue');
          }
        }
      },
      {
        path: 'search',
        component: () => {
          if (localStorage.getItem('token')) {
            return import('../views/SearchPage.vue');
          } else {
            return import('../views/LoginPage.vue');
          }
        }
      },
      {
        path: 'stats',
        component: () => {
          if (localStorage.getItem('token')) {
            return import('../views/StatsPage.vue');
          } else {
            return import('../views/LoginPage.vue');
          }
        }
      },
      {
        path: 'profile',
        component: () => {
          if (localStorage.getItem('token')) {
            return import('../views/ProfilePage.vue');
          } else {
            return import('../views/LoginPage.vue')
          }
        }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
