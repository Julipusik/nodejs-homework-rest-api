import Contact from "../../models/Contact.js";
import { HttpError } from "../../helpers/index.js";
import tryCatchWrapper from "../../decorators/tryCatchWrapper.js";

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite} = req.query;
    const skip = (page - 1) * limit;
    const filter = { owner };
    if (favorite !== undefined) {
        filter.favorite = favorite;
    }
    const result = await Contact.find(filter, "-craeteAt -updateAt", {skip, limit}).populate("owner", "username email");
    res.json(result);
};

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOne({ _id: contactId, owner });
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner});
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate({_id: contactId, owner}, req.body);
    if (!result) {
        throw HttpError(404, `Contact with id=${contactId} not found`);
    }
};

const deleteContact = async (req, res) => {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndDelete({_id: contactId, owner});
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