import express from "express";
import {deleteReply} from "../controllers/replyController.js";
import protectRoute from "../middlewares/protectRoutes.js";

const router = express.Router();

router.delete("/reply/:id", protectRoute, deleteReply);

export default router;
