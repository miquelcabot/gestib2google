import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueGoogleApi from 'vue-google-api'

Vue.config.productionTip = false

// Configuram Google API

const SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/admin.directory.orgunit',
  'https://www.googleapis.com/auth/spreadsheets']

const config = {
  apiKey: 'AIzaSyB_hcKmzwgQ__RFIyuw_h3L9aojsdBNoV4',
  clientId: '184393623912-l9o1fqiik80rk7e6c52769vrh2h0bbq1.apps.googleusercontent.com',
  scope: SCOPES,
  discoveryDocs: [ ]
}
let a = Vue.use(VueGoogleApi, config)
console.log(a)

console.log(Vue.$gapi)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
