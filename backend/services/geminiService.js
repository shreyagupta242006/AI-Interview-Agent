const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.6-flash";

async function generateInterviewResponse({
  history = [],
  curriculumDays = [],
  questionNumber = 1,
  candidateAnswer = "",
  mode = "question",
}) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const curriculumText = curriculumDays
    .map(
      (day) =>
        `Day ${day.day}: ${day.topic || day.title || "Technical Topic"}`
    )
    .join("\n");

  let prompt;

  if (mode === "question") {
    const currentDay =
      curriculumDays[
        Math.min(Math.floor((questionNumber - 1) / 2), curriculumDays.length - 1)
      ];

    prompt = `
You are an expert AI technical interviewer.

Conduct a conversational technical interview.

MANDATORY REQUIREMENTS:
- Total interview length: exactly 8 questions.
- Cover at least 4 different curriculum days.
- Ask only ONE question.
- Never repeat a previous question.
- Questions must be technical.
- Use the candidate's previous answers as context.
- If the latest answer is weak or incomplete, ask a relevant follow-up.
- If the latest answer is strong, move to the next curriculum topic.
- Keep questions concise.
- Do not give explanations before the question.
- Return ONLY the question.

CURRENT QUESTION:
${questionNumber} of 8

CURRENT CURRICULUM DAY:
Day ${currentDay?.day || "N/A"} - ${currentDay?.topic || currentDay?.title || "Technical Topic"}

CURRICULUM:
${curriculumText}

PREVIOUS INTERVIEW:
${
  history.length
    ? history
        .map(
          (item, index) =>
            `Question ${index + 1}: ${item.question}
Candidate Answer: ${item.answer}`
        )
        .join("\n\n")
    : "This is the beginning of the interview."
}

LATEST ANSWER:
${candidateAnswer || "No previous answer. Start the interview."}

Generate the next question now.
`;
  } else {
    prompt = `
You are an expert technical interviewer.

Evaluate the complete technical interview.

Return ONLY valid JSON using exactly this structure:

{
  "overallScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "curriculumPerformance": [
    {
      "day": "",
      "topic": "",
      "score": 0,
      "feedback": ""
    }
  ],
  "recommendations": [],
  "finalVerdict": ""
}

Scoring:
- overallScore must be from 0 to 100.
- curriculum scores must be from 0 to 100.
- Evaluate technical correctness, depth, problem solving and communication.
- Mention performance across the curriculum days.

COMPLETE INTERVIEW:

${history
  .map(
    (item, index) =>
      `Question ${index + 1}: ${item.question}
Candidate Answer: ${item.answer}`
  )
  .join("\n\n")}
`;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${errorText}`);
  }

  const data = await response.json();

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

module.exports = {
  generateInterviewResponse,
};