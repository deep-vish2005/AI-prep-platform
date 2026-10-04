import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    answer: {
      type: String,
      default: "",
    },

    skipped: {
  type: Boolean,
  default: false,
},

    score: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },

    feedback: {
      strength: {
        type: String,
        default: "",
      },
      missing: {
        type: String,
        default: "",
      },
      suggestion: {
        type: String,
        default: "",
      },
    },
  },
  {
    _id: true,
  },
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    interviewType: {
      type: String,
      enum: ["Technical", "Behavioral", "Mixed"],
      required: true,
    },

    topics: {
      type: [String],
      required: true,
      validate: {
        validator(topics) {
          return topics.length > 0;
        },
        message: "At least one topic is required",
      },
    },

    questionCount: {
      type: Number,
      enum: [5, 10, 15, 20],
      required: true,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
      index: true,
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

interviewSchema.index({
  user: 1,
  createdAt: -1,
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
