<template>
  <div>
    <b-alert v-model="showError" variant="danger" dismissible>
      <strong>ERROR: </strong>{{error}}
    </b-alert>
    <b-modal id="modal-ok" title="GestIB2Google" ok-only>
      <p class="my-4">Procés finalitzat!</p>
    </b-modal>
    <!-- Form mostrar usuaris -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Mostrar usuaris del domini</h6>
      </div>
      <div class="card-body">
        <form @submit.prevent>
          <div class="form-group">
            <label for="group" class="col-sm-2 col-form-label">Grups</label>
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
              <div class="form-check">
                <label class="form-check-label">
                <input class="form-check-input" id="onlyactive" name="onlyactive" type="checkbox" v-model="onlyactive" :disabled="loading"> Només usuaris actius</label>
              </div>
          </div>
          <div class="form-group">
              <div class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" id="onlywithoutcode" name="onlywithoutcode" type="checkbox" v-model="onlywithoutcode" :disabled="loading"> Només els usuaris sense ID
                </label>
              </div>
          </div>
          <div class="form-group">
              <div class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" id="onlynotsession" name="onlynotsession" type="checkbox" v-model="onlynotsession" :disabled="loading"> Només els usuaris que no han iniciat mai sessió
                </label>
              </div>
          </div>
          <div class="form-group">
              <div class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" id="onlywithoutorgunit" name="onlywithoutorgunit" type="checkbox" v-model="onlywithoutorgunit" :disabled="loading"> Només els usuaris de la Unitat Organitzativa principal (/)
                </label>
              </div>
            </div>
          <div class="form-group">
            <button class="btn btn-primary" v-on:click="showUsers()" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              {{ loading ? 'Carregant ...' : 'Mostrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Fi form mostrar usuaris -->
    <!-- Taula mostrar usuaris -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Usuaris</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Professor</th>
                <th>Grups</th>
                <th>Unitat</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th colspan="5">Total usuaris trobats: {{ users.length }}</th>
              </tr>
            </tfoot>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" v-if="loading">Carregant ...</td>
              </tr>
              <tr v-if="!users.length && !loading">
                <td colspan="5">No hi ha dades carregades</td>
              </tr>
              <tr v-for="user in users" v-bind:key="user.id">
                <td>{{ user.surname + ', ' + user.name }}</td>
                <td>{{ user.domainemail }}</td>
                <td>{{ user.teacher ? 'TEACHER' : '' }}</td>
                <td>{{ user.groups.join(', ') }}</td>
                <td>{{ user.organizationalUnit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Fi taula mostrar usuaris -->
  </div>
</template>

<script>
import {getDomainGroupsStudents, getDomainUsers} from '../api/DomainRead'

export default {
  name: 'Users',
  data () {
    return {
      group: '',
      onlyteachers: false,
      onlyactive: false,
      onlywithoutcode: false,
      onlynotsession: false,
      onlywithoutorgunit: false,
      showError: false,
      error: '',
      loading: false,
      groups: [],
      users: []
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
    showUsers: function () {
      this.loading = true
      this.users = []
      getDomainUsers((err, users) => {
        if (err) {
          this.error = 'Error llegins usuaris "' + err.message + '"'
          this.showError = true
        } else {
          Object.keys(users).forEach(user => {
            if (!this.onlywithoutcode || users[user].withoutcode || (users[user].id.length < 15)) {
              if (!this.onlynotsession || (users[user].lastLoginTime.getFullYear() < 1980)) {
                if (!this.onlywithoutorgunit || (users[user].organizationalUnit === '/')) {
                  if (!this.onlyteachers || users[user].teacher) {
                    if (!this.onlyactive || !users[user].suspended) {
                      if (!this.group || users[user].groups.includes(this.group)) {
                        this.users.push(users[user])
                      }
                    }
                  }
                }
              }
            }

            /*
                    if (empty($selectedgroup)) {
                      $group_ok = TRUE;
                    } else {
                      $group_ok = FALSE;
                      foreach ($domainuser->groups as $group) {
                        if ((strpos($group, $selectedgroup) !== FALSE && strpos($group, $selectedgroup) == 0)) {
                          $group_ok = TRUE;
                        }
                      }
                    }
                    if ($group_ok) {
            */
          })
        }
        this.loading = false
        this.$bvModal.show('modal-ok')
      })
    }
  }
}
</script>

<style>

</style>
