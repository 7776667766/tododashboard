const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");
const validator = require("validator");
const Contact = require("../models/ContactModal");
const BusinessRequest = require("../models/BusinessRequest")

const addBusinessApi = async (req, res, next) => {
    try {
        const { description, googleBusiness,ownerId } = req.body;

        if (!description || !slug) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required",
            });
        }

        const newBusiness = await BusinessRequest.create({
            ...req.body,
        });
        res.status(201).json({
            status: "success",
            data: newBusiness,
            message: "Request Send successfully",
        });
    } catch (error) {
        console.error("Error in Sending Business Details ", error);
        res.status(500).json({ status: "error", message: error });
    }
};

const getbusinessRequest = async (req, res, next) => {
    const { businessId } = req.body;
    try {
        const BusienssData = await BusinessRequest.find({
            deletedAt: null || undefined,
            businessId,
            active: true
        })
        if (!BusienssData) {
            return res.status(400).json({
                status: "error",
                message: "Contact List not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: BusienssData,
        });
    } catch (error) {
        console.log("Error in get BusienssData", error);
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = {
    addBusinessApi,
    getbusinessRequest
};


