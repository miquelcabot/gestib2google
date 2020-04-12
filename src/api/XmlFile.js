import {DomainUser} from './DomainUser'
import * as config from '../config.json'

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
  let word = str.split(' ')
  for (let i = 0; i < word.length; i++) {
    res = res.concat(word[i].charAt(0).toUpperCase() + word[i].slice(1).toLowerCase() + ' ')
  }

  return res.trim()
}

/**
 * A partir del nom del grup i el tipus d'usuari, retorna el mail del grup
 */
const getGroupEmails = (groupName, usertype) => {
  let name = groupName.toLowerCase()
  let email = []
  let curs = name.match(/\d+/) // Agafam el curs dels números del string
  let grup = name.slice(-1) // Agafam el nom del grup del darrer caràcter del string
  let groupPrefix

  if (usertype === USERTYPE.student) {
    groupPrefix = config.groupPrefixStudents
  } else if (usertype === USERTYPE.tutor) {
    groupPrefix = config.groupPrefixTutors
  } else {
    groupPrefix = config.groupPrefixTeachers
  }

  if (name.includes('batx')) {
    email.push(groupPrefix + 'bat' + curs + grup)
  } else if (name.includes('eso')) {
    email.push(groupPrefix + 'eso' + curs + grup)
  } else {
    // Formació Professional

  }
  return email
}

/**
 * Llegeix els grups i els tutors del XML
 */
const readXmlGroups = (xmlfile) => {
  console.log('Carregant grups de l\'XML...')
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
        if (!xmltutors.includes(grup.tutor)) {
          xmltutors[grup.tutor] = []
        }
        xmltutors[grup.tutor].push(curs.descripcio + ' ' + grup.nom)
      } else {
        console.log('ATENCIÓ: El grup ' + curs.descripcio + ' ' + grup.nom + ' no té tutor assignat al fitxer XML')
      }
      // Si el grup té 2n tutor, afegim a xmltutors el nom del grup
      if (grup.tutor2) {
        if (!xmltutors.includes(grup.tutor2)) {
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
const readXmlTimeTable = (xmlfile, xmlgroups) => {
  console.log('Carregant horari de l\'XML...')
  let xmltimetable = []

  for (let i in xmlfile.CENTRE_EXPORT.HORARIP[0].SESSIO) {
    let sessio = xmlfile.CENTRE_EXPORT.HORARIP[0].SESSIO[i].$
    let emailsTeachers = []

    let xmlgroupname = xmlgroups[sessio.grup]
    if (xmlgroupname != null) {
      emailsTeachers = getGroupEmails(xmlgroupname, USERTYPE.teacher)
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
const readXmlUsers = (xmlfile, xmlgroups, xmltutors, xmltimetable) => {
  console.log('Loading XML users...')
  let xmlusers = {}

  // Afegim els alumnes
  for (let i in xmlfile.CENTRE_EXPORT.ALUMNES[0].ALUMNE) {
    let student = xmlfile.CENTRE_EXPORT.ALUMNES[0].ALUMNE[i].$

    let emailsstudent = []
    if (xmlgroups[student.grup]) {
      emailsstudent = xmlgroups[student.grup].emailsstudents
    }

    xmlusers[student.codi] = new DomainUser(
      student.codi,
      titleCase(student.nom),
      titleCase(student.ap1 + ' ' + student.ap2),
      titleCase(student.ap1),
      titleCase(student.ap2),
      null, // domainemail
      false, // suspended
      false, // teacher
      false, // tutor
      false, // withoutcode
      emailsstudent // groups
    )
  }

  // Afegim els professors
  for (let i in xmlfile.CENTRE_EXPORT.PROFESSORS[0].PROFESSOR) {
    let teacher = xmlfile.CENTRE_EXPORT.PROFESSORS[0].PROFESSOR[i].$

    let emailsteacher = []
    if (xmltimetable[teacher.codi]) {
      emailsteacher = xmltimetable[teacher.codi]
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
      xmltutors.includes(teacher.codi), // tutor
      false, // withoutcode
      emailsteacher // groups
    )
  }
  return xmlusers
}

/**
 * Llegeix el fitxer XML
 */
const readXmlFile = (xmlfile, callback) => {
  parseString(xmlfile, (err, xmldata) => {
    if (err) return callback(err, null)

    let {xmlgroups, xmltutors} = readXmlGroups(xmldata)
    console.log(xmlgroups)
    console.log(xmltutors)
    let xmltimetable = readXmlTimeTable(xmldata, xmlgroups)
    console.log(xmltimetable)
    let xmlusers = readXmlUsers(xmldata, xmlgroups,
      xmltutors, xmltimetable)
    callback(null, xmlusers)
  })
}

export {readXmlFile}
