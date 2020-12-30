import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/users',
      name: 'Users',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/Users')
    },
    {
      path: '/spreadsheet',
      name: 'Spreadsheet',
      component: () => import('@/views/Spreadsheet')
    },
    {
      path: '/csv',
      name: 'Csv',
      component: () => import('@/views/Csv')
    },
    {
      path: '/importxml',
      name: 'ImportXml',
      component: () => import('@/views/ImportXml')
    },
    {
      path: '/setup',
      name: 'Setup',
      component: () => import('@/views/Setup')
    }
  ]
})

export default router
