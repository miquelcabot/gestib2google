import {DomainUser} from './DomainUser'
import * as config from '../config.json'

const parseString = require('xml2js').parseString

const titleCase = (str) => {
  let res = ''
  let word = str.split(' ')
  for (let i = 0; i < word.length; i++) {
    res = res.concat(word[i].charAt(0).toUpperCase() + word[i].slice(1).toLowerCase() + ' ')
  }

  return res.trim()
}

const getgroupemails = (groupName, isstudent) => {
  let name = groupName.toLowerCase()
  let email = []
  let curs = name.match(/\d+/) // We get the course from the numbers in the string
  let grup = name.slice(-1) // We get the group name from the last char of the string
  if (name.includes('batx')) {
    email.push('bat' + curs + grup)
  } else if (name.includes('eso')) {
    email.push('eso' + curs + grup)
  } else if (name.includes('ifc21')) {
    if (grup === 'a') {
      email.push('smx1')
    } else if (grup === 'b') {
      email.push('smx2')
    } else if ((grup === 'c') && isstudent) {
      // Si és estudiant, feim que grup C de SMX sigui de 1r i 2n
      email.push('smx1')
      email.push('smx2')
    }
  } else if (name.includes('ifc31')) {
    if (grup === 'a') {
      email.push('asix1')
    } else if (grup === 'b') {
      email.push('asix2')
    } else if ((grup === 'c') && isstudent) {
      // Si és estudiant, feim que grup C de ASIX sigui de 1r i 2n
      email.push('asix1')
      email.push('asix2')
    }
  }
  return email
}

const readXmlGroups = (xmlfile) => {
  console.log('Loading XML groups...')
  let xmlgroups = {}
  let xmltutors = []

  for (let i in xmlfile.CENTRE_EXPORT.CURSOS[0].CURS) {
    let curs = xmlfile.CENTRE_EXPORT.CURSOS[0].CURS[i].$

    for (let j in xmlfile.CENTRE_EXPORT.CURSOS[0].CURS[i].GRUP) {
      let grup = xmlfile.CENTRE_EXPORT.CURSOS[0].CURS[i].GRUP[j].$

      xmlgroups[grup.codi] = {
        'emailsstudents': getgroupemails(curs.descripcio + ' ' + grup.nom, true),
        'emailsteachers': getgroupemails(curs.descripcio + ' ' + grup.nom, false),
        'name': curs.descripcio + ' ' + grup.nom
      }
      xmltutors.push(grup.tutor)
      if (grup.tutor2) {
        xmltutors.push(grup.tutor2)
      }
    }
  }

  return {
    xmlgroups: xmlgroups,
    xmltutors: Array.from(new Set(xmltutors)) // Eliminam duplicats
  }
}

const readXmlTimeTable = (xmlfile, xmlgroups) => {
  console.log('Loading XML timetable...')
  let xmltimetable = {}

  for (let i in xmlfile.CENTRE_EXPORT.HORARIP[0].SESSIO) {
    let sessio = xmlfile.CENTRE_EXPORT.HORARIP[0].SESSIO[i].$
    let emailsTeachers = []

    let xmlgroup = xmlgroups[sessio.grup]
    if (xmlgroup != null) {
      emailsTeachers = emailsTeachers.concat(xmlgroup['emailsteachers'])
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
      config.domain,
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
      config.domain,
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

const readXmlFile = (xmlfile, callback) => {
  parseString(xmlfile, (err, xmldata) => {
    if (err) return callback(err, null)

    let groupstutors = readXmlGroups(xmldata)
    let xmltimetable = readXmlTimeTable(xmldata, groupstutors.xmlgroups)
    let xmlusers = readXmlUsers(xmldata, groupstutors.xmlgroups,
      groupstutors.xmltutors, xmltimetable)
    callback(null, xmlusers)
  })
}

export {readXmlFile}
