const User = require("../models/UserModel");
const BusinessRequest = require("../models/BusinessRequest");

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
        });f
    } catch (error) {
        console.error("Error in Sending Business Details ", error);
        res.status(500).json({ status: "error", message: error });
    }
};

const getAdminRequestToRegisterBusiness = async (req, res)=> {
    try {
        const userId = req.body.ownerId

        const newBusinessData = []

        const BusienssData = await BusinessRequest.find({
            deletedAt: null || undefined,
            active: true
        })

        const userData = await User.findById({ _id: userId })


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
            data: {
                name: userData.name,
                ...newBusinessData
            }
        });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};
module.exports = {
    requestAdminToRegister,
    getAdminRequestToRegisterBusiness
};
const getBuinessData = async (business) => {
    const myServiceData = {
        description: business.description,
        googleBusiness: business.googleBusiness
    };
    return myServiceData;
};