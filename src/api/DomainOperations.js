import {oauth2ClientService} from './Oauth2Client'
import {DomainUser, pad} from './DomainUser'
import * as config from '../config.json'

const deleteDomainUsers = (xmlusers, domainusers, apply, selectedgroup, onlyteachers) => {
  let cont = 0
  console.log('Esborrant usuaris del domini...')
  for (let userid in domainusers) { // Per cada usuari del domini
    let domainUser = domainusers[userid]
    if (!domainUser.suspended && !domainUser.withoutcode) {
      if (!(domainUser.id in xmlusers)) { // No existeix al fitxer XML
        // Aplicar només al grup seleccionat
        if (!selectedgroup || domainUser.groups.includes(selectedgroup)) {
          if (!onlyteachers || domainUser.teacher) {
            if (['/', config.organizationalUnitTeachers, config.organizationalUnitStudents].includes(domainUser.organizationalUnit)) {
              // No eliminam professors del @iesfbmoll.org
              if (['/', config.organizationalUnitTeachers].includes(domainUser.organizationalUnit) && (domainUser.email().indexOf('@iesfbmoll.org') >= 0)) {
                // No fer res
                // No eliminam professors del @iesfbmoll.org
              } else {
                console.log('SUSPENDRE --> ' + domainUser.toString())
                cont++
                if (apply) {
                  // Suspendre l'usuari del domini
                  oauth2ClientService().users.update({
                    userKey: domainUser.email(),
                    resource: {
                      suspended: true
                    }
                  }, (err) => { if (err) console.log('The API returned an error: ' + err) })
                  // Eliminar tots els grups
                  let groupsWithDomain = domainUser.groupsWithDomain()
                  for (let i in groupsWithDomain) {
                    // https://developers.google.com/admin-sdk/directory/v1/reference/members/delete
                    oauth2ClientService().members.delete({
                      groupKey: groupsWithDomain[i],
                      memberKey: domainUser.email()
                    }, (err) => { if (err) console.log('The API returned an error: ' + err) })
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return cont
}

const addDomainUsers = (xmlusers, domainusers, domaingroups, apply, selectedgroup, onlyteachers) => {
  let contc = 0
  let conta = 0
  let contm = 0
  let conto = 0
  let contg = 0
  console.log('Afegint usuaris al domini...')
  for (let userid in xmlusers) { // For every XML user
    let xmluser = xmlusers[userid]
    if (!(userid in domainusers)) { // It doesn't exists in domain
      // Email pot ser repetit, comprovar-ho!!
      if (!xmluser.teacher) {
        for (let dUser in domainusers) {
          // Si hi ha un usuari del domini amb les 3 primeres lletres iguals
          if (domainusers[dUser].email().startsWith(xmluser.email().substring(0, 3))) {
            let nEmailDom = parseInt(domainusers[dUser].email().substring(3, 5))
            let nEmailXml = parseInt(xmluser.email().substring(3, 5))
            if (nEmailDom >= nEmailXml) {
              let nEmail = nEmailDom + 1
              xmluser.domainemail = xmluser.email().substring(0, 3) + pad(nEmail, 2) + '@' + config.domain
            }
          }
        }
      }
      // Afegim l'usuari que cream al diccionari de usuaris del domini
      domainusers[xmluser.id] = new DomainUser(
        xmluser.id,
        xmluser.name,
        xmluser.surname1,
        xmluser.surname2,
        xmluser.surname,
        xmluser.email(), // domainemail
        xmluser.suspended, // suspended
        xmluser.teacher, // teacher
        xmluser.tutor, // tutor
        xmluser.withoutcode, // withoutcode
        xmluser.groups // groups
      )

      console.log('CREAR --> ' + xmluser.toString())
      contc++
      if (apply) {
        // Create domain user
        // https://developers.google.com/admin-sdk/reseller/v1/codelab/end-to-end
        oauth2ClientService().users.insert({
          resource: {
            primaryEmail: xmluser.email(),
            name: { givenName: xmluser.name, familyName: xmluser.surname },
            orgUnitPath: (xmluser.teacher ? '/Professorat' : '/Alumnat'),
            externalIds: [{ type: 'organization', value: xmluser.id }],
            suspended: false,
            changePasswordAtNextLogin: true,
            password: '12345678'
          } // Default password
        }, (err, response) => {
          if (err) {
            console.log('The API returned an error: ' + err)
          }
        })
        // Insert all 'ee.',  'alumnat.' and 'tutors' groups
        for (let gr in xmluser.groupsWithPrefixAdded()) {
          // https://developers.google.com/admin-sdk/directory/v1/reference/members/insert
          oauth2ClientService().members.insert({
            groupKey: xmluser.groupsWithPrefixAdded()[gr] + '@' + config.domain,
            resource: {
              email: xmluser.email()
            }
          }, (err, response) => {
            if (err) {
              console.log('The API returned an error: ' + err)
            }
          })
        }
      }
    } else {
      let domainUser = domainusers[userid]
      if (domainUser.suspended) {
        console.log('ACTIVAR --> ' + xmluser.toString())
        conta++
        if (apply) {
          // Suspend domain user
          oauth2ClientService().users.update({
            userKey: domainUser.email(),
            resource: {
              suspended: true
            }
          }, (err, response) => {
            if (err) {
              console.log('The API returned an error: ' + err)
            }
          })
        }
      }
      // Tant si estava actiu com no, existeix, i per tant, actualitzar
      // els grups 'ee.', 'alumnat.' i  'tutors'
      // TODO: Insert and delete 'tutors' group
      let creategroups = xmluser.groupsWithPrefixAdded().filter(
        (x) => { return domainUser.groupsWithPrefix().indexOf(x) < 0 })
      let deletegroups = domainUser.groupsWithPrefix().filter(
        (x) => { return xmluser.groupsWithPrefixAdded().indexOf(x) < 0 })
      if (((creategroups.length > 0) || (deletegroups.length > 0)) && (!domainUser.suspended)) {
        if (creategroups.length > 0) {
          console.log('CREATE GROUPS --> ' + domainUser.surname + ', ' + domainUser.name + ' (' + domainUser.email() + ') [' + creategroups + ']')
        }
        if (deletegroups.length > 0) {
          console.log('DELETE GROUPS --> ' + domainUser.surname + ', ' + domainUser.name + ' (' + domainUser.email() + ') [' + deletegroups + ']')
        }
        contg++
        if (apply) {
          // Actualitzam els grups de l'usuari
          for (let gr in creategroups) {
            // https://developers.google.com/admin-sdk/directory/v1/reference/members/insert
            oauth2ClientService().members.insert({
              groupKey: creategroups[gr] + '@' + config.domain,
              body: {
                email: domainUser.email()
              }
            }, (err, response) => {
              if (err) {
                console.log('The API returned an error: ' + err)
              }
            })
          }
          for (let gr in deletegroups) {
            // https://developers.google.com/admin-sdk/directory/v1/reference/members/delete
            oauth2ClientService().members.delete({
              groupKey: deletegroups[gr] + '@' + config.domain,
              resource: {
                email: domainUser.email()
              }
            }, (err, response) => {
              if (err) {
                console.log('The API returned an error: ' + err)
              }
            })
          }
        }
      }
    }
  }
  return {
    created: contc,
    activated: conta,
    membersmodified: contm,
    orgunitmodified: conto,
    groupsmodified: contg
  }
}

const applyDomainChanges = (xmlusers, domainusers, domaingroups, apply, selectedgroup, onlyteachers, callback) => {
  let contd = deleteDomainUsers(xmlusers, domainusers, apply, selectedgroup, onlyteachers)
  let cont = addDomainUsers(xmlusers, domainusers, domaingroups, apply, selectedgroup, onlyteachers)
  let count = {
    deleted: contd,
    created: cont.created,
    activated: cont.activated,
    membersmodified: cont.membersmodified,
    orgunitmodified: cont.orgunitmodified,
    groupsmodified: cont.groupsmodified
  }
  callback(count)
}

export {applyDomainChanges}
