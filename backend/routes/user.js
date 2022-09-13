import express from "express";
import authController from "../middlewarecontroller/authController.js";
import middlewareController from "../middlewarecontroller/middlewareController.js";
import uploadFile from "../middlewarecontroller/uploadFile.js";
import userController from "../controllers/userController.js";
const router = express.Router();
import feature from "../middlewarecontroller/features.js";
// import {router} from ""
//REGISTER
router.post("/register", middlewareController.validateInputUserAPI, authController.registerUser);

//LOG IN
router.post("/login", authController.loginUser);

// GET ALL USERS
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

//DELETE USER
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);

// REFRESH
router.post("/refresh", authController.reqRefreshToken);

//LOG OUT
router.post("/logout", middlewareController.verifyToken, authController.userLogout);

//UPDATE USER
router.put("/update", userController.updateUser);

//FORGET PASSWORD
router.post("/forget", userController.forgetPassword);

//RESET PASSWORD
router.post("/reset", userController.resetPasswordAPI);

//UPLOAD SINGLE FILE
router.post("/single", uploadFile.single("image"), userController.uploadSingleFile);

//UPLOAD MULTIPLE FILE
router.post("/multiple", uploadFile.array("images", 3), userController.uploadMultipleFiles);

//CREATE AVATAR USER
router.post("/create", userController.createAvatar);

//GET AVATAR USER
router.get("/avatar/:id", middlewareController.verifyToken, userController.getAvatar);

//DELETE AVATAR USER
router.delete("/avatar/:id", middlewareController.verifyToken, userController.deleteAvatar);

//PAGING_FUNC
router.get("/user", feature.pagingFunc);

//SORT_FUNCTION
router.get("/sort", feature.sortingFunc);

export default router;