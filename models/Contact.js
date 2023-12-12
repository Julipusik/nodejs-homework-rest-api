import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";
import Joi from "joi";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, {versionKey: false, timestamps: true});

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneANdUpdate", preUpdate);
contactSchema.post("findOneAndUpdate", handleSaveError);

export const addContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    favorite: Joi.boolean(),
});

export const contactFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactSchema);

export default Contact;