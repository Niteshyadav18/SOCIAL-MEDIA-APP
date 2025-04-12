import express from "express";
import {createPost} from "../controllers/postController.js";
import {getPost} from "../controllers/postController.js";
import {getUserPosts} from "../controllers/postController.js";
import {deletePost} from "../controllers/postController.js";
import {likedUnlikedPost} from "../controllers/postController.js";
import {replyToPost} from "../controllers/postController.js";
import {getFeedPosts} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoutes.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likedUnlikedPost);
router.put("/reply/:id", protectRoute, replyToPost);

export default router;
