import {oauth2ClientService} from './Oauth2Client'

/**
 * Lists the groups of students in the domain.
 */
function getDomainGroupsStudents (domaingroups, nextPageToken, callback) {
  if (!domaingroups) {
    domaingroups = {}
  }

  // Carregam els grups 200 a 200, que és el valor màxim de maxResults, paginant la resta
  oauth2ClientService().groups.list({
    customer: 'my_customer',
    maxResults: 200,
    pageToken: nextPageToken,
    orderBy: 'email'
  }, function (err, res) {
    if (err) return callback(err, null)

    const groups = res.data.groups
    groups.forEach((group) => {
      // Carregam nomes grups de alumnat, equip educatiu i tutors
      if (group.email.startsWith('alumnat.')) {
        // console.log(`${group.email} (${group.email})`)
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

export {getDomainGroupsStudents}
