const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");
const validator = require("validator");
const Contact = require("../models/ContactModal");

const addContactApi = async (req, res, next) => {
    try {
        const { name, message, email } = req.body;

        if (!name || !message || !email) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required",
            });
        }
        const newContact = await Contact.create({
            ...req.body,
        });
        res.status(201).json({
            status: "success",
            data: newContact,
            message: "New Contact Added Successfully",
        });
    } catch (error) {
        console.error("Error in Adding Contacting Details", error);
        res.status(500).json({ status: "error", message: error });
    }
};

const getContactListApi = async (req, res, next) => {
    try {
        const contactData = await Contact.find({ deletedAt: { $exists: false } })
        if (!contactData) {
            return res.status(400).json({
                status: "error",
                message: "Contact List not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: contactData,
        });
    } catch (error) {
        console.log("Error in get Contacts List", error);
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = {
    addContactApi,
    getContactListApi, 
};


