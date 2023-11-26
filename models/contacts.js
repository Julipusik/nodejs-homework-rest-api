import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("models", "contacts.json");

export const listContacts = async () => {
  try {
    const result = JSON.parse(await fs.readFile(contactsPath));
    return result;
  }
  catch (error) {
    console.log(error);
  }
}

export const getContactById = async (contactId) => {
  try {
    const contactList = await listContacts();
    const index = contactList.findIndex(contact => contact.id === contactId);
    if (index === -1) {
      return null;
    }
    return contactList[index];
  }
  catch (error) {
    console.log(error);
  }
}

export const removeContact = async (contactId) => {
  try {
    const contactList = await listContacts();
    const index = contactList.findIndex(contact => contact.id === contactId);
    if (index === -1) {
      return null;
    }
    const [deleteContact] = contactList.splice(index, 1);
    fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));
    return deleteContact;
  }
  catch (error) {
    console.log(error);
  }
}

export const addContact = async (name, email, phone) => {
  try {
    const contactList = await listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    contactList.push(newContact);
    fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));
    return newContact;
  }
  catch (error) {
    console.log(error);
  }
}

export const updateContact = async (id, data) => {
  try {
    const contactList = await listContacts();
    const index = contactList.finddIndex(contact => contact.id === id);
    if (index === -1) {
      return null;
    }
    contactList[index] = { ...contactList[index], ...data };
    fs.writeFile(contactsPath, JSON.stringify(contactsPath, null, 2));
    return contactList[index];
  }
  catch (error) {
    console.log(error);
  }
}
