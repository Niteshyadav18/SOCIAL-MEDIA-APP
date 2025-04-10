import express from "express";
import {signupUser} from "../controllers/userController.js";
import {loginUser} from "../controllers/userController.js";
import {logoutUser} from "../controllers/userController.js";
import {followUnFollowUser} from "../controllers/userController.js";
import {updateUser} from "../controllers/userController.js";
import {getUserProfile} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoutes.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", protectRoute, updateUser);

export default router;
