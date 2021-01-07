import {DomainUser} from '@/api/DomainUser'
import {config} from '@/config'

const parseString = require('xml2js').parseString

/**
 * Enumeració de tipus d'usuaris
 */
const USERTYPE = {
  student: 0,
  teacher: 1,
  tutor: 2
}

/**
 * Retorna l'string capitalitzat (mb_convert_case() a PHP)
 */
const titleCase = (str) => {
  let res = ''
  let words = str.split(' ')
  words.forEach(word => {
    res = res.concat(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ')
  })
  return res.trim()
}

/**
 * A partir del nom del grup i el tipus d'usuari, retorna el mail del grup
 */
const getGroupEmails = (logs, groupName, usertype) => {
  let name = groupName.toLowerCase()
  let email = []
  let curs = name.match(/\d+/) // Agafam el curs dels números del string
  let grup = name.slice(-1) // Agafam el nom del grup del darrer caràcter del string
  let groupPrefix

  if (usertype === USERTYPE.student) {
    groupPrefix = config().groupPrefixStudents
  } else if (usertype === USERTYPE.tutor) {
    groupPrefix = config().groupPrefixTutors
  } else {
    groupPrefix = config().groupPrefixTeachers
  }

  if (name.includes('batx')) {
    // Batxillerat
    email.push(groupPrefix + 'bat' + curs + grup)
  } else if (name.includes('eso')) {
    // ESO
    email.push(groupPrefix + 'eso' + curs + grup)
  } else {
    // Formació Professional
    let fpName = name.split(' ')[0]
    if (fpName in config().groupNameConversion) {
      if (grup in config().groupNameConversion[fpName].groups) {
        let fpConvertedName = config().groupNameConversion[fpName].name
        let groupNames = []
        if (usertype === USERTYPE.student) {
          groupNames = config().groupNameConversion[fpName].groups[grup].student
        } else {
          groupNames = config().groupNameConversion[fpName].groups[grup].teacher
        }
        groupNames.forEach(groupName => {
          if (groupName) {
            // Si tenim configurat el grup de destí...
            email.push(groupPrefix + fpConvertedName + groupName)
          }
        })
      } else {
        // Si no està configurat a "groupNameConversion", l'afegim igualment
        email.push(groupPrefix + fpName + grup)
        /* let msg = 'ATENCIÓ: El grup ' + fpName + grup + ' no està configurat a "groupNameConversion" al fitxer config().json'
        if (logs.indexOf(msg) === -1) { logs.push(msg) } */
      }
    } else {
      // Si no està configurat a "groupNameConversion", l'afegim igualment
      email.push(groupPrefix + fpName + grup)
      /* let msg = 'ATENCIÓ: El grup ' + fpName + ' no està configurat a "groupNameConversion" al fitxer config().json'
      if (logs.indexOf(msg) === -1) { logs.push(msg) } */
    }
  }
  return email
}

/**
 * Llegeix els grups i els tutors del XML
 */
const readXmlGroups = (logs, xmlfile) => {
  logs.push('Carregant grups de l\'XML...')
  let xmlgroups = []
  let xmltutors = []

  // Per cada curs i grup...
  for (let i in xmlfile.CENTRE_EXPORT.CURSOS[0].CURS) {
    let curs = xmlfile.CENTRE_EXPORT.CURSOS[0].CURS[i].$

    for (let j in xmlfile.CENTRE_EXPORT.CURSOS[0].CURS[i].GRUP) {
      let grup = xmlfile.CENTRE_EXPORT.CURSOS[0].CURS[i].GRUP[j].$

      // Afegim el grup a xmlgroups
      xmlgroups[grup.codi] = curs.descripcio + ' ' + grup.nom

      // Si el grup té tutor, afegim a xmltutors el nom del grup
      if (grup.tutor) {
        if (!xmltutors[grup.tutor]) {
          xmltutors[grup.tutor] = []
        }
        xmltutors[grup.tutor].push(curs.descripcio + ' ' + grup.nom)
      } else {
        let msg = 'ATENCIÓ: El grup ' + curs.descripcio + ' ' + grup.nom + ' no té tutor assignat al fitxer XML'
        if (logs.indexOf(msg) === -1) { logs.push(msg) }
      }
      // Si el grup té 2n tutor, afegim a xmltutors el nom del grup
      if (grup.tutor2) {
        if (!xmltutors[grup.tutor2]) {
          xmltutors[grup.tutor2] = []
        }
        xmltutors[grup.tutor2].push(curs.descripcio + ' ' + grup.nom)
      }
    }
  }

  return {xmlgroups, xmltutors}
}

/**
 * A partir de l'horari del XML, emplena els grups dels professors
 */
const readXmlTimeTable = (logs, xmlfile, xmlgroups) => {
  logs.push('Carregant horari de l\'XML...')
  let xmltimetable = []

  for (let i in xmlfile.CENTRE_EXPORT.HORARIP[0].SESSIO) {
    let sessio = xmlfile.CENTRE_EXPORT.HORARIP[0].SESSIO[i].$
    let emailsTeachers = []

    if (xmlgroups[sessio.grup]) {
      emailsTeachers = getGroupEmails(logs, xmlgroups[sessio.grup], USERTYPE.teacher)
    }

    let timetable = xmltimetable[sessio.professor]
    if (timetable) {
      // Juntam correus anteriors i afegim els actuals, i eliminam dupllicats
      emailsTeachers = emailsTeachers.concat(timetable)
      xmltimetable[sessio.professor] = Array.from(new Set(emailsTeachers))
    } else {
      xmltimetable[sessio.professor] = emailsTeachers
    }
  }

  return xmltimetable
}

/**
 * Llegeix els usuaris del XML
 */
const readXmlUsers = (logs, xmlfile, xmlgroups, xmltutors, xmltimetable) => {
  logs.push('Carregant usuaris de l\'XML...')
  let xmlusers = {}

  // Afegim els alumnes
  for (let i in xmlfile.CENTRE_EXPORT.ALUMNES[0].ALUMNE) {
    let student = xmlfile.CENTRE_EXPORT.ALUMNES[0].ALUMNE[i].$

    let emailsstudent = []
    if (xmlgroups[student.grup]) {
      emailsstudent = getGroupEmails(logs, xmlgroups[student.grup], USERTYPE.student)
    }

    if (emailsstudent.length) { // Si l'alumne pertany a algún grup
      // Hi pot haver un alumne amb dues matrícules
      // Si ja existeix, actualitzar
      if (student.codi in xmlusers) {
        xmlusers[student.codi].groups = xmlusers[student.codi].groups.concat(emailsstudent)
      } else {
        xmlusers[student.codi] = new DomainUser(
          student.codi,
          titleCase(student.nom),
          titleCase(student.ap1 + ' ' + student.ap2),
          titleCase(student.ap1),
          titleCase(student.ap2),
          null, // domainemail
          false, // suspended
          false, // teacher
          false, // withoutcode
          emailsstudent, // groups
          student.expedient, // expedient
          null, // organizationalUnit
          null // lastLoginTime
        )
      }
    }
  }

  // Afegim els professors
  for (let i in xmlfile.CENTRE_EXPORT.PROFESSORS[0].PROFESSOR) {
    let teacher = xmlfile.CENTRE_EXPORT.PROFESSORS[0].PROFESSOR[i].$

    let emailsteacher = []

    // Afegim grups educatius al professor
    if (xmltimetable[teacher.codi]) {
      emailsteacher = xmltimetable[teacher.codi]
    }

    // Afegim grup de departament al professor
    if (teacher.departament) {
      if (teacher.departament in config().departmentNumberToName) {
        emailsteacher.push(config().groupPrefixDepartment + config().departmentNumberToName[teacher.departament])
      } else {
        let msg = 'ATENCIÓ: El departament ' + teacher.departament + ' no està configurat a "departmentNumberToName" al fitxer config().json'
        if (logs.indexOf(msg) === -1) { logs.push(msg) }
      }
    } else {
      let msg = 'ATENCIÓ: El professor ' + teacher.ap1 + ' ' + teacher.ap2 + ', ' + teacher.nom + ' no té departament assignat al fitxer XML'
      if (logs.indexOf(msg) === -1) { logs.push(msg) }
    }

    // Si és tutor, afegim el grups dels que és tutor
    if (teacher.codi in xmltutors) {
      xmltutors[teacher.codi].forEach(tutorgroup => {
        let grouptutors = getGroupEmails(logs, tutorgroup, USERTYPE.tutor)
        emailsteacher = emailsteacher.concat(grouptutors)
      })
    }

    xmlusers[teacher.codi] = new DomainUser(
      teacher.codi,
      titleCase(teacher.nom),
      titleCase(teacher.ap1 + ' ' + teacher.ap2),
      titleCase(teacher.ap1),
      titleCase(teacher.ap2),
      null, // domainemail
      false, // suspended
      true, // teacher
      false, // withoutcode
      emailsteacher, // groups
      null, // expedient
      null, // organizationalUnit
      null // lastLoginTime
    )
  }

  return xmlusers
}

/**
 * Llegeix el fitxer XML
 */
const readXmlFile = (xmlfile, logs, callback) => {
  parseString(xmlfile, (err, xmldata) => {
    if (err) return callback(err, null)

    // kkkkk TODO: Comprovar codi del centre
    let {xmlgroups, xmltutors} = readXmlGroups(logs, xmldata)
    let xmltimetable = readXmlTimeTable(logs, xmldata, xmlgroups)
    let xmlusers = readXmlUsers(logs, xmldata, xmlgroups, xmltutors, xmltimetable)
    callback(null, xmlusers)
  })
}

export {readXmlFile}
