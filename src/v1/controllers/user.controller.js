const { _User } = require("../models/user.model");
const UserService = require("../services/user.service");
const { typeOfObjectId } = require("../utils/functions");
const ParentController = require("./parent.controller");

class UserController extends ParentController {
  constructor() {
    const service = new UserService(_User);
    super(service);
  }

  create = async (req, res, next) => {
    try {
      const data = req.body;

      if (!data.email || !data.password) {
        return next({
          status: 400,
          message: "Chưa nhập trường email hoặc password!",
        });
      }

      const response = await this.service.create({
        email: data.email,
        password: data.password,
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
          message: "Chưa nhập trường mật khẩu!",
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
