const UserService = require("../services/user.service");
const { _User } = require("../models/user.model");
const ParentController = require("./parent.controller");

class UserController extends ParentController {

    constructor() {
        const service = new UserService(_User);
        super(service);
    }
}

module.exports = new UserController();