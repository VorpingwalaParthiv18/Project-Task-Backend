import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getRecentActivities,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMIddleware.js";

const router = express.Router();

router.get("/", protect, getTasks); // GET /tasks
router.post("/p", protect, createTask); // POST /tasks
router.put("/:id", protect, updateTask); // PUT /tasks/:id
// router.get("/:id", protect, updateTask); // PUT /tasks/:id
router.delete("/:id", protect, deleteTask); // DELETE /tasks/:id
router.get("/getUser", protect, getRecentActivities);

export default router;
