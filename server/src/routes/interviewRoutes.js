import express from "express";
import {
  createInterview,
  getInterview,
  getInterviews,
  skipInterviewQuestion,
  submitInterviewAnswer,
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createInterview).get(getInterviews);

router.post("/:interviewId/questions/:questionId/skip", skipInterviewQuestion);

router.post(
  "/:interviewId/questions/:questionId/answer",
  submitInterviewAnswer,
);

router.get("/:interviewId", getInterview);

export default router;
