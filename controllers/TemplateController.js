const User = require("../models/UserModel");
const Template = require("../models/TemplateModal");
const slugify = require("slugify");
const imgFullPath = require("../util/imgFullPath");
const validator = require("validator");

const addTemplateApi = async (req, res, next) => {
  let bookingImg = req.files?.["bookingImage"]?.[0]?.path;
  let websiteImg = req.files?.["websiteImage"]?.[0]?.path;
  console.log("bookingImg", bookingImg);
  console.log("websiteImg", websiteImg);

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

    const { name, slug, status, fontFamily, fontSize, description } = req.body;
    const slug2 = slugify(slug, { lower: true, remove: /[*+~.()'"!:@]/g });

    if (!name || !slug) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const newTemplate = await Template.create({
      name,
      slug: slug2,
      fontFamily,
      fontSize,
      description,
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
    const templates = await Template.find({ deletedAt: { $exists: false } });

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
  try {
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

    const template = await Template.findById(templateId);

    let bookingImg =
      req.files?.["bookingImage"]?.[0]?.path ?? template.bookingImage;
    let websiteImg =
      req.files?.["websiteImage"]?.[0]?.path ?? template.websiteImage;

    await Template.findOneAndUpdate(
      { _id: templateId },
      {
        $set: {
          ...req.body,

          bookingImage: bookingImg,
          websiteImage: websiteImg,
        },
      },
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
    console.log("Error in updating template", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteTemplateApi = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    if (!templateId || !validator.isMongoId(templateId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid template ID",
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
      message: "template Deleted Successfully",
    });
  } catch (error) {
    console.log("Error in Deleting Template", error);
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
    description: data.description,
    slug: data.slug,
    status: data.status,
    fontFamily: data.fontFamily,
    fontSize: data.fontSize,
  };
  return myTemplateData;
};
