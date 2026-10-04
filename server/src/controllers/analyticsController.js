import Interview from "../models/Interview.js";

function round(value, decimals = 1) {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

function createMonthlyActivity(interviews) {
  const months = [];
  const now = new Date();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);

    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      interviews: 0,
    });
  }

  interviews.forEach((interview) => {
    const date = new Date(interview.completedAt || interview.createdAt);

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const month = months.find((item) => item.key === key);

    if (month) {
      month.interviews += 1;
    }
  });

  return months.map(({ key, ...month }) => month);
}

export async function getAnalytics(request, response, next) {
  try {
    const interviews = await Interview.find({
      user: request.user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const completed = interviews.filter(
      (interview) => interview.status === "completed",
    );

    const totalScore = completed.reduce(
      (total, interview) => total + Number(interview.overallScore || 0),
      0,
    );

    const averageScore = completed.length ? totalScore / completed.length : 0;

    const bestScore = completed.length
      ? Math.max(
          ...completed.map((interview) => Number(interview.overallScore || 0)),
        )
      : 0;

    const completionRate = interviews.length
      ? (completed.length / interviews.length) * 100
      : 0;

    const scoreProgression = [...completed]
      .reverse()
      .slice(-12)
      .map((interview, index) => ({
        session: index + 1,
        label: new Date(
          interview.completedAt || interview.createdAt,
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        score: round(Number(interview.overallScore || 0)),
        role: interview.targetRole,
      }));

    const formatMap = new Map();

    completed.forEach((interview) => {
      formatMap.set(
        interview.interviewType,
        (formatMap.get(interview.interviewType) || 0) + 1,
      );
    });

    const formatColors = {
      Technical: "#2563eb",
      Mixed: "#7c3aed",
      Behavioral: "#16a34a",
    };

    const formatDistribution = Array.from(formatMap.entries()).map(
      ([name, count]) => ({
        name,
        count,
        value: completed.length ? round((count / completed.length) * 100) : 0,
        color: formatColors[name] || "#64748b",
      }),
    );

    const topicMap = new Map();

    completed.forEach((interview) => {
      interview.questions.forEach((question) => {
        if (question.score === null || question.score === undefined) {
          return;
        }

        const existing = topicMap.get(question.topic) || {
          total: 0,
          count: 0,
        };

        existing.total += Number(question.score);
        existing.count += 1;

        topicMap.set(question.topic, existing);
      });
    });

    const topicPerformance = Array.from(topicMap.entries())
      .map(([name, data]) => ({
        name,
        averageScore: round(data.total / data.count),
        percentage: Math.round((data.total / data.count) * 10),
        questionsEvaluated: data.count,
      }))
      .sort((first, second) => {
        return second.averageScore - first.averageScore;
      });

    const strongestTopics = topicPerformance.slice(0, 4);

    const focusAreas = [...topicPerformance]
      .reverse()
      .slice(0, 4)
      .map((topic) => ({
        ...topic,
        priority:
          topic.percentage < 60
            ? "High"
            : topic.percentage < 75
              ? "Medium"
              : "Low",
      }));

    const recentInterviews = interviews.slice(0, 5).map((interview) => ({
      id: interview._id,
      role: interview.targetRole,
      format: interview.interviewType,
      status: interview.status,
      score: interview.overallScore,
      questionCount: interview.questionCount,
      createdAt: interview.createdAt,
    }));

    return response.status(200).json({
      success: true,

      summary: {
        totalInterviews: interviews.length,
        completedInterviews: completed.length,
        averageScore: round(averageScore),
        bestScore: round(bestScore),
        completionRate: round(completionRate),
      },

      scoreProgression,
      formatDistribution,
      topicPerformance,
      strongestTopics,
      focusAreas,
      monthlyActivity: createMonthlyActivity(completed),
      recentInterviews,
    });
  } catch (error) {
    return next(error);
  }
}
