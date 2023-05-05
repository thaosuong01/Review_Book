const { typeOfObjectId } = require("../utils/functions");
const ParentService = require("./parent.service");

class CategoryService extends ParentService {
  superCreate = this.create;
  superUpdate = this.update;

  create = async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, level, parentId } = data;

        const findName = await this.model.findOne({ name }).exec();

        if (findName) {
          return resolve({
            errors: {
              message: "Tên danh mục đã tồn tại!",
            },
            status: 400,
          });
        }

        if (level && parentId && !typeOfObjectId(parentId + "")) {
          return resolve({
            status: 400,
            errors: {
              message: "Parent id không hợp lệ",
            },
            elements: null,
          });
        }

        const response = await this.superCreate({
          parent_id: parentId,
          ...data,
        });

        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };

  getAllWithChildren = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await this.model.find({ is_delete: false });

        const response = this.nestedCategories(result);

        resolve({
          status: 200,
          elements: response,
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  getByParentId = (parentId) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!typeOfObjectId(parentId + "")) {
          return resolve({
            errors: {
              message: "Parent Id = " + parentId + " không hợp lệ!",
            },
            status: 400,
          });
        }

        const response = await this.model.find({ parent_id: parentId }).exec();

        resolve({
          errors: null,
          elements: response,
          status: 200,
          meta: {
            message: "Get category by parent id success",
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  update = async ({ id, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findName = await this.model
          .findOne({ name: data.name })
          .select("_id")
          .exec();

        if (findName && id !== findName._id.toString()) {
          return resolve({
            errors: {
              message: `Danh mục ${data.name} đã tồn tại`,
            },
            status: 400,
          });
        }

        const response = await this.superUpdate({ id, data });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };

  nestedCategories = (categories, parentId = null) => {
    const categoryList = [];
    let category;

    if (parentId == null) {
      category = categories.filter((cat) => cat.parent_id == null);
    } else {
      category = categories.filter(
        (cat) => String(cat.parent_id) == String(parentId)
      );
    }

    for (let cate of category) {
      categoryList.push({
        _id: cate._id,
        name: cate.name,
        slug: cate.slug,
        level: cate.level,
        parent_id: cate.parent_id,
        childrens: this.nestedCategories(categories, cate._id),
      });
    }
    return categoryList;
  };

  getBySlug = async (slug) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findCategory = await this.model
          .findOne({
            slug,
            is_delete: false,
          })
          .select("name slug level")
          .exec();

        if (!findCategory) {
          return resolve({
            errors: {
              message: `Danh mục với slug là ${slug} không tồn tại`,
            },
            status: 404,
          });
        }

        let children = [];
        let result = {
          ...findCategory._doc,
          childrens: [],
        };

        if (findCategory.level === 1) {
          const { elements } = await this.getByParentId(findCategory._id);
          children = [...elements];
        }

        if (children.length > 0) {
          result = {
            ...result,
            childrens: [...children],
          };
        }

        resolve({
          errors: null,
          elements: result,
          status: 200,
          meta: {
            message: "Get category by slug success",
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  };
}

module.exports = CategoryService;
