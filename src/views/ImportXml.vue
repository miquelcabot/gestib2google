<template>
  <div>
    <b-alert v-model="showError" variant="danger" dismissible>
      <strong>ERROR: </strong>{{error}}
    </b-alert>
    <b-modal id="modal-ok" title="GestIB2Google" ok-only>
      <p class="my-4">Procés finalitzat!</p>
    </b-modal>
    <div class="card shadow mb-4">
      <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">Importar fitxer XML de GestIB</h6>
      </div>
      <div class="card-body">
        <form @submit.prevent>
          <div class="form-group">
            <div class="custom-file">
              <input type="file" id="xmlfile" name="xmlfile"  class="custom-file-input" placeholder="Fitxer XML de GestIB" @change="loadXmlFile" :disabled="loading">
              <label class="custom-file-label" for="xmlfile">{{ xmlFile ? xmlFile.name: 'Fitxer XML de GestIB' }}</label>
            </div>
          </div>
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
              <input class="form-check-input" id="apply" name="apply" type="checkbox"  v-model="apply" :disabled="loading"> Aplicar canvis</label>
            </div>
          </div>
          <button class="btn btn-primary" v-on:click="importGestib()" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm"></span>
            {{ loading ? 'Important ...' : 'Importar' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {getDomainGroupsStudents, getDomainUsers} from '../api/DomainRead'
import {readXmlFile} from '../api/XmlFile'

export default {
  name: 'ImportXml',
  data () {
    return {
      xmlFile: null,
      group: '',
      onlyteachers: false,
      apply: false,
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
    loadXmlFile (event) {
      // Guardam la informació del fitxer que hem de carregar a xmlFile
      this.xmlFile = event.target.files[0]
    },
    importGestib () {
      this.loading = true

      // Llegim el fitxer XML com a text
      const reader = new FileReader()
      reader.onload = (evt) => {
        readXmlFile(reader.result, (err, xmlusers) => {
          if (err) {
            this.error = 'Error llegint XML "' + err.message + '"'
            this.showError = true
          } else {
            getDomainUsers((err, domainusers, domaingroups) => {
              if (err) {
                this.error = 'Error llegint XML "' + err.message + '"'
                this.showError = true
              } else {
                console.log(xmlusers)
                console.log(domainusers)
                console.log(domaingroups)
              }
              this.loading = false
              this.$bvModal.show('modal-ok')
            })
          }
        })
      }
      reader.readAsText(this.xmlFile)
    }
  }
}
</script>

<style>

</style>
