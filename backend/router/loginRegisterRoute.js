const loginRegisterRouter = require("express").Router();
const {register,duplicateUserIdChecker} = require("../controller/loginRegisterController");


loginRegisterRouter.post("/register",register);
loginRegisterRouter.post("/duplicateUserIdChecker",duplicateUserIdChecker);

module.exports = loginRegisterRouter;