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
          res.status(200).json(result)
        } else {
            res.status(404).send({message: "not found"})
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

        // res.json(updatedContacts)
        res.status(200).send({ message: "Contact deleted" })
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

        // res.json(updatedContacts)
        res.status(201).send(newContact)
      })
      .catch((error) => console.error(error))
  }

 updateContact(req, res) {
    const { body } = req;
    const { contactId } = req.params;

    fsPromises.readFile(contactsPath, 'utf-8')
      .then(data => {
        const newContacts = JSON.parse(data).map(contact => {
         return contact = contact.id == contactId ? { ...contact, ...body } : contact; 
          }
        )
        const contactToChange = newContacts.filter(contact => contact.id == contactId)
  
        fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));
  
        if (!contactToChange.length) {
          return res.status(404).send({ message: "Not found" })
        }
  
       res.status(200).json(contactToChange);
      })
      .catch(err => console.log(err))
  
  }

//* validation


  validateAddContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    })

    const validationResult = validationRules.validate(req.body)

    if (validationResult.error) {
      return res.status(400).send({ message: "missing required name field" })
    }

    next()
  }

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    }).min(1)

    const validationResult = validationRules.validate(req.body)

    if (validationResult.error) {
      return res.status(400).send({ message: "missing fields" })
    }

    next()
  }
}

module.exports = new ContactsController()
