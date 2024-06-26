const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");
const validator = require("validator");
const Contact = require("../models/ContactModal");
const BusinessRequest = require("../models/BusinessRequest");
const Owner = require("../models/OwnerModel");

const addBusinessApi = async (req, res, next) => {
    try {
        const { description, googleBusiness, ownerId } = req.body;

        if (!description || !googleBusiness || !ownerId) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required",
            });
        }

        const newBusiness = await BusinessRequest.create({
            ...req.body,
        });
        console.log("newBusiness", newBusiness)

        res.status(200).json({
            status: "success",
            data: newBusiness,
            message: "Request Send Successfully",
        });
    } catch (error) {
        console.error("Error in Sending Business Details ", error);
        res.status(500).json({ status: "error", message: error });
    }
};

const getbusinessRequest = async (req, res, next) => {
    console.log("36...",req.body)
    try {

        const userId=req.body.ownerId

        const newBusinessData = []

        const BusienssData = await BusinessRequest.find({
            deletedAt: null || undefined,
            userId,
            active: true
        })

        const newBusienssData = BusienssData.ownerId
        console.log("newBusienssData 4666", newBusienssData)

        const ownerData = await Owner.findById({ newBusienssData })
        console.log("ownerData", ownerData.name)

        if (!BusienssData) {
            return res.status(400).json({
                status: "error",
                message: "Busienss Data not found",
            });
        }

        await Promise.all(
            BusienssData.map(async (business) => {
                const myBusinessData = await getBuinessData(business);
                newBusinessData.push(myBusinessData);
            })
        );

        res.status(200).json({
            status: "success",
            data,
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

const getBuinessData = async (business) => {
    console.log("business 80", business)
    const myServiceData = {
        name: data.name,
        description: data.description,
        googleBusiness: data.googleBusiness

    };
    return myServiceData;
};
