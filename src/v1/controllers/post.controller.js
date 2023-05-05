const { _Post } = require("../models/post.model");
const PostService = require("../services/post.service");
const { typeOfObjectId } = require("../utils/functions");
const ParentController = require("./parent.controller");

class PostController extends ParentController {
  constructor() {
    const _service = new PostService(_Post);
    super(_service);
  }

  create = async (req, res, next) => {
    try {
      const data = req.body;

      console.log(data);

      if (
        !data.title ||
        !data.detail_html ||
        !data.categoryId ||
        !data.userId
      ) {
        return next({
          message:
            "title, detail_html, cateogryId, userId là trường bắt buộc !",
          status: 400,
        });
      }

      if (
        !typeOfObjectId(data.categoryId + "") ||
        !typeOfObjectId(data.userId + "")
      ) {
        return next({
          message: "Category id hoặc user id không hợp lệ!",
          status: 400,
        });
      }

      const response = await this.service.create(data);
      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  getBySlug = async (req, res, next) => {
    try {
      const { slug } = req.params;

      const response = await this.service.getBySlug(slug);

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };

  getPostByUserId = async (req, res, next) => {
    try {
      const { userId } = req.params;

      const response = await this.service.getPostByUserId(userId);

      res.status(response.status).json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new PostController();
