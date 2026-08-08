import axios from "axios";

const API_URL =
  "https://ai-interview-backend-rb9p.onrender.com/api/interview";

// =========================
// GENERATE NEXT QUESTION
// =========================

export const generateQuestion = async ({
  candidate,
  history = [],
  curriculumDays = [],
  questionNumber = 1,
  candidateAnswer = "",
  targetDay = 1,
}) => {
  try {
    const response = await axios.post(API_URL, {
      candidate,
      history,
      curriculumDays,
      questionNumber,
      candidateAnswer,
      targetDay,
      mode: "question",
    });

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to generate question"
      );
    }

    return response.data.question;
  } catch (error) {
    console.error("Generate question error:", error);
    throw error;
  }
};

// =========================
// GENERATE FINAL FEEDBACK
// =========================

export const generateFeedback = async ({
  candidate,
  history = [],
  curriculumDays = [],
}) => {
  try {
    const response = await axios.post(API_URL, {
      candidate,
      history,
      curriculumDays,
      questionNumber: 8,
      candidateAnswer: "",
      targetDay: 4,
      mode: "feedback",
    });

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to generate feedback"
      );
    }

    return response.data.feedback;
  } catch (error) {
    console.error("Generate feedback error:", error);
    throw error;
  }
};