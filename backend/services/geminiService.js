require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.6-flash";

async function generateInterviewResponse({
  candidate = {},
  history = [],
  curriculumDays = [],
  questionNumber = 1,
  candidateAnswer = "",
  targetDay = 1,
  mode = "question",
}) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  // Candidate information
  const candidateText = `
Name: ${candidate?.member?.name || candidate?.name || "Candidate"}
Role: ${candidate?.member?.jobRole || candidate?.jobRole || "Software Developer"}
Skills: ${
    Array.isArray(candidate?.member?.skills)
      ? candidate.member.skills.join(", ")
      : Array.isArray(candidate?.skills)
      ? candidate.skills.join(", ")
      : candidate?.member?.skills || candidate?.skills || "Not specified"
  }
`;

  // Curriculum
  const curriculumText = curriculumDays
    .map(
      (day) =>
        `Day ${day.day}: ${day.topic || day.title || "Technical Topic"}`
    )
    .join("\n");

  // Previous conversation
  const historyText =
    history.length > 0
      ? history
          .map(
            (item, index) =>
              `Question ${index + 1} [Day ${item.day || "unknown"}]:
${item.question}

Candidate Answer:
${item.answer}`
          )
          .join("\n\n")
      : "No previous interview conversation.";

  let prompt = "";

  // =========================
  // QUESTION MODE
  // =========================

  if (mode === "question") {
    prompt = `
You are an expert AI technical interviewer.

CANDIDATE PROFILE:
${candidateText}

CURRICULUM:
${curriculumText}

INTERVIEW REQUIREMENTS:

1. The interview must contain exactly 8 questions.
2. Questions must cover at least 4 different curriculum days.
3. Questions 1-2 should focus on Day 1.
4. Questions 3-4 should focus on Day 2.
5. Questions 5-6 should focus on Day 3.
6. Questions 7-8 should focus on Day 4.
7. Questions must match the candidate's role and skills.
8. Use previous answers to generate meaningful follow-up questions.
9. If an answer is weak or incomplete, ask a deeper follow-up.
10. If an answer is strong, move to another technical concept.
11. Never repeat a previous question.
12. Maintain the complete interview context.
13. Ask technical questions only.
14. Do not ask generic HR questions.
15. Ask ONLY ONE question.
16. Return ONLY the question text.
17. Do not include numbering.
18. Do not include explanations.

CURRENT QUESTION NUMBER:
${questionNumber}

TARGET CURRICULUM DAY:
${targetDay}

PREVIOUS INTERVIEW:
${historyText}

LATEST CANDIDATE ANSWER:
${candidateAnswer || "No answer yet."}

Generate the next technical interview question.
`;
  }

  // =========================
  // FEEDBACK MODE
  // =========================

  if (mode === "feedback") {
    prompt = `
You are an expert technical interviewer.

CANDIDATE PROFILE:
${candidateText}

CURRICULUM:
${curriculumText}

Analyze the complete technical interview.

Evaluate:

- Technical correctness
- Problem solving
- Understanding of concepts
- Depth of knowledge
- Communication
- Performance across curriculum days
- Strengths
- Weaknesses
- Areas for improvement

The interview contains 8 questions and should cover at least 4 curriculum days.

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use code fences.
Do NOT write anything outside JSON.

Return exactly this structure:

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

COMPLETE INTERVIEW:

${historyText}
`;
  }

  // =========================
  // GEMINI API
  // =========================

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
            parts: [
              {
                text: prompt,
              },
            ],
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

  return text.trim();
}

module.exports = {
  generateInterviewResponse,
};