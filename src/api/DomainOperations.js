import {oauth2ClientServiceAdmin} from '@/api/Oauth2Client'
import {DomainUser, pad} from '@/api/DomainUser'
import * as config from '@/config.json'

/**
 * Aplicar al domini l'eliminació d'un usuari
 */
const applyDeletedomainUser = (logs, domainUser) => {
  // Suspendre l'usuari del domini
  oauth2ClientServiceAdmin().users.update({
    userKey: domainUser.email(),
    resource: {
      suspended: true
    }
  }, (err) => { if (err) logs.push('The API returned an error: ' + err) })
  // Eliminar tots els grups
  let groupsWithDomain = domainUser.groupsWithDomain()
  for (let i in groupsWithDomain) {
    // https://developers.google.com/admin-sdk/directory/v1/reference/members/delete
    oauth2ClientServiceAdmin().members.delete({
      groupKey: groupsWithDomain[i],
      memberKey: domainUser.email()
    }, (err) => { if (err) logs.push('The API returned an error: ' + err) })
  }
}

/**
 * Esborrar del domini els usuaris que no estan al XML
 */
const deleteDomainUsers = (logs, xmlUsers, domainUsers, apply, selectedGroup, onlyTeachers) => {
  let countDeleted = 0
  logs.push('Esborrant usuaris del domini...')
  for (let userid in domainUsers) { // Per cada usuari del domini
    let domainUser = domainUsers[userid]
    if (!domainUser.suspended && !domainUser.withoutcode) {
      if (!(domainUser.id in xmlUsers)) { // No existeix al fitxer XML
        // Aplicar només al grup seleccionat
        if (!selectedGroup || domainUser.groups.includes(selectedGroup)) {
          // Si només hem escollit professors...
          if (!onlyTeachers || domainUser.teacher) {
            // Aplicar només les unitats organitzatives 'Professorat', 'Alumnat' i '/'
            if (['/', config.organizationalUnitTeachers, config.organizationalUnitStudents].includes(domainUser.organizationalUnit)) {
              // No eliminam professors del @iesfbmoll.org
              if (!(['/', config.organizationalUnitTeachers].includes(domainUser.organizationalUnit) && (domainUser.email().indexOf('@iesfbmoll.org') >= 0))) {
                logs.push('SUSPENDRE: ' + domainUser.toString())
                countDeleted++
                if (apply) {
                  // Si hem d'aplicar els canvis...
                  applyDeletedomainUser(logs, domainUser)
                }
              }
            }
          }
        }
      }
    }
  }
  return countDeleted
}

/**
 * Cream els grups que no existeixin al domini
 */
const createGroups = (logs, apply, groups, domainGroups) => {
  let countGroupsCreated = 0
  groups.forEach(gr => {
    // Si el grup no existeix, el cream
    if (!(gr in domainGroups)) {
      logs.push('CREAR GRUP: ' + gr + '@' + config.domain)
      countGroupsCreated++
      domainGroups[gr] = { email: gr + '@' + config.domain }
      if (apply) {
        // kkk TODO: afegir grup al domini
        // kkk TODO: fer de forma asincrona. primer crear grup, despre, el q faci falta...
        /*
        $groupObj = new Google_Service_Directory_Group(
            array(
                'email' => $gr."@".DOMAIN
            )
        );
        $service->groups->insert($groupObj);
        $domaingroupsmembers[$gr] = [];
        sleep(1);
        */
      }
    }
  })
  return countGroupsCreated
}

/**
 * Estableix el nou email de l'usuari que hem de crear
 */
const getNewDomainEmail = (xmlUser, domainUsers) => {
  // kkkk TODO: pendent
  let newEmail = null
  if (!xmlUser.teacher && !config.longStudentsEmail) {
    // EMAIL CURT 'mcn00@'
    for (let dUser in domainUsers) {
      // Si hi ha un usuari del domini amb les 3 primeres lletres iguals
      if (domainUsers[dUser].email().startsWith(xmlUser.email().substring(0, 3))) {
        let nEmailDom = parseInt(domainUsers[dUser].email().substring(3, 5))
        let nEmailXml = parseInt(xmlUser.email().substring(3, 5))
        if (nEmailDom >= nEmailXml) {
          let nEmail = nEmailDom + 1
          newEmail = xmlUser.email().substring(0, 3) + pad(nEmail, 2) + '@' + config.domain
        }
      }
    }
  } else {
    // EMAIL LLARG 'mcabot@'
    // EMAIL 2surmanes 'm.cabotnadal@', només per alumnes (IES Madina Mayurqa)
  }
  return newEmail
}

/**
 * Cream l'usuari del XML que no està al domini
 */
