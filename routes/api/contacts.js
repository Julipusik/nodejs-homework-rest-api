import express from "express";
import contactsController from "../../controllers/contacts/contacts-controller.js";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import { addContactSchema, updateContactSchema } from "../../schemas/contact-schema.js";
import validateWrapper from "../../decorators/validateWrapper.js";

const router = express.Router();

router.get('/', contactsController.getAllContacts);

router.get('/:contactId', contactsController.getContactById);

router.post('/', isEmptyBody, validateWrapper(addContactSchema), contactsController.addContact);

router.delete('/:contactId', contactsController.deleteContact);

router.put('/:contactId', isEmptyBody, validateWrapper(updateContactSchema), contactsController.updateContact);

export default router;