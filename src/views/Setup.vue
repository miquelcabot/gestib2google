<template>
  <div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Configuració</h6>
    </div>
    <div class="card-body">
      <form @submit.prevent>
      <!--
        <div class="form-group">
          <label for="domain">Domini</label>
          <input class="form-control" id="domain" name="domain" type="text" placeholder="Domini" value="iesemilidarder.com">
        </div>
        <div class="form-group">
          <label for="tutorsgroup">Nom del grup de tutors</label>
          <input class="form-control" id="tutorsgroup" name="tutorsgroup" type="text" placeholder="Grup tutors" value="tutors">
        </div>
        <div class="form-group">
          <label for="teachersgroup">Prefix dels grups de professors</label>
          <input class="form-control" id="teachersgroup" name="teachersgroup" type="text" placeholder="Prefix" value="ee.">
        </div>
        <div class="form-group">
          <label for="studentsgroup">Prefix dels grups d'alumnes</label>
          <input class="form-control" id="studentsgroup" name="studentsgroup" type="text" placeholder="Prefix" value="alumnat.">
        </div> -->
        <div class="form-group">
          <button class="btn btn-secondary" v-on:click="spreadsheet()">Restablir</button>
          <button class="btn btn-primary" v-on:click="spreadsheet()">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setup',
  methods: {
    spreadsheet () {
      alert('executar')
    }
  }
}
</script>

<style>

</style>
