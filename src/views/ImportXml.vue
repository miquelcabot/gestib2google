<template>
  <div>
    <b-alert v-model="showError" variant="danger" dismissible>
      <strong>ERROR: </strong>{{error}}
    </b-alert>
    <div class="card shadow mb-4">
      <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Importar fitxer XML de GestIB</h6>
      </div>
      <div class="card-body">
        <form @submit.prevent>
          <div class="form-group">
            <div class="custom-file">
              <input type="file" id="xmlfile" name="xmlfile"  class="custom-file-input" placeholder="File" required="required">
              <label class="custom-file-label" for="xmlfile">Fitxer XML de GestIB</label>
            </div>
          </div>
        <!-- <div class="form-group">
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
            <label for="groupstaulausuaris" class="col-sm-2 col-form-label">Grups</label>
            <div class="col-sm-10">
              <select class="form-control" id="groupstaulausuaris" name="group">
                <option value="">Tots</option>
                <option v-for="group in groups" v-bind:key="group.email" v-bind:value="group.email">
                  {{ group.name.replace('Alumnat', '') }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="form-check">
              <label class="form-check-label">
              <input class="form-check-input" id="onlyteachers" name="onlyteachers" type="checkbox"> Només professorat</label>
            </div>
          </div>
          <div class="form-group">
            <div class="form-check">
              <label class="form-check-label">
              <input class="form-check-input" id="apply" name="apply" type="checkbox"> Aplicar canvis</label>
            </div>
          </div>
          <button class="btn btn-primary" v-on:click="importGestib()">Importar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {getDomainGroupsStudents} from '../api/DomainRead'

export default {
  name: 'ImportXml',
  data () {
    return {
      showError: false,
      error: '',
      groups: []
    }
  },
  mounted () {
    getDomainGroupsStudents(null, null, (err, groups) => {
      if (err) {
        this.error = 'Error emplentant el desplegable Grups "' + err.message + '"'
        this.showError = true
      }

      this.groups = groups
    })
  },
  methods: {
    importGestib: function () {
      alert('executar')
    }
  }
}
</script>

<style>

</style>
