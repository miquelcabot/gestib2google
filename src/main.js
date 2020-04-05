// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import * as clientSecret from './client_secret.json'

const {google} = require('googleapis')

// If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/admin.directory.user']

Vue.config.productionTip = false

authorize(clientSecret, listUsers)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize (credentials, callback) {
  /* eslint-disable camelcase */

  const {client_secret, client_id, redirect_uris} = credentials.web
  console.log(client_secret)
  console.log(client_id)
  console.log(redirect_uris)

  const oauth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0])

  console.log(oauth2Client)

  listUsers(oauth2Client)

  /*
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oauth2Client, callback);
    oauth2Client.credentials = JSON.parse(token);
    callback(oauth2Client);
  });
  */
}

/**
 * Lists the first 10 users in the domain.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listUsers (auth) {

}
