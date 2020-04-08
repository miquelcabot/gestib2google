import * as clientSecret from '../client_secret.json'

const {google} = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/admin.directory.orgunit',
  'https://www.googleapis.com/auth/spreadsheets']

/* eslint-disable camelcase */
const {client_secret, client_id} = clientSecret.web
const redirect_url = 'http://localhost:8080'

let oauth2Client = () => {
  const oauth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_url)

  let token = JSON.parse(localStorage.getItem('token'))
  if (token != null) {
    oauth2Client.setCredentials(token)
  }
  return oauth2Client
}

let oauth2ClientGenerateAuthUrl = () => {
  return oauth2Client().generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
}

let oauth2ClientService = () => {
  const auth = oauth2Client()
  return google.admin({version: 'directory_v1', auth})
}

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

export {oauth2Client, oauth2ClientGenerateAuthUrl, oauth2ClientService, getDomainGroupsStudents}
