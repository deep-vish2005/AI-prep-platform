import { z } from "zod";

const mongoId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB identifier");

export const createInterviewSchema = z
  .object({
    targetRole: z
      .string()
      .trim()
      .min(2, "Target role is too short")
      .max(100, "Target role cannot exceed 100 characters"),

    experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),

    interviewType: z.enum(["Technical", "Behavioral", "Mixed"]),

    topics: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Topic cannot be empty")
          .max(50, "Topic name is too long"),
      )
      .min(1, "Select at least one topic")
      .max(10, "Select no more than 10 topics"),

    questionCount: z.union([
      z.literal(5),
      z.literal(10),
      z.literal(15),
      z.literal(20),
    ]),
  })
  .strict();

export const answerSchema = z
  .object({
    answer: z
      .string()
      .trim()
      .min(1, "Answer cannot be empty")
      .max(10000, "Answer cannot exceed 10,000 characters"),
  })
  .strict();

export const interviewIdParamsSchema = z.object({
  interviewId: mongoId,
});

export const interviewQuestionParamsSchema = z.object({
  interviewId: mongoId,
  questionId: mongoId,
});
