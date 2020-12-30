<template>
  <div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Configuració</h6>
    </div>
    <div class="card-body">
      <form @submit.prevent>
        <div class="form-group">
          <label for="domain">Domini</label>
          <input class="form-control" id="domain" name="domain" type="text" v-model="domain" disabled>
        </div>
        <div class="form-group">
          <label for="defaultPassword">Password per defecte dels nous usuaris</label>
          <input class="form-control" id="defaultPassword" name="defaultPassword" type="text" v-model="defaultPassword" disabled>
        </div>
        <div class="form-group">
          <label for="groupPrefixDepartment">Prefix dels grups de departaments</label>
          <input class="form-control" id="groupPrefixDepartment" name="groupPrefixDepartment" type="text" v-model="groupPrefixDepartment" disabled>
        </div>
        <div class="form-group">
          <label for="groupPrefixTeachers">Prefix dels grups de professors (equips educatius)</label>
          <input class="form-control" id="groupPrefixTeachers" name="groupPrefixTeachers" type="text" v-model="groupPrefixTeachers" disabled>
        </div>
        <div class="form-group">
          <label for="groupPrefixStudents">Prefix dels grups d'alumnes</label>
          <input class="form-control" id="groupPrefixStudents" name="groupPrefixStudents" type="text" v-model="groupPrefixStudents" disabled>
        </div>
        <div class="form-group">
          <label for="groupPrefixTutors">Prefix dels grups de tutors</label>
          <input class="form-control" id="groupPrefixTutors" name="groupPrefixTutors" type="text" v-model="groupPrefixTutors" disabled>
        </div>
        <div class="form-group">
          <label for="organizationalUnitTeachers">Nom de l'Unitat Organitzativa del professorat</label>
          <input class="form-control" id="organizationalUnitTeachers" name="organizationalUnitTeachers" type="text" v-model="organizationalUnitTeachers" disabled>
        </div>
        <div class="form-group">
          <label for="organizationalUnitStudents">Nom de l'Unitat Organitzativa de l'alumnat</label>
          <input class="form-control" id="organizationalUnitStudents" name="organizationalUnitStudents" type="text" v-model="organizationalUnitStudents" disabled>
        </div>
        <div class="form-group">
          <label for="longStudentsEmail">Format de l'email de l'alumnat</label>
          <select class="form-control" id="longStudentsEmail" name="longStudentsEmail" v-model="longStudentsEmail" disabled>
            <option v-bind:value="false">Format curt (apl01@domini)</option>
            <option v-bind:value="true">Format llarg (apalou@domini)</option>
          </select>
        </div>
        <hr class="separator">
        <div class="alert alert-warning" role="alert">
          Per especificar el format dels emails d'alumnat i professorat es pot especificar:
          <ul>
            <li>Prefix, abans del nom d'usuari</li>
            <li>Format del nom d'usuari
              <ul>
                <li>"n" inicial del nom, o "nnn" nom complet</li>
                <li>"1" inicial del 1r llinatge, o "111" 1r llinatge complet</li>
                <li>"2" inicial del 2n llinatge, o "222" 2n llinatge complet</li>
                <li>"0" nombres aleatoris</li>
                <li>",.-" altres caràcters</li>
              </ul>
            </li>
            <li>Domini personalitzat</li>
          </ul>
        </div>
        <div class="form-group">
          <label for="teachersEmailPrefix">Prefix de l'email del professorat</label>
          <input class="form-control" id="teachersEmailPrefix" name="teachersEmailPrefix" type="text" v-model="teachersEmailPrefix" disabled>
        </div>
        <div class="form-group">
          <label for="teachersEmailFormat">Format de l'email del professorat</label>
          <input class="form-control" id="teachersEmailFormat" name="teachersEmailFormat" type="text" v-model="teachersEmailFormat" disabled>
        </div>
        <div class="form-group">
          <label for="teachersEmailCustomDomain">Domini personalitzat de l'email del professorat</label>
          <input class="form-control" id="teachersEmailCustomDomain" name="teachersEmailCustomDomain" type="text" v-model="teachersEmailCustomDomain" disabled>
        </div>
        <hr class="separator">
        <div class="form-group">
          <label for="studentsEmailPrefix">Prefix de l'email de l'alumnat</label>
          <input class="form-control" id="studentsEmailPrefix" name="studentsEmailPrefix" type="text" v-model="studentsEmailPrefix" disabled>
        </div>
        <div class="form-group">
          <label for="studentsEmailFormat">Format de l'email de l'alumnat</label>
          <input class="form-control" id="studentsEmailFormat" name="studentsEmailFormat" type="text" v-model="studentsEmailFormat" disabled>
        </div>
        <div class="form-group">
          <label for="studentsEmailCustomDomain">Domini personalitzat de l'email de l'alumnat</label>
          <input class="form-control" id="studentsEmailCustomDomain" name="studentsEmailCustomDomain" type="text" v-model="studentsEmailCustomDomain" disabled>
        </div>
        <!--
        <div class="form-group">
          <button class="btn btn-secondary" v-on:click="saveConfig()" disabled>Restablir</button>
          <button class="btn btn-primary" v-on:click="saveConfig()" disabled>Guardar</button>
        </div>
        -->
      </form>
    </div>
  </div>
</template>

<script>
import {config} from '@/config'

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
      longStudentsEmail: false,
      teachersEmailPrefix: '',
      teachersEmailFormat: '',
      teachersEmailCustomDomain: '',
      studentsEmailPrefix: '',
      studentsEmailFormat: '',
      studentsEmailCustomDomain: ''
    }
  },
  mounted () {
    this.domain = config().domain
    this.defaultPassword = config().defaultPassword
    this.groupPrefixDepartment = config().groupPrefixDepartment
    this.groupPrefixTeachers = config().groupPrefixTeachers
    this.groupPrefixStudents = config().groupPrefixStudents
    this.groupPrefixTutors = config().groupPrefixTutors
    this.organizationalUnitTeachers = config().organizationalUnitTeachers
    this.organizationalUnitStudents = config().organizationalUnitStudents
    this.longStudentsEmail = config().longStudentsEmail
    this.teachersEmailPrefix = config().teachersEmailPrefix
    this.teachersEmailFormat = config().teachersEmailFormat
    this.teachersEmailCustomDomain = config().teachersCustomDomain
    this.studentsEmailPrefix = config().studentsEmailPrefix
    this.studentsEmailFormat = config().studentsEmailFormat
    this.studentsEmailCustomDomain = config().studentsCustomDomain
  },
  methods: {
    saveConfig () {
      // kkk TODO: Guardar configuració
    }
  }
}
</script>

<style>

</style>
