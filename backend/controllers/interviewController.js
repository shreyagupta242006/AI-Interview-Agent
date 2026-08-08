const {
  generateInterviewQuestion,
  generateFinalFeedback,
} = require("../services/interviewService");

const handleInterview = async (req, res) => {
  try {
    const {
      candidate,
      history = [],
      curriculumDays = [],
      questionNumber = 1,
      candidateAnswer = "",
      targetDay,
      mode = "question",
    } = req.body;

    // ============================================
    // FINAL FEEDBACK
    // ============================================

    if (mode === "feedback") {
      const feedback = await generateFinalFeedback({
        candidate,
        history,
        curriculumDays,
      });

      return res.json({
        success: true,
        question: feedback,
        feedback,
        done: true,
      });
    }

    // ============================================
    // STOP AFTER 8 QUESTIONS
    // ============================================

    if (Number(questionNumber) > 8) {
      const feedback = await generateFinalFeedback({
        candidate,
        history,
        curriculumDays,
      });

      return res.json({
        success: true,
        question: feedback,
        feedback,
        done: true,
      });
    }

    // ============================================
    // CURRICULUM DAY
    // ============================================

    const currentDay =
      targetDay ||
      Math.floor((Number(questionNumber) - 1) / 2) + 1;

    // ============================================
    // GENERATE QUESTION
    // ============================================

    const question = await generateInterviewQuestion({
      candidate,
      history,
      curriculumDays,
      questionNumber: Number(questionNumber),
      candidateAnswer,
      targetDay: currentDay,
    });

    return res.json({
      success: true,
      question,
      reply: question,
      done: false,
      questionNumber: Number(questionNumber),
      curriculumDay: currentDay,
    });
  } catch (error) {
    console.error("Interview generation error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to generate interview question",
    });
  }
};

module.exports = {
  handleInterview,
};