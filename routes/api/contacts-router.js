import express from "express";
import contactsController from "../../controllers/contacts/contacts-controller.js";
import { authenticate, isEmptyBody, isValidId } from "../../middlewares/index.js";
import { addContactSchema, contactFavoriteSchema, updateContactSchema } from "../../models/Contact.js";
import validateWrapper from "../../decorators/validateWrapper.js";

const router = express.Router();

router.use(authenticate);

router.get('/', contactsController.getAllContacts);

router.get('/:contactId', isValidId, contactsController.getContactById);

router.post('/', isEmptyBody, validateWrapper(addContactSchema), contactsController.addContact);

router.put('/:contactId', isValidId, isEmptyBody, validateWrapper(updateContactSchema), contactsController.updateContact);

router.patch("/:contactId/favorite", isValidId, isEmptyBody, validateWrapper(contactFavoriteSchema), contactsController.getContactById)

router.delete('/:contactId', isValidId, contactsController.deleteContact);

export default router;