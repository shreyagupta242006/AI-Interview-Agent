const {
  generateInterviewResponse,
} = require("../services/geminiService");

const handleInterview = async (req, res) => {
  try {
    const {
      history = [],
      curriculumDays = [],
      questionNumber = 1,
      candidateAnswer = "",
      mode = "question",
    } = req.body;

    const result = await generateInterviewResponse({
      history,
      curriculumDays,
      questionNumber,
      candidateAnswer,
      mode,
    });

    if (mode === "feedback") {
      let feedback;

      try {
        feedback = JSON.parse(result);
      } catch (error) {
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

    return res.json({
      success: true,
      question: result,
    });
  } catch (error) {
    console.error("Interview generation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  handleInterview,
};