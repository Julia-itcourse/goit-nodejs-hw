const { Router } = require('express');
const ContactsController = require('./contacts.controller');

const router = Router();

router.get('/', ContactsController.listContacts);
router.get(
  '/:contactId',
  ContactsController.validateId,
  ContactsController.getContactById,
);
router.post(
  '/',
  ContactsController.addContact,
);
router.delete(
  '/:contactId',
  ContactsController.validateId,
  ContactsController.removeContact,
);
router.patch(
  '/:contactId',
  ContactsController.validateId,
  ContactsController.updateContact,
);

module.exports = router;