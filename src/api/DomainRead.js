import {oauth2ClientService} from './Oauth2Client'

/**
 * Retorna els grups d'usuaris "alumnat." del domini
 */
const getDomainGroupsStudents = (domaingroups, nextPageToken, callback) => {
  if (!domaingroups) {
    domaingroups = {}
  }

  // Carregam els grups 200 a 200, que és el valor màxim de maxResults, paginant la resta
  oauth2ClientService().groups.list({
    customer: 'my_customer',
    maxResults: 200,
    pageToken: nextPageToken,
    orderBy: 'email'
  }, (err, res) => {
    if (err) return callback(err, null)

    const groups = res.data.groups
    groups.forEach((group) => {
      // Carregam nomes grups de alumnat, equip educatiu i tutors
      if (group.email.startsWith('alumnat.')) {
        domaingroups[group.email.replace('@cifpfbmoll.eu', '')] = {
          'email': group.email.replace('@cifpfbmoll.eu', ''),
          'id': group.id,
          'name': group.name
        }
      }
    })

    if (res.nextPageToken) {
      getDomainGroupsStudents(domaingroups, res.nextPageToken, callback)
    } else {
      return callback(null, domaingroups)
    }
  })
}

/**
 * Retorna tots els grups d'usuaris del domini
 */
const getDomainGroups = (domaingroups, nextPageToken, callback) => {
  if (!domaingroups) {
    domaingroups = {}
  }

  // Carregam els grups 200 a 200, que és el valor màxim de maxResults, paginant la resta
  oauth2ClientService().groups.list({
    customer: 'my_customer',
    maxResults: 200,
    pageToken: nextPageToken,
    orderBy: 'email'
  }, (err, res) => {
    if (err) return callback(err, null)

    const groups = res.data.groups
    groups.forEach((group) => {
      domaingroups[group.email.replace('@cifpfbmoll.eu', '')] = {
        'email': group.email.replace('@cifpfbmoll.eu', ''),
        'id': group.id,
        'name': group.name
      }
    })

    if (res.nextPageToken) {
      getDomainGroups(domaingroups, res.nextPageToken, callback)
    } else {
      return callback(null, domaingroups)
    }
  })
}

/**
 * Retorna els membres d'un grup
 */
const getDomainMembers = (groupId, callback) => {
  var membersgroup = []

  oauth2ClientService().members.list({
    customer: 'my_customer',
    groupKey: groupId,
    maxResults: 100000
  }, (err, res) => {
    if (err) return callback(err, null)

    if (res.data.members) {
      const members = res.data.members
      Object.keys(members).forEach(id => {
        membersgroup.push(members[id].email)
      })
    }

    callback(null, membersgroup)
  })
}

/**
 * Retorna tots els grups d'usuaris del domini, amb els seus membres
 */
const getDomainGroupsMembers = (domaingroups, nextPageToken, callback) => {
  getDomainGroups(null, null, (err, domaingroups) => {
    if (err) return callback(err, null)

    let membersok = 0
    Object.keys(domaingroups).forEach((group) => {
      // We read the members of this group
      getDomainMembers(domaingroups[group].id, (err, res) => {
        if (err) return callback(err, null)

        membersok++
        domaingroups[group].members = res
        if (membersok >= Object.keys(domaingroups).length) {
          return callback(null, domaingroups)
        }
      })
    })
  })
}

export {getDomainGroupsStudents, getDomainGroupsMembers}
