const Service = require("../models/Service/ServiceModel");
const User = require("../models/UserModel");
const ServiceType = require("../models/Service/ServiceTypeModel");
const Specialist = require("../models/SpecialistModel");
const validator = require("validator");

const addServiceTypeApi = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Name is required",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role === "user") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to add service type",
      });
    }

    const isServiceTypeExist = await ServiceType.findOne({ name });
    if (isServiceTypeExist) {
      return res.status(400).json({
        status: "error",
        message: "Service type already exists",
      });
    }

    await ServiceType.create({
      name,
      createdBy: id,
    });

    res.status(200).json({
      status: "success",
      message: "Service type added successfully",
    });
  } catch (error) {
    console.log("Error in add service type", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const addServiceApi = async (req, res, next) => {
  try {
    const {
      name,
      description,
      image,
      price,
      typeId,
      specialistId,
      date,
      businessId,
      timeSlots,
    } = req.body;
    if (
      !name ||
      !description ||
      !image ||
      !price ||
      !typeId ||
      !specialistId ||
      !date ||
      !businessId ||
      !timeSlots
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    if (!validator.isURL(image)) {
      return res.status(400).json({
        status: "error",
        message: "Image URL is invalid",
      });
    }

    if (!validator.isMongoId(typeId)) {
      return res.status(400).json({
        status: "error",
        message: "Type is invalid",
      });
    }

    if (!validator.isMongoId(specialistId)) {
      return res.status(400).json({
        status: "error",
        message: "Specialist is invalid",
      });
    }

    if (!validator.isMongoId(businessId)) {
      return res.status(400).json({
        status: "error",
        message: "Business is invalid",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "shopkeeper") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to add service",
      });
    }

    const isServiceTypeExist = await ServiceType.findById(typeId);
    if (!isServiceTypeExist) {
      return res.status(400).json({
        status: "error",
        message: "Service type does not exists",
      });
    }

    const isSpecialistExist = await Specialist.findById(specialistId);
    if (!isSpecialistExist) {
      return res.status(400).json({
        status: "error",
        message: "Specialist does not exists",
      });
    }

    // const isBusinessExist = await Business.findById(businessId);
    // if (!isBusinessExist) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "Business does not exists",
    //   });
    // }

    await Service.create({
      name,
      description,
      image,
      price,
      typeId,
      specialistId,
      date,
      businessId,
      timeSlots,
      shopkeeperId: req.user.id,
    });

    res.status(200).json({
      status: "success",
      message: "Service added successfully",
    });
  } catch (error) {
    console.log("Error in creating service", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getServicesApi = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { businessId } = req.body;
    if (!businessId) {
      return res.status(400).json({
        status: "error",
        message: "Business Id is required",
      });
    }
    if (!validator.isMongoId(businessId)) {
      return res.status(400).json({
        status: "error",
        message: "Business Id is invalid",
      });
    }
    let myServices = [];
    const services = await Service.find({
      businessId,
      shopkeeperId: id,
      active: true,
    });
    services.forEach(async (service) => {
      const myServiceData = await getServiceData(service);
      myServices.push(myServiceData);
      if (myServices.length === services.length) {
        res.status(200).json({
          status: "success",
          data: myServices,
        });
      }
    });
  } catch (error) {
    console.log("Error in getting services", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getServiceDetailApi = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Service Id is required",
      });
    }
    if (!validator.isMongoId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Service Id is invalid",
      });
    }
    const service = await Service.findById(id);
    if (!service) {
      return res.status(400).json({
        status: "error",
        message: "Service not found",
      });
    }
    const myServiceData = await getServiceData(service);
    res.status(200).json({
      status: "success",
      data: myServiceData,
    });
  } catch (error) {
    console.log("Error in getting service detail", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  addServiceTypeApi,
  addServiceApi,
  getServicesApi,
  getServiceDetailApi,
};

const getServiceData = async (data) => {
  const { typeId, specialistId } = data;
  const type = await ServiceType.findById(typeId);
  const specialist = await Specialist.findById(specialistId);
  const myServiceData = {
    id: data._id,
    name: data.name,
    description: data.description,
    image: data.image,
    price: data.price,
    date: data.date,
    type: { name: type.name, id: type._id },
    specialist: {
      name: specialist.name,
      id: specialist._id,
      email: specialist.email,
    },
    timeSlots: data.timeSlots,
  };
  return myServiceData;
};
