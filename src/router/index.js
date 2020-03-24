import Vue from 'vue'
import VueRouter from 'vue-router'
import Inici from '../views/Inici'

Vue.use(VueRouter)

const routes = [
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
    component: () => import(/* webpackChunkName: "about" */ '../views/UsuarisDomini')
  },
  {
    path: '/fullcalcul',
    name: 'FullCalcul',
    component: () => import('../views/FullCalcul')
  },
  {
    path: '/csv',
    name: 'Csv',
    component: () => import('../views/Csv')
  },
  {
    path: '/importarxml',
    name: 'ImportarXml',
    component: () => import('../views/ImportarXml')
  }
]

const router = new VueRouter({
  routes
})

export default router
