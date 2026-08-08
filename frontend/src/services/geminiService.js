import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const generateQuestion = async (candidate) => {
  try {

    const prompt = `
You are an experienced technical interviewer.

Candidate Details:
Name: ${candidate?.member?.name}
Role: ${candidate?.member?.jobRole}

Generate ONE interview question.

Rules:
- Question must match the candidate role.
- Medium difficulty.
- Ask only ONE question.
- Return only the question.
`;

    const result = await model.generateContent(prompt);

    return result.response.text();

  } catch (err) {

    console.log(err);

    return "Tell me about yourself.";

  }
};