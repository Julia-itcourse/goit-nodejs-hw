const { Router } = require('express');
const ContactsController = require('./contacts.controller');

const router = Router();

router.get('/', ContactsController.listContacts);
router.get(
  '/:id',
  ContactsController.validateId,
  ContactsController.getContactById,
);
router.post(
  '/',
  ContactsController.validateAddContact,
  ContactsController.addContact,
);
router.delete(
  '/:id',
  ContactsController.validateId,
  ContactsController.removeContact,
);
router.patch(
  '/:id',
  ContactsController.validateId,
  ContactsController.validateUpdateContact,
  ContactsController.updateContact,
);

module.exports = router;