<template>
  <div id="app">

    <!-- Page Wrapper -->
    <div id="wrapper">

      <Sidebar/>

      <!-- Content Wrapper -->
      <div id="content-wrapper" class="d-flex flex-column">

        <!-- Main Content -->
        <div id="content">

          <Topbar/>

          <!-- Begin Page Content -->
          <div class="container-fluid">

          <!-- Content Row -->
          <div class="row">
            <div class="col-lg-12 mb-4">

              <router-view/>

            </div>
          </div>

          </div>
          <!-- /.container-fluid -->

        </div>
        <!-- End of Main Content -->

        <Footer/>

      </div>
      <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <ScrollTopButton/>

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
      publicPath: process.env.BASE_URL
    }
  }
}
</script>
