import Contact from "../../models/Contact.js";
import { HttpError } from "../../helpers/index.js";
import tryCatchWrapper from "../../decorators/tryCatchWrapper.js";

const getAllContacts = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
};

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body);
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }
};

const deleteContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`)
    }
    res.status(204).send();
};

export default {
    getAllContacts: tryCatchWrapper(getAllContacts),
    getContactById: tryCatchWrapper(getContactById),
    addContact: tryCatchWrapper(addContact),
    updateContact: tryCatchWrapper(updateContact),
    deleteContact: tryCatchWrapper(deleteContact),
};