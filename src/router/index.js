import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import {oauth2Client, oauth2ClientGenerateAuthUrl} from '../api/Oauth2Client'

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

// Before each route, check for authentication
router.beforeEach(async (to, from, next) => {
  // Si retornam del login de Google, capturam el paràmetre 'code'
  const code = (new URL(window.location.href)).searchParams.get('code')

  let token = sessionStorage.getItem('token')
  let expiryDate = null
  if (token) {
    // Si ha expirat el token de Google Oauth2, eliminam el token per forçar un altre login
    expiryDate = new Date(JSON.parse(sessionStorage.getItem('token')).expiry_date)
    if (expiryDate < Date.now()) {
      token = null
    }
  }

  if ((!code) && (!token)) {
    // No ha fet login amb Google, hem d'anar a la URL de login
    const authUrl = oauth2ClientGenerateAuthUrl()
    window.location = authUrl
  } else if ((code) && (!token)) {
    // Ha fet el login amb Google, llegim 'code' retornat
    oauth2Client().getToken(code, (err, token) => {
      if (err) return alert('Error retrieving access token' + err)
      sessionStorage.setItem('token', JSON.stringify(token))
      next()
    })
  } else {
    // Ja ha fet login amb Google. Podem continuar
    next()
  }
})

export default router
