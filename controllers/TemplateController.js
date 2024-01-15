const User = require("../models/UserModel");
const Template = require("../models/TemplateModal");
const slugify = require("slugify");
const imgFullPath = require("../util/imgFullPath");
const validator = require("validator");


const addTemplateApi = async (req, res, next) => {
  let bookingImg = req.files["bookingImage"][0].path;
  let websiteImg = req.files["websiteImage"][0].path;
  console.log("bookingImg",bookingImg)
  console.log("websiteImg",websiteImg)

  try {
    const { id } = req.user;

    const user = await User.findById(id);
    console.log("user", user);

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

    const { name, status } = req.body;
    const slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });

    if (!name || !slug) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const newTemplate = await Template.create({
      name,
      slug,
      bookingImage: bookingImg,
      websiteImage: websiteImg,
      createdBy: id,
      status,
    });
    console.log(newTemplate);

    res.status(201).json({
      status: "success",
      data: newTemplate,
      message: "New template added successfully",
    });
  } catch (error) {
    console.error("Error in adding template Details", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getTepmlateApi = async (req, res, next) => {
  try {
    let myTemplate = [];
    const templates = await Template.find();

    await Promise.all(
      templates.map(async (template) => {
        const mytemplateData = await getTemplateData(template);
        myTemplate.push(mytemplateData);
      })
    );

    res.status(200).json({
      status: "success",
      data: myTemplate,
    });
  } catch (error) {
    console.log("Error in getting template", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const updateTemplateApi = async (req, res, next) => {
  console.log(req.file, "----");
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { templateId } = req.params;

    if (!templateId) {
      return res.status(400).json({
        status: "error",
        message: "templateId is required",
      });
    }

    if (!validator.isMongoId(templateId)) {
      return res.status(400).json({
        status: "error",
        message: "templateId is invalid",
      });
    }

    // const mytemplateImg = req.file?.path ? req.file.path : service.image;

  
 await Template.findOneAndUpdate(
      { _id: templateId },
      { $set: { ...req.body} },
      { new: true }
    );

    const myTemplateData = await Template.findOne({ _id: templateId });
    const myTemplateUpdatedData = await getTemplateData(myTemplateData);

    res.status(200).json({
      status: "success",
      data: myTemplateUpdatedData,
      message: "Template updated successfully",
    });
  } catch (error) {
    console.log("Error in updating service", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteTemplateApi = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    console.log(templateId,"templateId")

    if (!templateId || !validator.isMongoId(templateId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan ID",
      });
    }

    const template = await Template.findById(templateId);

    if (!template) {
      return res.status(400).json({
        status: "error",
        message: "template not found",
      });
    }
    await Template.findByIdAndUpdate(
      { _id: templateId },
      { deletedAt: new Date() }
    );

    res.status(200).json({
      status: "success",
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleting plan", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


module.exports = {
  addTemplateApi,
  getTepmlateApi,
  updateTemplateApi,
  deleteTemplateApi,
};

const getTemplateData = async (data) => {
  const myTemplateData = {
    id: data._id,
    name: data.name,
    bookingImage: imgFullPath(data.bookingImage),
    websiteImage: imgFullPath(data.websiteImage),
    slug: data.slug,
    status: data.status,
  };
  return myTemplateData;
};




