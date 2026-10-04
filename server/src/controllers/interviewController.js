import Interview from "../models/Interview.js";
import {
  evaluateInterviewAnswer,
  generateInterviewQuestions,
} from "../services/geminiService.js";

const allowedQuestionCounts = [5, 10, 15, 20];
const allowedExperienceLevels = ["Beginner", "Intermediate", "Advanced"];
const allowedInterviewTypes = ["Technical", "Behavioral", "Mixed"];

export async function createInterview(request, response, next) {
  try {
    const {
      targetRole,
      experienceLevel,
      interviewType,
      topics,
      questionCount,
    } = request.body;

    if (
      !targetRole?.trim() ||
      !experienceLevel ||
      !interviewType ||
      !Array.isArray(topics) ||
      topics.length === 0 ||
      !questionCount
    ) {
      return response.status(400).json({
        success: false,
        message: "Complete interview configuration is required",
      });
    }

    if (!allowedExperienceLevels.includes(experienceLevel)) {
      return response.status(400).json({
        success: false,
        message: "Invalid experience level",
      });
    }

    if (!allowedInterviewTypes.includes(interviewType)) {
      return response.status(400).json({
        success: false,
        message: "Invalid interview type",
      });
    }

    const numericQuestionCount = Number(questionCount);

    if (!allowedQuestionCounts.includes(numericQuestionCount)) {
      return response.status(400).json({
        success: false,
        message: "Question count must be 5, 10, 15, or 20",
      });
    }

    const generatedQuestions = await generateInterviewQuestions({
      targetRole: targetRole.trim(),
      experienceLevel,
      interviewType,
      topics,
      questionCount: numericQuestionCount,
    });

    const interview = await Interview.create({
      user: request.user._id,
      targetRole: targetRole.trim(),
      experienceLevel,
      interviewType,
      topics: topics.map((topic) => String(topic).trim()).filter(Boolean),
      questionCount: numericQuestionCount,
      questions: generatedQuestions,
    });

    return response.status(201).json({
      success: true,
      message: "Interview session created",
      interview,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getInterviews(request, response, next) {
  try {
    const interviews = await Interview.find({
      user: request.user._id,
    })
      .sort({ createdAt: -1 })
      .select("-questions.answer -questions.feedback")
      .lean();

    return response.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getInterview(request, response, next) {
  try {
    const interview = await Interview.findOne({
      _id: request.params.interviewId,
      user: request.user._id,
    }).lean();

    if (!interview) {
      return response.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return response.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return response.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return next(error);
  }
}

export async function submitInterviewAnswer(request, response, next) {
  try {
    const { answer } = request.body;

    if (!answer?.trim()) {
      return response.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const interview = await Interview.findOne({
      _id: request.params.interviewId,
      user: request.user._id,
    });

    if (!interview) {
      return response.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (interview.status !== "in_progress") {
      return response.status(400).json({
        success: false,
        message: "This interview is no longer in progress",
      });
    }

    const question = interview.questions.id(request.params.questionId);

    if (!question) {
      return response.status(404).json({
        success: false,
        message: "Interview question not found",
      });
    }

    const evaluation = await evaluateInterviewAnswer({
      targetRole: interview.targetRole,
      experienceLevel: interview.experienceLevel,
      topic: question.topic,
      question: question.question,
      answer: answer.trim(),
    });

    question.answer = answer.trim();
    question.score = evaluation.score;
    question.feedback = {
      strength: evaluation.strength,
      missing: evaluation.missing,
      suggestion: evaluation.suggestion,
    };

    const answeredQuestions = interview.questions.filter(
      (item) => item.answer && item.score !== null,
    );

    if (answeredQuestions.length === interview.questions.length) {
      const totalScore = answeredQuestions.reduce(
        (total, item) => total + item.score,
        0,
      );

      interview.overallScore = totalScore / answeredQuestions.length;

      interview.strengths = answeredQuestions
        .map((item) => item.feedback.strength)
        .filter(Boolean)
        .slice(0, 5);

      interview.weaknesses = answeredQuestions
        .map((item) => item.feedback.missing)
        .filter(Boolean)
        .slice(0, 5);

      interview.status = "completed";
      interview.completedAt = new Date();
    }

    await interview.save();

    return response.status(200).json({
      success: true,
      message: "Answer evaluated successfully",
      evaluation,
      interviewStatus: interview.status,
      overallScore: interview.overallScore,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return response.status(404).json({
        success: false,
        message: "Interview or question not found",
      });
    }

    return next(error);
  }
}
