const ParentController = require("./parent.controller");
const { _Category } = require("../models/category.model");
const CategoryService = require("../services/category.service");

class CategoryController extends ParentController {
  constructor() {
    const _service = new CategoryService(_Category);
    super(_service);
  }

  create = async (req, res, next) => {
    try {
      const data = req.body;

      if (!data.name || !data.slug) {
        return next({
          message: "Tên danh mục hoặc slug là trường bắt buộc!",
          status: 400,
        });
      }

      const response = await this.service.create(data);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const selectField = "name slug level";
      const response = await this.service.getAll({ selectField, ...req.query });
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAllWithChildren = async (req, res, next) => {
    try {
      const response = await this.service.getAllWithChildren();
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  getByParentId = async (req, res, next) => {
    try {
      const response = await this.service.getByParentId(req.params.id);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  getBySlug = async (req, res, next) => {
    try {
      const response = await this.service.getBySlug(req.params.slug);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new CategoryController();
