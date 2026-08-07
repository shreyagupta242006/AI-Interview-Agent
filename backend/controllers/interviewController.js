const interviewService = require("../services/interviewService");

const handleInterview = async (req, res) => {
  try {
    const result = await interviewService.processInterview(req.body);

    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      reply: "Internal Server Error",
      done: true,
    });
  }
};

module.exports = {
  handleInterview,
};