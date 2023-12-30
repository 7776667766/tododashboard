const User = require("../models/UserModel");
const Template = require("../models/TemplateModal");
const slugify = require("slugify");

const addTemplateApi = async (req, res, next) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id);
        console.log("user", user)

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "User not found",
            });
        }

        if (user.role !== "admin") {
            return res.status(400).json({
                status: "error",
                message: "You are not authorized to add plan",
            });
        }

        const { name, bookingImage, websiteImage } = req.body;
        const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });


        if (!name || !slug || !bookingImage || !websiteImage) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required",
            });
        }

        const newTemplate = await Template.create({
            name,
            slug,
            bookingImage,
            websiteImage,
            createdBy: id,
        });
        console.log(newTemplate)
        res.status(201).json({
            status: "success",
            data: newTemplate,
            message: "New template added successfully",
        });
    } catch (error) {
        console.error("Error in adding template Details", error);
        res.status(500).json({ status: "error", message: error });
    }
};

const getTepmlateApi = async (req, res, next) => {
    try {
        const planData = await Plan.find({});
        if (!planData) {
            return res.status(400).json({
                status: "error",
                message: "Plan not found",
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
    addTemplateApi,
    // getTepmlateApi,
};
