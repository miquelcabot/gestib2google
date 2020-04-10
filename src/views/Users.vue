<template>
  <div>
    <b-alert v-model="showError" variant="danger" dismissible>
      <strong>ERROR: </strong>{{error}}
    </b-alert>
    <div class="card shadow mb-4">
      <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Mostrar usuaris del domini</h6>
      </div>
      <div class="card-body">
        <form @submit.prevent>
          <div class="form-group">
            <label for="groupsdomainusers" class="col-sm-2 col-form-label">Grups</label>
            <div class="col-sm-10">
              <select class="form-control" id="groupsdomainusers" name="group">
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
                <input class="form-check-input" id="onlyactive" name="onlyactive" type="checkbox"> Només usuaris actius</label>
              </div>
          </div>
          <div class="form-group">
              <div class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" id="onlywithoutcode" name="onlywithoutcode" type="checkbox"> Només els usuaris sense ID
                </label>
              </div>
          </div>
          <div class="form-group">
              <div class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" id="onlynotsession" name="onlynotsession" type="checkbox"> Només els usuaris que no han iniciat mai sessió
                </label>
              </div>
          </div>
          <div class="form-group">
              <div class="form-check">
                <label class="form-check-label">
                  <input class="form-check-input" id="onlywithoutorgunit" name="onlywithoutorgunit" type="checkbox"> Només els usuaris de la Unitat Organitzativa principal (/)
                </label>
              </div>
            </div>
          <div class="form-group">
            <button class="btn btn-primary" v-on:click="showUsers()">Mostrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {getDomainGroupsStudents, getDomainUsers} from '../api/DomainRead'

export default {
  name: 'Users',
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
    showUsers: function () {
      getDomainUsers((err, users) => {
        if (err) {
          this.error = 'Error llegins usuaris "' + err.message + '"'
          this.showError = true
        }

        console.log(users)
      })
    }
  }
}
</script>

<style>

</style>
