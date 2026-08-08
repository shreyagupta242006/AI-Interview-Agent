const {
  generateInterviewResponse,
} = require("../services/geminiService");

const handleInterview = async (req, res) => {
  try {
    const {
      candidate = {},
      history = [],
      curriculumDays = [],
      questionNumber = 1,
      candidateAnswer = "",
      targetDay = 1,
      mode = "question",
    } = req.body;

    console.log("Interview Request:", {
      questionNumber,
      targetDay,
      mode,
    });

    const result = await generateInterviewResponse({
      candidate,
      history,
      curriculumDays,
      questionNumber,
      candidateAnswer,
      targetDay,
      mode,
    });

    // =========================
    // FINAL FEEDBACK
    // =========================

    if (mode === "feedback") {
      let feedback;

      try {
        feedback = JSON.parse(
          result
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()
        );
      } catch (error) {
        console.error(
          "Feedback JSON parsing error:",
          error
        );

        feedback = {
          overallScore: 0,
          summary: result,
          strengths: [],
          weaknesses: [],
          curriculumPerformance: [],
          recommendations: [],
          finalVerdict: "",
        };
      }

      return res.json({
        success: true,
        feedback,
      });
    }

    // =========================
    // NEXT QUESTION
    // =========================

    return res.json({
      success: true,
      question: result,
    });
  } catch (error) {
    console.error(
      "Interview generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  handleInterview,
};