const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");

const addPlanApi = async (req, res, next) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "User not found",
            });
        }
        console.log("userID--------", user);

        if (user.role !== "admin") {
            return res.status(400).json({
                status: "error",
                message: "You are not authorized to add Plan",
            });
        }
        console.log(req.body,"body------");

        const { name, duration, price, description , features} = req.body

        const newPlan = await Plan.create({
            userId: user._id,
            name,
            duration,
            price,
            description,
            features
        });

        console.log("NewPlan....", newPlan);

        res.status(201).json({ status: 'success', data: newPlan, message: "New Plan Aded Successfully" });

    } catch (error) {
        console.error('Error in adding Plan Details', error);
        res.status(500).json({ status: 'error', message: error });
    }
};

const getPlanbyAdminId = async (req, res, next) => {
    try {

        const planData = await Plan.find({})
        if (!planData) {
            return res.status(400).json({
                status: "error",
                message: "planData not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: planData,
        });

    } catch (error) {
        console.log("Error in get planData by user id", error);
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = {
    addPlanApi,
    getPlanbyAdminId
};