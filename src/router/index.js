import Vue from 'vue'
import Router from 'vue-router'
import Inici from '@/views/Inici'
import {oauth2Client, oauth2ClientGenerateAuthUrl} from '../api/Oauth2Client'

Vue.use(Router)

let router = new Router({
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

// Before each route, check for authentication
router.beforeEach(async (to, from, next) => {
  // Si retornam del login de Google, capturam el paràmetre 'code'
  const code = (new URL(window.location.href)).searchParams.get('code')

  let token = localStorage.getItem('token')

  if ((code) && (!token)) {
    // Ha fet el login amb Google, llegim 'code' retornat
    oauth2Client().getToken(code, (err, token) => {
      if (err) return alert('Error retrieving access token' + err)
      localStorage.setItem('token', JSON.stringify(token))
      next()
    })
  } else if ((!code) && (!token)) {
    // No ha fet login amb Google, hem d'anar a la URL de login
    const authUrl = oauth2ClientGenerateAuthUrl()
    window.location = authUrl
  } else {
    // Ja ha fet login amb Google. Podem continuar
    next()
  }
})

export default router