const createDomainUser = (logs, apply, xmlUser, domainUsers) => {
  let countCreated = 1
  logs.push('CREAR USUARI: ' + xmlUser.toString())

  // Email pot ser repetit, comprovar-ho!!
  let newEmail = getNewDomainEmail(xmlUser, domainUsers)
  if (newEmail) {
    xmlUser.domainemail = newEmail
  }

  // Afegim l'usuari que cream al diccionari de usuaris del domini
  domainUsers[xmlUser.id] = new DomainUser(
    xmlUser.id,
    xmlUser.name,
    xmlUser.surname1,
    xmlUser.surname2,
    xmlUser.surname,
    xmlUser.email(), // domainemail
    xmlUser.suspended, // suspended
    xmlUser.teacher, // teacher
    xmlUser.withoutcode, // withoutcode
    xmlUser.groups, // groups
    xmlUser.expedient, // expedient
    xmlUser.organizationalUnit, // organizationalUnit
    xmlUser.lastLoginTime // lastLoginTime
  )

  if (apply) {
    // Create domain user
    // https://developers.google.com/admin-sdk/reseller/v1/codelab/end-to-end
    oauth2ClientServiceAdmin().users.insert({
      resource: {
        primaryEmail: xmlUser.email(),
        name: { givenName: xmlUser.name, familyName: xmlUser.surname },
        orgUnitPath: (xmlUser.teacher ? config.organizationalUnitTeachers : config.organizationalUnitStudents),
        externalIds: [{ type: 'organization', value: xmlUser.id }],
        suspended: false,
        changePasswordAtNextLogin: true,
        password: config.defaultPassword // Default password
      }
    }, (err) => { if (err) logs.push('The API returned an error: ' + err) })
    // Insert all groupPrefixTeachers, groupPrefixStudents and groupPrefixTutors groups
    for (let gr in xmlUser.groupsWithPrefixAdded()) {
      // https://developers.google.com/admin-sdk/directory/v1/reference/members/insert
      oauth2ClientServiceAdmin().members.insert({
        groupKey: xmlUser.groupsWithPrefixAdded()[gr] + '@' + config.domain,
        resource: {
          email: xmlUser.email()
        }
      }, (err) => { if (err) logs.push('The API returned an error: ' + err) })
    }
  }
  return countCreated
}

/**
 * Actualitzar estat 'actiu' de l'usuari del domini
 */
const updateActivateDomainUser = (logs, apply, xmlUser, domainUser) => {
  let countActivated = 0
  if (domainUser.suspended) {
    logs.push('ACTIVAR: ' + xmlUser.toString())
    countActivated++
    if (apply) {
      // Suspend domain user
      oauth2ClientServiceAdmin().users.update({
        userKey: domainUser.email(),
        resource: {
          suspended: true
        }
      }, (err) => { if (err) logs.push('The API returned an error: ' + err) })
    }
  }
  return countActivated
}

/**
 * Actualitzar els grups del que és membre l'usuari del domini
 */
const updateMemberDomainUser = (logs, apply, creategroups, deletegroups, domainUser) => {
  let countMembersModified = 0
  // Tant si estava actiu com no, existeix, i per tant, actualitzar
  // els grups groupPrefixDepartment, groupPrefixTeachers,
  // groupPrefixStudents i groupPrefixTutors
  if (((creategroups.length > 0) || (deletegroups.length > 0)) && (!domainUser.suspended)) {
    if (deletegroups.length > 0) {
      logs.push('ESBORRAR MEMBRE: ' + domainUser.surname + ', ' + domainUser.name + ' (' + domainUser.email() + ') [' + deletegroups + ']')
    }
    if (creategroups.length > 0) {
      logs.push('AFEGIR MEMBRE: ' + domainUser.surname + ', ' + domainUser.name + ' (' + domainUser.email() + ') [' + creategroups + ']')
    }
    countMembersModified++
    if (apply) {
      // Actualitzam els grups de l'usuari
      for (let gr in deletegroups) {
        // https://developers.google.com/admin-sdk/directory/v1/reference/members/delete
        oauth2ClientServiceAdmin().members.delete({
          groupKey: deletegroups[gr] + '@' + config.domain,
          resource: {
            email: domainUser.email()
          }
        }, (err) => { if (err) logs.push('The API returned an error: ' + err) })
      }
      for (let gr in creategroups) {
        // https://developers.google.com/admin-sdk/directory/v1/reference/members/insert
        oauth2ClientServiceAdmin().members.insert({
          groupKey: creategroups[gr] + '@' + config.domain,
          resource: {
            email: domainUser.email()
          }
        }, (err) => { if (err) logs.push('The API returned an error: ' + err) })
      }
    }
  }
  return countMembersModified
}

