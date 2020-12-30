import config from '@/config'

const pad = (num, size) => {
  let s = num + ''
  while (s.length < size) {
    s = '0' + s
  }
  return s
}

/*
 * Eliminar accents, ñ, ...
 */
const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const normalizedName = (name) => {
  let tokens = removeAccents(name.toLowerCase()).split(' ')
  let names = []
  // Words with compound names and surnames
  const especialTokens = ['da', 'de', 'di', 'do', 'del', 'la', 'las', 'le', 'los',
    'mac', 'mc', 'van', 'von', 'y', 'i', 'san', 'santa', 'al', 'el']

  tokens.forEach(token => {
    if (especialTokens.indexOf(token) < 0) { // If token not in especialTokens
      names.push(token)
    }
  })

  if (names.length >= 1) { // If name exists (with name or surname)
    return names[0]
  } else { // If name not exists (without name or surname)
    return '_'
  }
}

/*
 * Classe per guardar la informació dels usuaris
 */
class DomainUser {
  constructor (id, name, surname, surname1, surname2, domainemail, suspended,
    teacher, withoutcode, groups, expedient, organizationalUnit, lastLoginTime) {
    this.id = id
    this.name = name
    this.surname1 = surname1
    this.surname2 = surname2
    this.surname = surname
    this.domainemail = domainemail
    this.suspended = suspended
    this.teacher = teacher
    this.withoutcode = withoutcode
    this.groups = groups
    this.expedient = expedient
    this.organizationalUnit = organizationalUnit
    this.lastLoginTime = lastLoginTime
  }

  email () {
    if (this.domainemail) {
      return this.domainemail
    } else if (this.teacher || (config.longStudentsEmail === true)) {
      let email = normalizedName(this.name.substring(0, 1)) + normalizedName(this.surname1)
      return email + '@' + config.domain
    } else if (config.longStudentsEmail === '2surnames') { // Email amb dos llinatges (m.cabotnadal@)
      let email = normalizedName(this.name.substring(0, 1)) +
        '.' +
        normalizedName(this.surname1) +
        normalizedName(this.surname2)
      return email + '@' + config.domain
    } else {
      let email = normalizedName(this.name.substring(0, 1)) +
        normalizedName(this.surname1.substring(0, 1)) +
        normalizedName(this.surname2.substring(0, 1))
      return email + pad(0, 2) + '@' + config.domain
    }
  }

  user () {
    return this.email().replace('@' + config.domain, '')
  }

  groupsWithDomain () {
    let gr = []
    this.groups.forEach(group => {
      gr.push(group + '@' + config.domain)
    })

    return gr
  }

  groupsWithPrefix () {
    let gr = []
    this.groups.forEach(group => {
      if (group.startsWith(config.groupPrefixStudents) || group.startsWith(config.groupPrefixTeachers) || group.startsWith(config.groupPrefixTutors) || group.startsWith(config.groupPrefixDepartment)) {
        gr.push(group)
      }
    })

    return gr
  }

  groupsWithPrefixAdded () {
    return this.groups
  }

  toString () {
    // toString override added to prototype of DomainUser class
    return (this.teacher ? 'PROFESSOR ' : 'ALUMNE ') +
      this.surname + ', ' +
      this.name + ' (' +
      this.email() + ') [' +
      this.groups + ']'
  }
}

export {DomainUser, pad}
