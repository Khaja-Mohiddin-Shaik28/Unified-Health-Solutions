const loginRegisterRouter = require("express").Router();
const {register,duplicateUserIdChecker, login, } = require("../controller/loginRegisterController");
const {verifyRouteMiddleware} = require("../middleware/verifyRouteMiddleware");

loginRegisterRouter.post("/register",register);
loginRegisterRouter.post("/duplicateUserIdChecker",duplicateUserIdChecker);
loginRegisterRouter.post("/login",login);


// Protected Route
loginRegisterRouter.get("/dashboard/:userId", verifyRouteMiddleware, (req, res)=>{
    res.status(200).json({status : true, user : req.user});
})

module.exports = loginRegisterRouter;