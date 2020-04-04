import Vue from 'vue'
import Router from 'vue-router'
import Inici from '@/views/Inici'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Inici',
      component: Inici
    },
    {
      path: '/usuarisdomini',
      name: 'Usuarisdomini',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/UsuarisDomini')
    },
    {
      path: '/fullcalcul',
      name: 'FullCalcul',
      component: () => import('@/views/FullCalcul')
    },
    {
      path: '/csv',
      name: 'Csv',
      component: () => import('@/views/Csv')
    },
    {
      path: '/importarxml',
      name: 'ImportarXml',
      component: () => import('@/views/ImportarXml')
    }
  ]
})
