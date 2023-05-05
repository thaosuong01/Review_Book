const { typeOfObjectId } = require("../utils/functions");

class ParentService {
  constructor(model) {
    this.model = model;
  }

  getAll = (filters = {}, isPostModel = false) => {
    return new Promise(async (resolve, reject) => {
      try {
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 5;
        const skip = (page - 1) * limit;
        let options = { is_delete: false };
        let sort = filters.sort || "_id";
        let sortBy = {};
        let where = filters.where;
        let whereBy = {};

        where ? (where = where.split(",")) : (where = [where]);

        if (where[1] && where[1].search(";") !== -1) {
          where[1] = where[1].split(";");
        }

        if (where[1] && Array.isArray(where[1])) {
          whereBy[where[0]] = {
            $in: where[1],
          };
        } else {
          where[1] && (whereBy[where[0]] = where[1]);
        }

        if (where) {
          options = {
            ...options,
            ...whereBy,
          };
        }

        filters.sort ? (sort = filters.sort.split(",")) : (sort = [sort]);
        // * ["sort", "desc"] || ["_id"];

        sort[1] ? (sortBy[sort[0]] = sort[1]) : (sortBy[sort[0]] = "asc");
        // * { sort: "desc" } || { _id: "asc" }

        if (filters.search && filters.field) {
          options = {
            ...options,
            [filters.field]: { $regex: filters.search, $options: "i" },
          };
        }

        let data;

        if (!isPostModel) {
          data = await this.model
            .find(options)
            .select(filters.selectField)
            .limit(limit)
            .skip(skip)
            .sort(sortBy);
        } else {
          data = await this.model
            .find(options)
            .select(filters.selectField)
            .limit(limit)
            .skip(skip)
            .sort(sortBy)
            .populate("category_id")
            .populate("user_id", "-password");
        }

        const total = await this.model.countDocuments(options);

        resolve({
          elements: data,
          errors: null,
          status: 200,
          meta: {
            pagination: {
              page,
              limit,
              totalRows: Math.ceil(total / limit),
            },
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  create = async (data) => {
    const response = await this.model.create(data);

    return {
      elements: response,
      status: 201,
      errors: null,
    };
  };

  getById = (id, isPostModel = false) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!typeOfObjectId(id + "")) {
          return resolve({
            errors: {
              message: "Id không đúng giá trị",
            },
            elements: null,
            status: 400,
          });
        }

        let response;

        if (!isPostModel) {
          response = await this.model.findById(id).exec();
        } else {
          response = await this.model
            .findById(id)
            .populate("category_id", "_id parent_id name")
            .exec();
        }

        if (!response) {
          resolve({
            errors: {
              message: "Id không tồn tại",
            },
            elements: {},
            status: 200,
          });
        }

        resolve({
          elements: response,
          errors: null,
          status: 200,
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  update = async ({ id, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.model.findOneAndUpdate(
          { _id: id },
          { $set: data },
          {
            upsert: false,
            new: true,
          }
        );

        if (!response) {
          return resolve({
            errors: {
              message: "Id không tồn tại",
            },
            status: 400,
          });
        }

        resolve({
          elements: response,
          status: 201,
          errors: null,
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  delete = ({ id, isDelete = false }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (isDelete) {
          // Xoá vĩnh viễn
          const response = await this.model.findOneAndDelete(
            { _id: id },
            { rawResult: true }
          );

          return resolve({
            errors: null,
            status: 200,
            elements: response,
          });
        }

        const response = await this.update({ id, data: { is_delete: true } });

        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };

  deleteForce = async (id) => {
    return await this.delete({ id, isDelete: true });
  };
}

module.exports = ParentService;
