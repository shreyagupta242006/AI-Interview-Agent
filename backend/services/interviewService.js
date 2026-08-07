const { askGemini } = require("./geminiService");

const processInterview = async (body) => {
  if (!body.sessionId) {
    return {
      reply: "Session ID missing",
      done: true,
    };
  }

  // First Question
  if (body.candidate) {
    const name = body.candidate.member.name;

    const prompt = `
You are an AI Technical Interviewer.

Candidate Name: ${name}

Ask ONLY ONE first technical interview question.
Keep it short.
Don't give explanation.
`;

    const question = await askGemini(prompt);

    return {
      reply: question,
      done: false,
    };
  }

  // Next Question
  const prompt = `
Candidate answered:

"${body.answer}"

Evaluate briefly.

Then ask ONE next technical interview question.
`;

  const question = await askGemini(prompt);

  return {
    reply: question,
    done: false,
  };
};

module.exports = {
  processInterview,
};