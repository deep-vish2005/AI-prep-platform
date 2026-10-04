import express from "express";
import {
  createInterview,
  getInterview,
  getInterviews,
  skipInterviewQuestion,
  submitInterviewAnswer,
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateBody, validateParams } from "../middleware/validateRequest.js";
import {
  answerSchema,
  createInterviewSchema,
  interviewIdParamsSchema,
  interviewQuestionParamsSchema,
} from "../validation/interviewSchemas.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(validateBody(createInterviewSchema), createInterview)
  .get(getInterviews);

router.post(
  "/:interviewId/questions/:questionId/answer",
  validateParams(interviewQuestionParamsSchema),
  validateBody(answerSchema),
  submitInterviewAnswer,
);

router.post(
  "/:interviewId/questions/:questionId/skip",
  validateParams(interviewQuestionParamsSchema),
  skipInterviewQuestion,
);

router.get(
  "/:interviewId",
  validateParams(interviewIdParamsSchema),
  getInterview,
);

export default router;
