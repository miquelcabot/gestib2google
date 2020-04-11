<template>
  <div>
    <b-alert v-model="showError" variant="danger" dismissible>
      <strong>ERROR: </strong>{{error}}
    </b-alert>
    <div class="card shadow mb-4">
      <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Exportar a CSV</h6>
      </div>
      <div class="card-body">
        <form @submit.prevent>
          <div class="form-group">
            <label for="groupsdomainuserscsv" class="col-sm-2 col-form-label">Grups</label>
            <div class="col-sm-10">
              <select class="form-control" id="groupsdomainuserscsv" name="groupcsv">
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
              <input class="form-check-input" id="onlyteacherscsv" name="onlyteacherscsv" type="checkbox"> Només professorat</label>
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary" v-on:click="csv()">Exportar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {getDomainGroupsStudents} from '../api/DomainRead'

export default {
  name: 'Csv',
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
    csv () {
      alert('executar')
    }
  }
}
</script>

<style>

</style>
