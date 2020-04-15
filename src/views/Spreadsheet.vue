<template>
  <div>
    <b-alert v-model="showError" variant="danger" dismissible>
      <strong>ERROR: </strong>{{error}}
    </b-alert>
    <!-- Form full de càlcul -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Exportar a un full de càlcul</h6>
      </div>
      <div class="card-body">
        <form @submit.prevent>
          <div class="form-group">
            <button class="btn btn-primary" v-on:click="spreadsheet()" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              {{ loading ? 'Exportant ...' : 'Exportar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Fi form full de càlcul -->
  </div>
</template>

<script>
import {getDomainUsers} from '../api/DomainRead'
import {oauth2ClientService} from '../api/Oauth2Client'
import * as config from '../config.json'

export default {
  name: 'Spreadsheet',
  data () {
    return {
      showError: false,
      error: '',
      loading: false
    }
  },
  methods: {
    spreadsheet () {
      this.loading = true
      getDomainUsers(null, (err, users) => {
        if (err) {
          this.error = 'Error llegint usuaris "' + err.message + '"'
          this.showError = true
        } else {
          // Array amb informació a exportar al full de càlcul
          let sheetUsers = []
          // Per cada usuari del domini...
          Object.keys(users).forEach(user => {
            if (!users[user].suspended) {
              // Grup professorat
              if (users[user].teacher) {
                if (!sheetUsers['Professorat']) {
                  sheetUsers['Professorat'] = []
                }
                sheetUsers['Professorat'].push([
                  users[user].surname + ', ' + users[user].name,
                  users[user].domainemail]
                )
              }
              // Grups alumnes
              users[user].groups.forEach(group => {
                if (group.includes(config.groupPrefixStudents)) {
                  if (!sheetUsers[group]) {
                    sheetUsers[group] = []
                  }
                  sheetUsers[group].push([
                    users[user].surname + ', ' + users[user].name,
                    users[user].domainemail]
                  )
                }
              })
            }
          })

          // Ordenam per grup
          let sheetUsersOrdered = []
          Object.keys(sheetUsers).sort().forEach(key => {
            sheetUsersOrdered[key] = sheetUsers[key]
          })

          // Per cada grup...
          Object.keys(sheetUsersOrdered).forEach(group => {
            // Ordenam alfabèticament els membres del grup
            sheetUsersOrdered[group].sort((a, b) => { return (a[0] < b[0] ? -1 : 1) })
            // Afegim capçalera
            sheetUsersOrdered[group].unshift(['Nom', 'Email'])
            console.log(sheetUsersOrdered[group])
          })
        }
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>
