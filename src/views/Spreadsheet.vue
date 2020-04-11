<template>
  <div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Exportar a un full de càlcul</h6>
    </div>
    <div class="card-body">
      <form @submit.prevent>
        <div class="form-group">
          <button class="btn btn-primary" v-on:click="spreadsheet()">Exportar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Spreadsheet',
  methods: {
    spreadsheet () {
      alert('executar')
    }
  }
}
</script>

<style>

</style>
