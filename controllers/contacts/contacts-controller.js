import * as contactService from "../../models/contacts.js";
import { HttpError } from "../../helpers/index.js";
import tryCatchWrapper from "../../decorators/tryCatchWrapper.js";

const getAllContacts = async (req, res) => {
    const result = await contactService.listContacts();
    res.json(result);
};

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await contactService.getContactById(contactId);
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const { name, email, phone } = req.body;
    const result = await contactService.addContact(name, email, phone);
    res.status(201).json(result);
};

const deleteContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await contactService.removeContact(contactId);
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`)
    }
    res.status(204).send();
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await contactService.updateContact(contactId, req.body);
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }
};

tryCatchWrapper(deleteContact);

export default {
    getAllContacts: tryCatchWrapper(getAllContacts),
    getContactById: tryCatchWrapper(getContactById),
    addContact: tryCatchWrapper(addContact),
    deleteContact: tryCatchWrapper(deleteContact),
    updateContact: tryCatchWrapper(updateContact),
};