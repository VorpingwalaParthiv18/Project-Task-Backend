import express from "express";
import {
  getActivities,
  createActivity,
  clearActivities,
  deleteActivity,
} from "../controllers/activityController.js";
import { protect } from "../middleware/authMIddleware.js";

const router = express.Router();

// router.use(protect);

// router.route("/").get(getActivities).post(createActivity);

// router.delete("/clear", clearActivities);
// router.delete("/:id", deleteActivity);

router.get("/getUser", protect, getActivities); // GET /activities
router.post("/CreateUser", protect, createActivity);
router.delete("/clear", protect, clearActivities); // DELETE /activities/clear
router.delete("/:id", protect, deleteActivity); // DELETE /activities/:id

export default router;
