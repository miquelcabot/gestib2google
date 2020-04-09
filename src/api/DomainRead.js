import {oauth2ClientService} from './Oauth2Client'
import {DomainUser} from './DomainUser'

/**
 * Retorna els grups d'usuaris "alumnat." del domini
 */
const getDomainGroupsStudents = (domainGroups, nextPageToken, callback) => {
  if (!domainGroups) {
    domainGroups = {}
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
      // Carregam nomes grups d'alumnat
      if (group.email.startsWith('alumnat.')) {
        domainGroups[group.email.replace('@cifpfbmoll.eu', '')] = {
          'email': group.email.replace('@cifpfbmoll.eu', ''),
          'id': group.id,
          'name': group.name
        }
      }
    })

    if (res.data.nextPageToken) {
      getDomainGroupsStudents(domainGroups, res.data.nextPageToken, callback)
    } else {
      return callback(null, domainGroups)
    }
  })
}

/**
 * Retorna tots els grups d'usuaris del domini
 */
const getDomainGroups = (domainGroups, nextPageToken, callback) => {
  if (!domainGroups) {
    domainGroups = {}
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
      domainGroups[group.email.replace('@cifpfbmoll.eu', '')] = {
        'email': group.email.replace('@cifpfbmoll.eu', ''),
        'id': group.id,
        'name': group.name
      }
    })

    if (res.data.nextPageToken) {
      getDomainGroups(domainGroups, res.data.nextPageToken, callback)
    } else {
      return callback(null, domainGroups)
    }
  })
}

/**
 * Retorna els membres d'un grup
 */
const getDomainMembers = (groupId, callback) => {
  let membersgroup = []

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
const getDomainGroupsMembers = (callback) => {
  getDomainGroups(null, null, (err, groups) => {
    if (err) return callback(err, null)

    let membersok = 0
    Object.keys(groups).forEach((group) => {
      // We read the members of this group
      getDomainMembers(groups[group].id, (err, res) => {
        if (err) return callback(err, null)

        membersok++
        groups[group].members = res
        if (membersok >= Object.keys(groups).length) {
          return callback(null, groups)
        }
      })
    })
  })
}

/**
 * Retorna tots els usuaris del domini, amb inforació extra
 */
const getAllDomainUsers = (users, nextPageToken, callback) => {
  if (!users) {
    users = []
  }

  // Carregam els usuaris de 500 en 500, que és el valor màxim de maxResults, paginant la resta
  oauth2ClientService().users.list({
    customer: 'my_customer',
    maxResults: 500,
    pageToken: nextPageToken,
    orderBy: 'email'
  }, (err, res) => {
    if (err) return callback(err, null)

    users = users.concat(res.data.users)
    if (res.data.nextPageToken) {
      getAllDomainUsers(users, res.data.nextPageToken, callback)
    } else {
      return callback(null, users)
    }
  })
}

/**
 * Retorna tots els usuaris del domini, amb informació extra
 */
const getDomainUsers = (callback) => {
  let domainUsers = {}

  getDomainGroupsMembers((err, groups) => {
    if (err) return callback(err, null)

    getAllDomainUsers(null, null, (err, users) => {
      if (err) return callback(err, null)

      let userWithoutCode = 0
      users.forEach(user => {
        let id
        let withoutcode = false
        if (user.externalIds && user.externalIds[0].value) {
          id = user.externalIds[0].value
        } else {
          userWithoutCode++
          id = 'WITHOUTCODE' + userWithoutCode
          withoutcode = true
        }

        // Afegim tots els grups del que és membre
        let groupMember = []
        Object.keys(groups).forEach(groupname => {
          groups[groupname].members.forEach(m => {
            if (user.primaryEmail === m) {
              groupMember.push(groupname)
            }
          })
        })

        domainUsers[id] = new DomainUser(
          id,
          user.name.givenName,
          user.name.familyName,
          null, // surname1
          null, // surname2
          user.primaryEmail, // domainemail
          user.suspended, // suspended
          user.orgUnitPath.toLowerCase().indexOf('professor') >= 0, // teacher
          withoutcode, // withoutcode
          groupMember, // groups
          null, // expedient
          user.orgUnitPath, // organizationalUnit
          user.lastLoginTime // lastLoginTime
        )
      })

      // Retornam domainUsers
      callback(null, domainUsers)
    })
  })
}

export {getDomainGroupsStudents, getDomainUsers}