/**
 * Actualitzar l'unitat organitzativa de l'usuari del domini
 */
const updateOrgunitDomainUser = (logs, apply, xmlUser, domainUser) => {
  let countOrgunitModified = 0
  if (domainUser.organizationalUnit !== (xmlUser.teacher ? config.organizationalUnitTeachers : config.organizationalUnitStudents)) {
    logs.push('CANVIAR UNITAT ORGANITZATIVA: ' +
      domainUser.surname + ', ' + domainUser.name + ' (' +
      domainUser.email() + ') [' +
      (xmlUser.teacher ? config.organizationalUnitTeachers : config.organizationalUnitStudents) + ']')
    countOrgunitModified++
    if (apply) {
      // Actualitzar unitat organtizativa de l'usuari del domini
      oauth2ClientServiceAdmin().users.update({
        userKey: domainUser.email(),
        resource: {
          orgUnitPath: (xmlUser.teacher ? config.organizationalUnitTeachers : config.organizationalUnitStudents)
        }
      }, (err) => { if (err) logs.push('The API returned an error: ' + err) })
    }
  }
  return countOrgunitModified
}

/**
 * Afegir al domini els usuaris que estan al XML i no al domini
 */
const addDomainUsers = (logs, xmlUsers, domainUsers, domainGroups, apply, selectedGroup, onlyTeachers) => {
  let countCreated = 0
  let countActivated = 0
  let countMembersModified = 0
  let countOrgunitModified = 0
  let countGroupsCreated = 0
  logs.push('Actualitzant usuaris del domini...')
  for (let userid in xmlUsers) { // Per cada usuari de l'XML
    let xmlUser = xmlUsers[userid]
    if (!(userid in domainUsers)) {
      // Si no existeix al domini... crear
      // Aplicar només al grup seleccionat
      if (!selectedGroup || xmlUser.groups.includes(selectedGroup)) {
        // Si només hem escollit professors...
        if (!onlyTeachers || xmlUser.teacher) {
          // Afegim els grups que no estiguin al domini
          countGroupsCreated = countGroupsCreated + createGroups(logs, apply, xmlUser.groupsWithPrefixAdded(), domainGroups)
          // Afegim l'usuari al domini
          countCreated = countCreated + createDomainUser(logs, apply, xmlUser, domainUsers)
        }
      }
    } else {
      // Si existeix al domini, actualitzar
      let domainUser = domainUsers[userid]
      // Aplicar només al grup seleccionat
      if (!selectedGroup || xmlUser.groups.includes(selectedGroup) || domainUser.groups.includes(selectedGroup)) {
        // Si només hem escollit professors...
        if (!onlyTeachers || xmlUser.teacher || domainUser.teacher) {
          // Aplicar només les unitats organitzatives 'Professorat', 'Alumnat' i '/'
          if (['/', config.organizationalUnitTeachers, config.organizationalUnitStudents].includes(domainUser.organizationalUnit)) {
            // Actualitzam el seu estat de 'activat'
            countActivated = countActivated + updateActivateDomainUser(logs, apply, xmlUser, domainUser)
            let creategroups = xmlUser.groupsWithPrefixAdded().filter(
              (x) => { return domainUser.groupsWithPrefix().indexOf(x) < 0 })
            let deletegroups = domainUser.groupsWithPrefix().filter(
              (x) => { return xmlUser.groupsWithPrefixAdded().indexOf(x) < 0 })
            // Afegim els grups que no estiguin al domini
            countGroupsCreated = countGroupsCreated + createGroups(logs, apply, creategroups, domainGroups)
            // Actualitzam els grups dels que és membre
            countMembersModified = countMembersModified + updateMemberDomainUser(logs, apply, creategroups, deletegroups, domainUser)
            // Actualitzam la seva unitat organitzativa
            countOrgunitModified = countOrgunitModified + updateOrgunitDomainUser(logs, apply, xmlUser, domainUser)
          }
        }
      }
    }
  }
  return {
    created: countCreated,
    activated: countActivated,
    membersmodified: countMembersModified,
    orgunitmodified: countOrgunitModified,
    groupscreated: countGroupsCreated
  }
}

/**
 * Aplicar els canvis del XML al domini de Google
 */
const applyDomainChanges = (logs, xmlUsers, domainUsers, domainGroups, apply, selectedGroup, onlyTeachers, callback) => {
  let countDeleted = deleteDomainUsers(logs, xmlUsers, domainUsers, apply, selectedGroup, onlyTeachers)
  let count = addDomainUsers(logs, xmlUsers, domainUsers, domainGroups, apply, selectedGroup, onlyTeachers)
  count.deleted = countDeleted
  callback(null, count)
}

export {applyDomainChanges}
