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
const removeaccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const normalizedName = (name) => {
  let tokens = removeaccents(name.toLowerCase()).split(' ')
  let names = []
  // Words with compound names and surnames
  const especialTokens = ['da', 'de', 'di', 'do', 'del', 'la', 'las', 'le', 'los',
    'mac', 'mc', 'van', 'von', 'y', 'i', 'san', 'santa', 'al', 'el']

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i]
    if (especialTokens.indexOf(token) < 0) { // If token not in especialTokens
      names.push(token)
    }
  }

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
    } else if (this.teacher) {
      let email = normalizedName(this.name.substring(0, 1)) + normalizedName(this.surname1)
      return email + '@cifpfbmoll.eu'
    } else {
      let email = normalizedName(this.name.substring(0, 1)) +
        normalizedName(this.surname1.substring(0, 1)) +
        normalizedName(this.surname2.substring(0, 1))
      return email + pad(0, 2) + '@cifpfbmoll.eu'
    }
  }

  user () {
    return this.email().replace('@cifpfbmoll.eu', '')
  }

  groupswithdomain () {
    let gr = []
    for (let i = 0; i < this.groups.length; i++) {
      let group = this.groups[i]
      gr.push(group + '@cifpfbmoll.eu')
    }
    return gr
  }

  groupswithprefix () {
    let gr = []
    for (let i = 0; i < this.groups.length; i++) {
      let group = this.groups[i]
      if (group.startsWith('alumnat.') || group.startsWith('ee.') || group.startsWith('tutors')) {
        gr.push(group)
      }
    }
    return gr
  }

  groupswithprefixsimple () {
    let gr = []
    for (let i = 0; i < this.groups.length; i++) {
      let group = this.groups[i]
      if (group.startsWith('alumnat.') || group.startsWith('ee.') || group.startsWith('tutors')) {
        gr.push(group.replace('alumnat.', '').replace('ee.', ''))
      }
    }
    return gr
  }

  groupswithprefixadded () {
    let gr = []
    for (let i = 0; i < this.groups.length; i++) {
      let group = this.groups[i]
      if (this.teacher) {
        gr.push('ee.' + group)
      } else {
        gr.push('alumnat.' + group)
      }
    }
    if (this.teacher && this.tutor) {
      gr.push('tutors')
    }
    return gr
  }

  toString () {
    // toString override added to prototype of DomainUser class
    return (this.teacher ? 'TEACHER: ' : 'STUDENT: ') +
      this.surname + ', ' +
      this.name + ' (' +
      this.email() + ') [' +
      this.groups + ']'
  }
}

export {DomainUser, pad}
