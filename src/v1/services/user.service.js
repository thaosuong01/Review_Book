const ParentService = require("./parent.service");
const { typeOfObjectId } = require("../utils/functions");

class UserService extends ParentService {
  superCreate = this.create;
  superUpdate = this.update;

  create = ({ email, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findEmail = await this.model.findOne({ email }).exec();

        if (findEmail) {
          return resolve({
            errors: {
              message: "Email đã tồn tại!",
            },
            status: 400,
          });
        }

        const hashPassword = await this.model.hashPassword(password);

        const response = await this.superCreate({
          email,
          password: hashPassword,
        });

        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };

  update = ({ id, data }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!typeOfObjectId(id + "")) {
          return resolve({
            errors: {
              message: "Id không hợp lệ",
            },
            status: 400,
          });
        }

        if (data.email) {
          const findEmail = await this.model
            .findOne({
              email: data.email,
            })
            .exec();

          if (findEmail && id !== findEmail._id.toString()) {
            return resolve({
              errors: {
                message: "Email đã tồn tại!",
              },
              status: 400,
            });
          }
        }

        const response = await this.superUpdate({ id, data });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };

  changePassword = ({ id, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const hashPassword = await this.model.hashPassword(password);
        resolve(await this.update({ id, data: { password: hashPassword } }));
      } catch (error) {
        reject(error);
      }
    });
  };
}

module.exports = UserService;
