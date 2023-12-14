import express from "express";
import contactsController from "../../controllers/contacts/contacts-controller.js";
import { authenticate, isEmptyBody, isValidId } from "../../middlewares/index.js";
import { addContactSchema, contactFavoriteSchema, updateContactSchema } from "../../models/Contact.js";
import validateWrapper from "../../decorators/validateWrapper.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsController.getAllContacts);

contactsRouter.get('/:contactId', isValidId, contactsController.getContactById);

contactsRouter.post('/', isEmptyBody, validateWrapper(addContactSchema), contactsController.addContact);

contactsRouter.put('/:contactId', isValidId, isEmptyBody, validateWrapper(updateContactSchema), contactsController.updateContact);

contactsRouter.patch("/:contactId/favorite", isValidId, isEmptyBody, validateWrapper(contactFavoriteSchema), contactsController.getContactById)

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteContact);

export default contactsRouter;