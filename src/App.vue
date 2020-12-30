<template>
  <div id="app">

    <!-- Page Wrapper -->
    <div id="wrapper">

      <Sidebar v-show="correctDomain"/>

      <!-- Content Wrapper -->
      <div id="content-wrapper" class="d-flex flex-column">

        <!-- Main Content -->
        <div id="content">

          <Topbar v-show="correctDomain" :name="name" :email="email" :picture="picture"/>

          <!-- Begin Page Content -->
          <div class="container-fluid">

          <!-- Content Row -->
          <div class="row">
            <div class="col-lg-12 mb-4">

              <router-view v-show="correctDomain"/>

            </div>
          </div>

          </div>
          <!-- /.container-fluid -->

        </div>
        <!-- End of Main Content -->

        <Footer v-show="correctDomain"/>

      </div>
      <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <ScrollTopButton v-show="correctDomain"/>

    <LogoutModal/>

    <!-- Custom scripts for all pages-->
    <script src="./static/js/sb-admin-2.js" type="application/javascript"></script>
  </div>
</template>

<script>
// @ is an alias to /src
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'
import ScrollTopButton from '@/components/ScrollTopButton'
import LogoutModal from '@/components/LogoutModal'
import {oauth2Client, oauth2ClientGenerateAuthUrl, oauth2UserProfile} from '@/api/Oauth2Client'

export default {
  name: 'App',
  components: {
    Sidebar,
    Topbar,
    Footer,
    ScrollTopButton,
    LogoutModal
  },
  data () {
    return {
      correctDomain: false,
      publicPath: process.env.BASE_URL,
      name: '',
      email: '',
      picture: '../static/img/profile.jpg',
      domain: ''
    }
  },
  created () {
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
        if (err) {
          const authUrl = oauth2ClientGenerateAuthUrl()
          window.location = authUrl
        } else {
          sessionStorage.setItem('token', JSON.stringify(token))
          this.loadProfile()
        }
      })
    } else {
      this.loadProfile()
    }
  },
  methods: {
    loadProfile () {
      // Carregam informació del perfil de Google
      oauth2UserProfile((err, profile) => {
        if (err) {
          alert('Error carregant informació de l\'usuari: ' + err)
          const authUrl = oauth2ClientGenerateAuthUrl()
          window.location = authUrl
        } else {
          this.name = profile.data.name
          this.email = profile.data.email
          this.picture = profile.data.picture
          this.domain = profile.data.hd
          this.correctDomain = true
        }
      })
    }
  }
}
</script>
