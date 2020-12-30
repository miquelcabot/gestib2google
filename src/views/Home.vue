<template>
  <div class="card shadow mb-4">
    <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Inici</h6>
    </div>
    <div class="card-body">
        <p>Benvingut al programa d'importació de dades del GestIB al domini de Google.</p>
        <p>El fitxer XML amb les dades del professorat/alumnat s'ha de descarregar del <a href="https://www3.caib.es/xestib/">GestIB</a>, de l'opció de menú "Alumnat --> Exportació dades SGD".</p>
        <p>S'actualitzaran les dades del professorat i l'alumnat del domini Google <strong>{{ domain }}</strong>.</p>
        <p>Només s'actualitzaran els usuaris del domini que estiguin a les unitats organitzatives <strong>"/"</strong>, <strong>"{{ organizationalUnitTeachers }}"</strong> i <strong>"{{ organizationalUnitStudents }}"</strong> i tenguin un Employee_ID.</p>
        <p>Els nous usuaris es crearan amb el password per defecte <strong>"{{ defaultPassword }}"</strong> i l'hauran de canviar el primer pic que entrin.</p>
    </div>
  </div>
</template>

<script>
import config from '@/config'

export default {
  name: 'Home',
  data () {
    return {
      domain: '',
      organizationalUnitTeachers: '',
      organizationalUnitStudents: '',
      defaultPassword: ''
    }
  },
  mounted () {
    this.domain = config.domain
    this.organizationalUnitTeachers = config.organizationalUnitTeachers
    this.organizationalUnitStudents = config.organizationalUnitStudents
    this.defaultPassword = config.defaultPassword
  }
}
</script>

<style>

</style>
