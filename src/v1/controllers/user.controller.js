const UserService = require("../services/user.service");
const { _User } = require("../models/user.model");
const ParentController = require("./parent.controller");
const { typeOfObjectId } = require("../utils/functions");

class UserController extends ParentController {
  constructor() {
    const service = new UserService(_User);
    super(service);
  }

  create = async (req, res, next) => {
    try {
      const data = req.body;

      if (!data.email || !data.password || !data.roleId) {
        return next({
          status: 400,
          message: "Chưa nhập email, password hoặc roleId",
        });
      }

      const response = await this.service.create({
        email: data.email,
        password: data.password,
        roleId: data.roleId,
      });

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const selectField = "role is_verified email full_name image";
      const response = await this.service.getAll({ selectField, ...req.query });

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const id = req.params.id;
      const password = req.body.password;

      if (!typeOfObjectId(id + "")) {
        return next({
          status: 400,
          message: "Id không hợp lệ",
        });
      }

      if (!password) {
        return next({
          status: 400,
          message: "Chưa điền mật khẩu",
        });
      }

      const response = await this.service.changePassword({ id, password });
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new UserController();
