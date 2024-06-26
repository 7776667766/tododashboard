const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");
const validator = require("validator");
const Contact = require("../models/ContactModal");
const BusinessRequest = require("../models/BusinessRequest");
const Owner = require("../models/OwnerModel");
const requestAdminToRegister = async (req, res, next) => {
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
const getAdminRequestToRegisterBusiness = async (req, res, next) => {
    console.log("36...",req.body)
    try {
        const userId=req.body.ownerId
        console.log("userId 34", userId)

        const newBusinessData = []

        const BusienssData = await BusinessRequest.find({
            deletedAt: null || undefined,
            active: true
        })
        console.log("BusienssData 40", BusienssData)

        const userData = await User.findById({ _id:userId })
        console.log("userData 43", userData)

 
        const username= userData.name
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
        console.log("newBusinessData 58", newBusinessData)
        const newData={
            ...newBusinessData,
            name : userData,
        }
        res.status(200).json({
            status: "success",
            newData,
        });
    } catch (error) {
        console.log("Error in get BusienssData", error);
        res.status(400).json({ status: "error", message: error.message });
    }
};
module.exports = {
    requestAdminToRegister,
    getAdminRequestToRegisterBusiness
};
const getBuinessData = async (business) => {
    console.log("business 80", business)
    const myServiceData = {
        description: business.description,
        googleBusiness: business.googleBusiness
    };
    return myServiceData;
};