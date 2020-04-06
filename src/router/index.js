import Vue from 'vue'
import Router from 'vue-router'
import Inici from '@/views/Inici'
import * as clientSecret from '../client_secret.json'

const {google} = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/admin.directory.user']

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
  /* eslint-disable camelcase */
  const {client_secret,   client_id} = clientSecret.web
  const oauth2Client = new google.auth.OAuth2(
    client_id, client_secret, 'http://localhost:8080')

  // Si retornam del login de Google, capturam el paràmetre 'code'
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  let token = localStorage.getItem('token')

  if ((code != null) && (token == null)) {
    // Ha fet el login amb Google, llegim 'code' retornat
    oauth2Client.getToken(code, (err, token) => {
      if (err) return alert('Error retrieving access token' + err)
      localStorage.setItem('token', JSON.stringify(token))
      next()
    })
  } else if ((code == null) && (token == null)) {
    // No ha fet login amb Google, hem d'anar a la URL de login
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
    window.location = authUrl
  } else {
    // Ja ha fet login amb Google. Podem continuar

    let token = JSON.parse(localStorage.getItem('token'))
    oauth2Client.setCredentials(token)
    listUsers(oauth2Client)

    next()
  }
})

/**
 * Lists the first 10 users in the domain.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listUsers (auth) {
  const service = google.admin({version: 'directory_v1', auth})
  service.users.list({
    customer: 'my_customer',
    maxResults: 10,
    orderBy: 'email'
  }, (err, res) => {
    if (err) return alert('The API returned an error:' + err.message)

    const users = res.data.users
    if (users.length) {
      console.log('Users:')
      users.forEach((user) => {
        console.log(`${user.primaryEmail} (${user.name.fullName})`)
      })
    } else {
      console.log('No users found.')
    }
  })
}

export default router
