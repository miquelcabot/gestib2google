const {google} = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/admin.directory.orgunit',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/userinfo.profile']

/* eslint-disable camelcase */
const client_secret = process.env.client_secret
const client_id = process.env.client_id

// window.location.origin només agafa protocol, servidor i port
// Per exemple: http://localhost:8080 o https://gestib2google.github.io
// NO FUNCIONA si posam l'aplicació a una subcarpeta. Hauriem d'afegir
// window.location.pathname
const redirect_url = window.location.origin

const oauth2Client = () => {
  const oauth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_url)

  let token = JSON.parse(sessionStorage.getItem('token'))
  if (token != null) {
    oauth2Client.setCredentials(token)
  }
  return oauth2Client
}

const oauth2ClientGenerateAuthUrl = () => {
  return oauth2Client().generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })
}

const oauth2ClientServiceAdmin = () => {
  const auth = oauth2Client()
  return google.admin({version: 'directory_v1', auth})
}

const oauth2ClientServiceSheets = () => {
  // https://developers.google.com/sheets/api/quickstart/nodejs
  const auth = oauth2Client()
  return google.sheets({version: 'v4', auth})
}

const oauth2UserInfo = (callback) => {
  const auth = oauth2Client()
  google.oauth2('v2').userinfo.v2.me.get(
    {auth: auth},
    (err, profile) => {
      callback(err, profile)
    }
  )
}

export {
  oauth2Client,
  oauth2ClientGenerateAuthUrl,
  oauth2ClientServiceAdmin,
  oauth2ClientServiceSheets,
  oauth2UserInfo
}
