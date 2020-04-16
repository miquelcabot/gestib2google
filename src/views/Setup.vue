<template>
  <div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Configuració</h6>
    </div>
    <div class="card-body">
      <form @submit.prevent>
        <div class="form-group">
          <label for="domain">Domini</label>
          <input class="form-control" id="domain" name="domain" type="text" v-model="domain">
        </div>
        <div class="form-group">
          <label for="defaultPassword">Password per defecte dels nous usuaris</label>
          <input class="form-control" id="defaultPassword" name="defaultPassword" type="text" v-model="defaultPassword">
        </div>
        <div class="form-group">
          <label for="groupPrefixDepartment">Prefix dels grups de departaments</label>
          <input class="form-control" id="groupPrefixDepartment" name="groupPrefixDepartment" type="text" v-model="groupPrefixDepartment">
        </div>
        <div class="form-group">
          <label for="groupPrefixTeachers">Prefix dels grups de professors (equips educatius)</label>
          <input class="form-control" id="groupPrefixTeachers" name="groupPrefixTeachers" type="text" v-model="groupPrefixTeachers">
        </div>
        <div class="form-group">
          <label for="groupPrefixStudents">Prefix dels grups d'estudiants</label>
          <input class="form-control" id="groupPrefixStudents" name="groupPrefixStudents" type="text" v-model="groupPrefixStudents">
        </div>
        <div class="form-group">
          <label for="groupPrefixTutors">Prefix dels grups de tutors</label>
          <input class="form-control" id="groupPrefixTutors" name="groupPrefixTutors" type="text" v-model="groupPrefixTutors">
        </div>
        <div class="form-group">
          <label for="organizationalUnitTeachers">Nom de l'Unitat Organitzativa del professorat</label>
          <input class="form-control" id="organizationalUnitTeachers" name="organizationalUnitTeachers" type="text" v-model="organizationalUnitTeachers">
        </div>
        <div class="form-group">
          <label for="organizationalUnitStudents">Nom de l'Unitat Organitzativa de l'alumnat</label>
          <input class="form-control" id="organizationalUnitStudents" name="organizationalUnitStudents" type="text" v-model="organizationalUnitStudents">
        </div>
        <div class="form-group">
          <label for="longStudentsEmail">Format de l'email de l'alumnat</label>
          <select class="form-control" id="longStudentsEmail" name="longStudentsEmail" v-model="longStudentsEmail">
            <option v-bind:value="false">Format curs (apl01@domini)</option>
            <option v-bind:value="true">Format llart (aperez@domini)</option>
          </select>
        </div>
        <div class="form-group">
          <button class="btn btn-secondary" v-on:click="spreadsheet()">Restablir</button>
          <button class="btn btn-primary" v-on:click="spreadsheet()">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import * as config from '../config.json'

export default {
  name: 'Setup',
  data () {
    return {
      domain: '',
      defaultPassword: '',
      groupPrefixDepartment: '',
      groupPrefixTeachers: '',
      groupPrefixStudents: '',
      groupPrefixTutors: '',
      organizationalUnitTeachers: '',
      organizationalUnitStudents: '',
      longStudentsEmail: false
    }
  },
  mounted () {
    this.domain = config.domain
    this.defaultPassword = config.defaultPassword
    this.groupPrefixDepartment = config.groupPrefixDepartment
    this.groupPrefixTeachers = config.groupPrefixTeachers
    this.groupPrefixStudents = config.groupPrefixStudents
    this.groupPrefixTutors = config.groupPrefixTutors
    this.organizationalUnitTeachers = config.organizationalUnitTeachers
    this.organizationalUnitStudents = config.organizationalUnitStudents
    this.longStudentsEmail = config.longStudentsEmail
  },
  methods: {
    spreadsheet () {
      alert('executar')
    }
  }
}
</script>

<style>

</style>
