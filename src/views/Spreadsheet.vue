<template>
  <div>
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
    <div class="alert alert-danger alert-dismissible fade show" role="alert" v-for="(error, index) in errors" v-bind:key="index">
      <strong>ERROR: </strong>{{error}}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <b-modal id="modal-ok" title="GestIB2Google" ok-only>
      <p class="my-4">Procés finalitzat!<br>Fitxer guardat a 'La meva unitat' de Google Drive amb el nom '{{ filename }}'.</p>
    </b-modal>
  </div>
</template>

<script>
import {getDomainUsers} from '../api/DomainRead'
import {oauth2ClientServiceSheets} from '../api/Oauth2Client'
import * as config from '../config.json'

export default {
  name: 'Spreadsheet',
  data () {
    return {
      errors: [],
      loading: false,
      filename: ''
    }
  },
  methods: {
    spreadsheet () {
      // KKK TODO: Arreglar errors exportació a full de càlcul
      this.loading = true
      getDomainUsers(null, (err, users) => {
        if (err) {
          this.errors.push('Error llegint usuaris "' + err.message + '"')
          this.loading = false
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

          this.filename = 'Usuaris domini ' + (new Date()).toLocaleString()
          // Cream el full de càlcul a Google Drive
          // https://developers.google.com/sheets/api/guides/create#nodejs
          oauth2ClientServiceSheets().spreadsheets.create({
            resource: {
              properties: {
                title: this.filename
              }
            },
            fields: 'spreadsheetId'
          }, (err, spreadsheet) => {
            if (err) {
              this.errors.push('Error creant el full de càlcul "' + err.message + '"')
              this.loading = false
            } else {
              // Si s'ha creat correctament el full de càlcul...

              // Per cada grup...
              let sheetUsersWithGroup = []
              Object.keys(sheetUsersOrdered).forEach((group, indexgroup) => {
                // Ordenam alfabèticament els membres del grup
                sheetUsersOrdered[group].sort((a, b) => { return (a[0] < b[0] ? -1 : 1) })
                sheetUsersOrdered[group].forEach((index, userArray) => {
                  sheetUsersWithGroup.push([group, sheetUsersOrdered[group][userArray][0], sheetUsersOrdered[group][userArray][1]])
                })
              })
              let spreadsheetId = spreadsheet.data.spreadsheetId
              console.log(sheetUsersWithGroup)
              sheetUsersWithGroup = ['1', '132']
              // Afegim valors (membres del grup) al full
              oauth2ClientServiceSheets().spreadsheets.values.update({
                spreadsheetId: spreadsheetId,
                range: 'A1',
                valueInputOption: 'USER_ENTERED',
                resource: {
                  values: sheetUsersWithGroup
                }
              }, (err, response) => {
                if (err) {
                  this.errors.push('Error afegint les dades al full de càlcul "' + err.message + '"')
                } else {
                  this.loading = false
                  this.$bvModal.show('modal-ok')
                }
              })
            }
          })
        }
      })
    }
  }
  /*
  spreadsheet () {
      this.loading = true
      getDomainUsers(null, (err, users) => {
        if (err) {
          this.errors.push('Error llegint usuaris "' + err.message + '"')
          this.loading = false
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

          this.filename = 'Usuaris domini ' + (new Date()).toLocaleString()
          // Cream el full de càlcul a Google Drive
          // https://developers.google.com/sheets/api/guides/create#nodejs
          oauth2ClientServiceSheets().spreadsheets.create({
            resource: {
              properties: {
                title: this.filename
              }
            },
            fields: 'spreadsheetId'
          }, (err, spreadsheet) => {
            if (err) {
              this.errors.push('Error creant el full de càlcul "' + err.message + '"')
              this.loading = false
            } else {
              // Si s'ha creat correctament el full de càlcul...
              let spreadsheetId = spreadsheet.data.spreadsheetId

              // Per cada grup...
              Object.keys(sheetUsersOrdered).forEach((group, indexgroup) => {
                console.log(indexgroup + group)

                // Ordenam alfabèticament els membres del grup
                sheetUsersOrdered[group].sort((a, b) => { return (a[0] < b[0] ? -1 : 1) })
                // Afegim capçalera
                sheetUsersOrdered[group].unshift(['Nom', 'Email'])

                // Afegim un nou full per cada grup
                oauth2ClientServiceSheets().spreadsheets.batchUpdate({
                  spreadsheetId: spreadsheetId,
                  resource: {
                    requests: {
                      addSheet: {
                        properties: {
                          title: group
                        }
                      }
                    }
                  }
                }, (err, response) => {
                  if (err) {
                    this.errors.push('Error afegint el grup "' + group + '" al full de càlcul "' + err.message + '"')
                  } else {
                    // Afegim valors (membres del grup) al full
                    oauth2ClientServiceSheets().spreadsheets.values.update({
                      spreadsheetId: spreadsheetId,
                      range: group + '!A1',
                      valueInputOption: 'USER_ENTERED',
                      resource: {
                        values: sheetUsersOrdered[group]
                      }
                    }, (err, response) => {
                      if (err) {
                        this.errors.push('Error afegint les dades del grup "' + group + '" al full de càlcul "' + err.message + '"')
                      }
                    })
                    // Esborram el primer full (sense nom)
                    console.log((indexgroup + 1) + ' de ' + Object.keys(sheetUsersOrdered).length)
                    if (indexgroup === (Object.keys(sheetUsersOrdered).length - 1)) {
                      oauth2ClientServiceSheets().spreadsheets.batchUpdate({
                        spreadsheetId,
                        resource: {
                          requests: {
                            deleteSheet: {
                              sheetId: 0
                            }
                          }
                        }
                      }, (err) => {
                        if (err) {
                          this.errors.push('Error esborrant les pàgines buides del full de càlcul "' + err.message + '"')
                        } else {
                          this.loading = false
                          this.$bvModal.show('modal-ok')
                        }
                      })
                    }
                  }
                })
              })
            }
          })
        }
      })
    }
  }
  */
}
</script>

<style>

</style>
