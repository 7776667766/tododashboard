const User = require("../models/UserModel");
const Business = require("../models/BusinessModal");
const Specialist = require("../models/SpecialistModel");
const Service = require("../models/Service/ServiceModel");
const ServiceType = require("../models/Service/ServiceTypeModel");
const slugify = require("slugify");
const validator = require("validator");
const imgFullPath = require("../util/imgFullPath");
const { businessData } = require("./BusinessController");
require("dotenv").config();

const addServiceTypeApi = async (req, res, next) => {
  console.log("req.body", req.body);
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
    const { name, slug } = req.body;
    if (!name || !slug || !req.file) {
      return res.status(400).json({
        status: "error",
        message: "All fields required",
      });
    }

    const slugAlreadyExist = await ServiceType.findOne({ slug: slug });
    if (slugAlreadyExist) {
      return res.status(400).json({
        status: "error",
        message: "Slug already exists",
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

    const isServiceTypeSlugExist = await ServiceType.findOne({ slug });
    if (isServiceTypeSlugExist) {
      return res.status(400).json({
        status: "error",
        message: "Service type slug already exists",
      });
    }

    const isServiceTypeNameExist = await ServiceType.findOne({ name });
    if (isServiceTypeNameExist) {
      return res.status(400).json({
        status: "error",
        message: "Service type name already exists",
      });
    }

    const newServiceType = await ServiceType.create({
      name,
      slug,
      image: req.file.path,
      createdBy: id,
    });

    const myServiceType = await getServiceTypeData(newServiceType);
    res.status(200).json({
      status: "success",
      data: myServiceType,
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

const getAllServicesTypeApi = async (req, res, next) => {
  try {
    const serviceTypes = await ServiceType.find({
      deletedAt: null || undefined,
    });

    const myServiceTypes = [];
    await Promise.all(
      serviceTypes.map(async (serviceType) => {
        const myServiceType = await getServiceTypeData(serviceType);
        myServiceTypes.push(myServiceType);
      })
    );

    res.status(200).json({
      status: "success",
      data: myServiceTypes,
    });
  } catch (error) {
    console.log("Error in getting all service types", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const addServiceApi = async (req, res, next) => {
  console.log(req.body, "request of services");
  try {
    if (!req.file) {
      return res.status(400).send("No image file uploaded");
    }

    const { id } = req.user;
    const {
      name,
      description,
      price,
      typeId,
      slug,
      specialistId,
      timeInterval,
      businessId,
      timeSlots,
    } = req.body;

    console.log(timeInterval);

    if (
      !name ||
      !description ||
      !price ||
      !typeId ||
      !specialistId ||
      !timeInterval ||
      !businessId ||
      !timeSlots
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
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

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "owner" && user.role !== "manager") {
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

    const isBusinessExist = await Business.findById(businessId);
    if (!isBusinessExist) {
      return res.status(400).json({
        status: "error",
        message: "Business does not exists",
      });
    }

    console.log(businessId, "businessId");

    const mySlug = slugify(slug, { lower: true, remove: /[*+~.()'"#!:@]/g });

    const slugAlreadyExist = await Service.findOne({ slug: mySlug });
    if (slugAlreadyExist) {
      return res.status(400).json({
        status: "error",
        message: "Slug already exists",
      });
    }

    const data = await Service.create({
      name,
      description,
      image: req.file.path,
      price,
      typeId,
      specialistId,
      timeInterval,
      businessId,
      timeSlots,
      ownerId: id,
      slug: mySlug,
    });

    const myService = await Service.findOne({ _id: data._id });
    const myServiceData = await getServiceData(myService);
    console.log("myServicesData", myServiceData);
    res.status(200).json({
      status: "success",
      data: myServiceData,
      message: "Service added successfully",
    });
  } catch (error) {
    console.error("Error in creating service", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateServiceApi = async (req, res, next) => {
  console.log(req.file, "----");
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { serviceId } = req.params;

    const { id } = req.user;
    const { businessId, typeId, specialistId } = req.body;
    if (!serviceId) {
      return res.status(400).json({
        status: "error",
        message: "Service Id is required",
      });
    }

    if (!validator.isMongoId(serviceId)) {
      return res.status(400).json({
        status: "error",
        message: "Service Id is invalid",
      });
    }
    if (typeId) {
      if (!validator.isMongoId(typeId)) {
        return res.status(400).json({
          status: "error",
          message: "Type is invalid",
        });
      }
      const isServiceTypeExist = await ServiceType.findById(typeId);
      if (!isServiceTypeExist) {
        return res.status(400).json({
          status: "error",
          message: "Service type does not exists",
        });
      }
    }
    if (specialistId) {
      if (!validator.isMongoId(specialistId)) {
        return res.status(400).json({
          status: "error",
          message: "Specialist is invalid",
        });
      }
      const isSpecialistExist = await Specialist.findById(specialistId);
      if (!isSpecialistExist) {
        return res.status(400).json({
          status: "error",
          message: "Specialist does not exists",
        });
      }
    }

    if (businessId) {
      if (!validator.isMongoId(businessId)) {
        return res.status(400).json({
          status: "error",
          message: "Business is invalid",
        });
      }
      const isBusinessExist = await Business.findById(businessId);
      if (!isBusinessExist) {
        return res.status(400).json({
          status: "error",
          message: "Business does not exists",
        });
      }
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(400).json({
        status: "error",
        message: "Service not found",
      });
    }
    if (service.ownerId != id) {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to update this service",
      });
    }

    const myServiceImg = req.file?.path ? req.file.path : service.image;

    await Service.updateOne(
      { _id: serviceId },
      { ...req.body, image: myServiceImg }
    );
    console.log({ ...req.body, image: myServiceImg }, "req.body");

    const myServiceData = await Service.findOne({ _id: serviceId });
    const myServiceUpdatedData = await getServiceData(myServiceData);

    res.status(200).json({
      status: "success",
      data: myServiceUpdatedData,
      message: "Service updated successfully",
    });
  } catch (error) {
    console.log("Error in updating service", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAllServicesApi = async (req, res, next) => {
  try {
    let myServices = [];
    const services = await Service.find({
      deletedAt: null || undefined,
      active: true,
    });

    await Promise.all(
      services.map(async (service) => {
        const myServiceData = await getServiceData(service);
        myServices.push(myServiceData);
      })
    );

    res.status(200).json({
      status: "success",
      data: myServices,
    });
  } catch (error) {
    console.log("Error in getting all services", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateServiceTypeApi = async (req, res) => {
  try {
    console.log(req.body);
    const { serviceTypeId } = req.params;
    console.log("serviceTypeId", serviceTypeId);
    if (!serviceTypeId) {
      return res.status(400).json({
        status: "error",
        message: "Service Type Id is required",
      });
    }

    if (!validator.isMongoId(serviceTypeId)) {
      return res.status(400).json({
        status: "error",
        message: "Service Type Id is invalid",
      });
    }

    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        status: "error",
        message: "You are not authorized to update service type",
      });
    }

    const serviceType = await ServiceType.findById(serviceTypeId);
    if (!serviceType) {
      return res.status(400).json({
        status: "error",
        message: "Service Type not found",
      });
    }
    const myServiceTypeImg = req.file?.path ? req.file.path : serviceType.image;

    const updatedServiceType = await ServiceType.findOneAndUpdate(
      { _id: serviceTypeId },
      { $set: { ...req.body, image: myServiceTypeImg } },
      { new: true }
    );

    const myServiceType = await getServiceTypeData(updatedServiceType);

    res.status(200).json({
      status: "success",
      data: myServiceType,
      message: "Service Type updated successfully",
    });
  } catch (error) {
    console.error("Error in updating service", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

const getServicesApi = async (req, res, next) => {
  try {
    const { businessId } = req.body;

    let myServices = [];
    const services = await Service.find({
      deletedAt: null || undefined,
      businessId,
      active: true,
    });

    await Promise.all(
      services.map(async (service) => {
        const myServiceData = await getServiceData(service);
        myServices.push(myServiceData);
      })
    );

    res.status(200).json({
      status: "success",
      data: myServices,
    });
  } catch (error) {
    console.log("Error in getting services", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getServiceDetailBySlugApi = async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({
        status: "error",
        message: "Service slug is required",
      });
    }
    const service = await Service.findOne({ slug });
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

const deleteServiceApi = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId || !validator.isMongoId(serviceId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid service ID",
      });
    }

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(400).json({
        status: "error",
        message: "Service not found",
      });
    }
    await Service.findByIdAndUpdate(
      { _id: serviceId },
      { deletedAt: new Date() }
    );

    res.status(200).json({
      status: "success",
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleting service", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const addDummyServiceApi = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image file uploaded");
    }

    const { id } = req.user;
    const { name, description, price, typeId, timeInterval, timeSlots } =
      req.body;

    console.log(timeInterval);

    if (
      !name ||
      !description ||
      !price ||
      !typeId ||
      !timeInterval ||
      !timeSlots
    ) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    const business = await Business.findOne({ slug: "dummy-business" });

    console.log("businessId", business._id);

    let slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });

    const isSlugAlredyExist = await Service.findOne({ slug });
    if (isSlugAlredyExist) {
      // update slug
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const data = await Service.create({
      name,
      description,
      image: req.file.path,
      price,
      typeId,
      timeInterval,
      businessId: business._id,
      timeSlots,
      ownerId: id,
      slug,
    });
    console.log("data", data);

    res.status(200).json({
      status: "success",
      data,
      message: "Dummy Service added successfully",
    });
  } catch (error) {
    console.error("Error in creating service", error);

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getDummyServicesApi = async (req, res, next) => {
  try {
    const { businessId } = req.body;

    let myServices = [];
    const services = await Service.find({
      deletedAt: null || undefined,
      businessId,
      active: true,
    });

    await Promise.all(
      services.map(async (service) => {
        const myServiceData = await getServiceData(service);
        myServices.push(myServiceData);
      })
    );

    res.status(200).json({
      status: "success",
      data: myServices,
    });
  } catch (error) {
    console.log("Error in getting services", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteServicTypeApi = async (req, res, next) => {
  try {
    const { serviceTypeId } = req.params;

    if (!serviceTypeId || !validator.isMongoId(serviceTypeId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid service type id",
      });
    }

    const serviceType = await ServiceType.findById(serviceTypeId);

    if (!serviceType) {
      return res.status(400).json({
        status: "error",
        message: "Service not found",
      });
    }
    await ServiceType.findByIdAndUpdate(
      { _id: serviceTypeId },
      { deletedAt: new Date() }
    );

    res.status(200).json({
      status: "success",
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleting service", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  addServiceTypeApi,
  getAllServicesTypeApi,
  addServiceApi,
  updateServiceApi,
  updateServiceTypeApi,
  getServicesApi,
  getAllServicesApi,
  getServiceDetailBySlugApi,
  getDummyServicesApi,
  deleteServicTypeApi,
  deleteServiceApi,
  addDummyServiceApi,
};

const getServiceTypeData = async (data) => {
  return {
    id: data._id,
    name: data.name,
    slug: data.slug,
    image: imgFullPath(data.image),
  };
};

const getServiceData = async (data) => {
  const { typeId, specialistId } = data;
  const type = await ServiceType.findById(typeId);
  const serviceType = await getServiceTypeData(type);
  const specialist = await Specialist.findById(specialistId).select({
    _id: 0,
    name: 1,
    id: {
      $toString: "$_id",
    },
    email: 1,
  });
  const business = await Business.findById(data.businessId);
  const myBusinessData = await businessData(business);
  const myServiceData = {
    id: data._id,
    name: data.name,
    description: data.description,
    image: imgFullPath(data.image),
    slug: data.slug,
    price: data.price,
    timeInterval: data.timeInterval,
    slug: data.slug,
    business: myBusinessData,
    type: serviceType,
    specialist: specialist,
    timeSlots: data.timeSlots,
  };
  return myServiceData;
};
