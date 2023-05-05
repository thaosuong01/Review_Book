const RoleService = require("../services/role.service");
const { _Role } = require("../models/role.model");
const ParentController = require("./parent.controller");

class RoleController extends ParentController {
  constructor() {
    const _service = new RoleService(_Role);
    super(_service);
  }

  getAll = async (req, res, next) => {
    try {
      let response = await this.service.getAll({
        selectField: "name key",
        ...req.query,
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  getRoleIdGTE5 = async (req, res, next) => {
    try {
      const response = await this.service.getRoleIdGTE5();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // @override
  create = async (req, res, next) => {
    try {
      const data = req.body;

      if (!data.name || !data.key) {
        return next({
          status: 400,
          message: "Thiếu trường name hoặc key",
        });
      }

      const response = await this.service.create({
        key: data.key,
        name: data.name,
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new RoleController();
