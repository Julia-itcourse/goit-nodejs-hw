const {
  Types: { ObjectId },
} = require("mongoose")
const Contact = require("./Contacts")

//find all contacts
async function listContacts(req, res) {
  const contacts = await Contact.find()
  res.json({ contacts })
}

//find contact by id

async function getContactById(req, res) {
    const {
        params: { id },
      } = req

      const contact = await Contact.findById(id);
if(!contact){
    return res.status(400).send('Contact with this ID was not found')
}
      res.json(contact)
}

//add contact
async function addContact(req, res) {
  try {
    const { body } = req
    const contact = await Contact.create(body)
    res.json(contact)
  } catch (error) {
    res.status(400).send(error)
  }
}
//delete contact

async function removeContact(req, res){
    const {
        params: { id },
      } = req

    const removedContact = await Contact.findByIdAndDelete(id);

    if(!removedContact){
        return res.status(400).send('Contact was not found');
    }
    res.json(removedContact)
}

//update contact
async function updateContact(req, res) {
  const {
    params: { id },
  } = req

  const updatedContact = await Contact.findByIdAndUpdate(
    id, req.body,
    {
      new: true,
    }
  )

  if (!updatedContact) {
    return res.status(400).send("Contact was not found")
  }
  res.json(updatedContact)
}

//Middleware

function validateId(req, res, next){
    const {
        params: { id },
      } = req
    
      if (!ObjectId.isValid(id)) {
        return res.status(400).send("This id is not valid")
      }

      next()




}

//*validation methods with JOI from hw 2
// validateAddContact(req, res, next) {
//     const validationRules = Joi.object({
//       name: Joi.string().required(),
//       email: Joi.string().required(),
//       phone: Joi.string().required(),
//     })

//     const validationResult = validationRules.validate(req.body)

//     if (validationResult.error) {
//       return res.status(400).send({ message: "missing required name field" })
//     }

//     next()
//   }

//   validateUpdateContact(req, res, next) {
//     const validationRules = Joi.object({
//       name: Joi.string(),
//       email: Joi.string(),
//       phone: Joi.string(),
//     }).min(1)

//     const validationResult = validationRules.validate(req.body)

//     if (validationResult.error) {
//       return res.status(400).send({ message: "missing fields" })
//     }

//     next()
//   }

module.exports = {
  listContacts,
  addContact,
  updateContact,
  removeContact,
  getContactById,

  validateId
}
