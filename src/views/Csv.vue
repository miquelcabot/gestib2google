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
              <select class="form-control" id="group" name="group" v-model="group" :disabled="loading">
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
              <input class="form-check-input" id="onlyteachers" name="onlyteachers" type="checkbox" v-model="onlyteachers" :disabled="loading"> Només professorat</label>
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary" v-on:click="csv()" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              {{ loading ? 'Exportant ...' : 'Exportar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import {getDomainGroupsStudents, getDomainUsers} from '../api/DomainRead'
import * as config from '../config.json'

export default {
  name: 'Csv',
  data () {
    return {
      group: '',
      onlyteachers: false,
      showError: false,
      error: '',
      loading: false,
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
      this.loading = true
      getDomainUsers(null, (err, users) => {
        if (err) {
          this.error = 'Error llegint usuaris "' + err.message + '"'
          this.showError = true
        } else {
          // Array amb informació a exportar al CSV
          let sheetusers = []
          // Per cada usuari del domini...
          Object.keys(users).forEach(user => {
            if (!users[user].suspended) {
              if (!this.onlyteachers || users[user].teacher) {
                if (!this.group || users[user].groups.includes(this.group)) {
                  let usergroup = ''
                  if (users[user].teacher) {
                    usergroup = 'Professorat'
                  } else {
                    users[user].groups.forEach(group => {
                      if (group.includes(config.groupPrefixStudents)) {
                        usergroup = group.substr(config.groupPrefixStudents.length)
                      }
                    })
                  }
                  if (usergroup) {
                    sheetusers.push([
                      users[user].domainemail,
                      config.defaultPassword,
                      usergroup,
                      'YES'
                    ])
                  }
                }
              }
            }
          })
          // Ordenam per la primera columna de l'array
          sheetusers.sort((a, b) => { return (a[0] < b[0] ? -1 : 1) })

          // Exportar a fitxer CSV
          let fileName = 'resetpasswords' + (new Date()).toLocaleString() + '.csv'

          let csvContent = sheetusers.map(e => e.join(',')).join('\r\n')
          let csfFile = new Blob([csvContent], { type: 'data:text/csv;charset=utf-8' })
          saveAs(csfFile, fileName)
        }
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>
