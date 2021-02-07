const contacts = require("../models/contacts.json")
const Joi = require("joi")
const { v4: uuidv4 } = require("uuid")

const { promises: fsPromises } = require("fs")
const path = require("path")

const contactsPath = path.join(__dirname, "../models/contacts.json")

class ContactsController {
  //need to use arrow functions not to loose context (this). Arr. func. take context from env.

  listContacts(req, res) {
    fsPromises
      .readFile(contactsPath, "utf-8")
      .then((data) => {
        const contacts = JSON.parse(data)
        console.table(contacts)
        res.json(contacts)
      })
      .catch((error) => console.error(error))
  }

  getContactById(req, res) {
    fsPromises
      .readFile(contactsPath, "utf-8")
      .then((data) => {
        const contactId = +req.params.contactId
        const result = JSON.parse(data).find(
          (contact) => contact.id === contactId
        )
        if (result) {
          console.log("We found:")
          console.table(result)
          res.json(result)
        } else {
          console.log(`Contact with ${contactId} ID doesn't excist!`)
        }
      })
      .catch((error) => console.error(error))
  }

  removeContact(req, res) {
    fsPromises
      .readFile(contactsPath, "utf-8")
      .then((data) => {
        const contactId = +req.params.contactId
        const updatedContacts = JSON.parse(data).filter(
          (contact) => contact.id !== contactId
        )
        fsPromises.writeFile(contactsPath, JSON.stringify(updatedContacts))

        console.log("Updated contacts:")
        console.table(updatedContacts)
        res.json(updatedContacts)
      })
      .catch((error) => console.error(error))
  }

  addContact(req, res) {
    const { name, email, phone } = req.body
    const newContact = { id: uuidv4(), name, email, phone }
    fsPromises
      .readFile(contactsPath, "utf-8")
      .then((data) => {
        const updatedContacts = JSON.parse(data)

        updatedContacts.push(newContact)

        fsPromises.writeFile(contactsPath, JSON.stringify(updatedContacts))

        console.log("Updated contacts:")
        console.table(updatedContacts)
        res.json(updatedContacts)
      })
      .catch((error) => console.error(error))
  }

  updateContact(req, res){
    const { name, email, phone } = req.body
    const contactId = +req.params.contactId

    fsPromises
    .readFile(contactsPath, "utf-8")
    .then((data) => {
        const contacts = JSON.parse(data);
      const result = contacts.find(
        (contact) => contact.id === contactId
      )
      if (result) {
       result.name = name;
       result.email = email;
       result.phone = phone;
       

        fsPromises.writeFile(contactsPath, JSON.stringify(contacts));
    res.json(result)
      }
      else {
        console.log(`Contact with ${contactId} ID doesn't excist!`)
      }
    })
    .catch((error) => console.error(error))


  }
}

module.exports = new ContactsController()

//*from prev branch
// const { v4: uuidv4 } = require("uuid")
// const { promises: fsPromises } = require("fs")
// const path = require("path")

// const contactsPath = path.join(__dirname, "db/contacts.json")

// function listContacts() {
//   fsPromises
//     .readFile(contactsPath, "utf-8")
//     .then((data) => {

//       const contacts = JSON.parse(data)
//       console.table(contacts)
//     })
//     .catch((error) => console.error(error))
// }

// function getContactById(contactId) {
//   fsPromises
//     .readFile(contactsPath, "utf-8")
//     .then((data) => {
//       const result = JSON.parse(data).find(
//         (contact) => contact.id === contactId
//       )
//       if (result) {
//         console.log("We found:")
//         console.table(result)
//       } else {
//         console.log(`Contact with ${contactId} ID doesn't excist!`)
//       }
//     })
//     .catch((error) => console.error(error))
// }

// // function removeContact(contactId) {
// //   fsPromises
// //     .readFile(contactsPath, "utf-8")
// //     .then((data) => {
// //       const updatedContacts = JSON.parse(data).filter(
// //         (contact) => contact.id !== contactId
// //       )
// //       fsPromises.writeFile(contactsPath, JSON.stringify(updatedContacts))
// //     })
// //     .then(result => {
// //       console.log("Updated contacts:");
// //       console.table(result)
// //     })
// //     .catch((error) => console.error(error))
// // }

// function removeContact(contactId) {
//   fsPromises
//     .readFile(contactsPath, "utf-8")
//     .then((data) => {
//       const updatedContacts = JSON.parse(data).filter(
//         (contact) => contact.id !== contactId
//       )
//       fsPromises.writeFile(contactsPath, JSON.stringify(updatedContacts))

//       console.log("Updated contacts:");
//       console.table(updatedContacts)
//     })
//     .catch((error) => console.error(error))
// }

// function addContact(name, email, phone) {
//   const newContact = { id: uuidv4(), name, email, phone }
//   fsPromises
//     .readFile(contactsPath, "utf-8")
//     .then((data) => {
//       const updatedContacts = JSON.parse(data)

//       updatedContacts.push(newContact)

//       fsPromises.writeFile(contactsPath, JSON.stringify(updatedContacts))

//       console.log("Updated contacts:");
//       console.table(updatedContacts)
//     })
//     .catch((error) => console.error(error))
// }

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
// }
