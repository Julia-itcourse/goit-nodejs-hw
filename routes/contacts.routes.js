const { Router } = require('express');
const ContactsController = require('../controllers/contacts.controller');

const router = Router();

router.get('/', ContactsController.listContacts);
router.get(
  '/:contactId',
  ContactsController.getContactById,
);
router.post(
  '/',
  ContactsController.validateAddContact,
  ContactsController.addContact,
);
router.delete(
  '/:contactId',
  ContactsController.removeContact,
);
router.patch(
  '/:contactId',
  ContactsController.validateUpdateContact,
  ContactsController.updateContact,
);

module.exports = router;