const loginRegisterRouter = require("express").Router();
const {register,duplicateUserIdChecker, login} = require("../controller/loginRegisterController");


loginRegisterRouter.post("/register",register);
loginRegisterRouter.post("/duplicateUserIdChecker",duplicateUserIdChecker);
loginRegisterRouter.post("/login",login);

module.exports = loginRegisterRouter;