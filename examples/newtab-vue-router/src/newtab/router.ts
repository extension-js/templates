import {createRouter, createWebHashHistory} from 'vue-router'
import PageView from './views/PageView.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PageView,
      props: {heading: 'Welcome to your Vue Router Extension.'}
    },
    {
      path: '/about',
      name: 'about',
      component: PageView,
      props: {heading: 'Learn more about your Vue Router Extension.'}
    },
    {
      path: '/users',
      name: 'users',
      component: PageView,
      props: {heading: 'List of users of your Vue Router Extension.'}
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})
