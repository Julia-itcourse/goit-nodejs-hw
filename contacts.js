const { v4: uuidv4 } = require("uuid")
const { promises: fsPromises } = require("fs")
const path = require("path")


const contactsPath = path.join(__dirname, "db/contacts.json")

function listContacts() {
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((data) => {
     
      const contacts = JSON.parse(data)
      console.table(contacts)
    })
    .catch((error) => console.error(error))
}

function getContactById(contactId) {
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((data) => {
      const result = JSON.parse(data).find(
        (contact) => contact.id === contactId
      )
      if (result) {
        console.log("We found:")
        console.table(result)
      } else {
        console.log(`Contact with ${contactId} ID doesn't excist!`)
      }
    })
    .catch((error) => console.error(error))
}

// function removeContact(contactId) {
//   fsPromises
//     .readFile(contactsPath, "utf-8")
//     .then((data) => {
//       const updatedContacts = JSON.parse(data).filter(
//         (contact) => contact.id !== contactId
//       )
//       fsPromises.writeFile(contactsPath, JSON.stringify(updatedContacts))
//     })
//     .then(result => {
//       console.log("Updated contacts:");
//       console.table(result)
//     })
//     .catch((error) => console.error(error))
// }

function removeContact(contactId) {
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((data) => {
      const updatedContacts = JSON.parse(data).filter(
        (contact) => contact.id !== contactId
      )
      fsPromises.writeFile(contactsPath, JSON.stringify(updatedContacts))
   
      console.log("Updated contacts:");
      console.table(updatedContacts)
    })
    .catch((error) => console.error(error))
}

function addContact(name, email, phone) {
  const newContact = { id: uuidv4(), name, email, phone }
  fsPromises
    .readFile(contactsPath, "utf-8")
    .then((data) => {
      const updatedContacts = JSON.parse(data)
      
      updatedContacts.push(newContact)

      fsPromises.writeFile(contactsPath, JSON.stringify(updatedContacts))
    
    
      console.log("Updated contacts:");
      console.table(updatedContacts)
    })
    .catch((error) => console.error(error))
}


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
}
