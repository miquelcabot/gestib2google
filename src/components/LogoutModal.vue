<template>
  <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Realment vol sortir?</h5>
          <button class="close" type="button" data-dismiss="modal" aria-label="Tancar">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">Pitgi "Sortir" si vol finalitzar la sessió actual.</div>
        <div class="modal-footer">
          <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel·lar</button>
          <a class="btn btn-primary" :href="logoutUrl" >Sortir</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoutModal',
  data () {
    return {
      logoutUrl: 'https://accounts.google.com/o/oauth2/revoke?token=' + JSON.parse(sessionStorage.getItem('token')).access_token
    }
  }
}
</script>

<style>

</style>
