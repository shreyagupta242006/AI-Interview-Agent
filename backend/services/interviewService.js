const { askGemini } = require("./geminiService");

// ==================================================
// GENERATE INTERVIEW QUESTION
// ==================================================

const generateInterviewQuestion = async ({
  candidate,
  history = [],
  curriculumDays = [],
  questionNumber = 1,
  candidateAnswer = "",
  targetDay,
}) => {
  const candidateName =
    candidate?.member?.name ||
    candidate?.name ||
    "Candidate";

  const role =
    candidate?.role ||
    candidate?.member?.role ||
    "Software Developer";

  const skills =
    candidate?.skills ||
    candidate?.member?.skills ||
    [];

  const skillText = Array.isArray(skills)
    ? skills.join(", ")
    : String(skills);

  // Automatically select curriculum day.
  // Q1-2 = Day 1
  // Q3-4 = Day 2
  // Q5-6 = Day 3
  // Q7-8 = Day 4
  const selectedDay =
    targetDay ||
    Math.floor((questionNumber - 1) / 2) + 1;

  const dayData =
    curriculumDays.find(
      (day) => Number(day.day) === Number(selectedDay)
    ) || {};

  const topic =
    dayData.topic ||
    dayData.title ||
    `Technical Topic - Day ${selectedDay}`;

  const previousConversation = history
    .map((item, index) => {
      const q =
        item.question ||
        item.reply ||
        `Question ${index + 1}`;

      const a =
        item.answer ||
        item.candidateAnswer ||
        "";

      return `Question: ${q}\nCandidate Answer: ${a}`;
    })
    .join("\n\n");

  const prompt = `
You are an experienced AI Technical Interviewer.

Candidate Details:
Name: ${candidateName}
Role: ${role}
Skills: ${skillText}

INTERVIEW RULES:

1. Conduct a conversational technical interview.
2. Ask exactly ONE technical question.
3. There must be exactly 8 questions.
4. Cover at least 4 different curriculum days.
5. Current question number: ${questionNumber}
6. Current curriculum day: ${selectedDay}
7. Current curriculum topic: ${topic}
8. Questions must match the candidate's role and skills.
9. Use the candidate's previous answers to create meaningful follow-up questions.
10. Maintain the conversation context.
11. Do not repeat previous questions.
12. Do not ask generic unrelated questions.
13. Do not explain the answer.
14. Return ONLY ONE question.

Previous Conversation:
${previousConversation || "No previous conversation yet."}

Candidate's latest answer:
${candidateAnswer || "No answer yet."}

Now generate Question ${questionNumber}.
The question should be relevant to ${topic} and the candidate's ${role} role.
`;

  return await askGemini(prompt);
};

// ==================================================
// FINAL STRUCTURED FEEDBACK
// ==================================================

const generateFinalFeedback = async ({
  candidate,
  history = [],
  curriculumDays = [],
}) => {
  const candidateName =
    candidate?.member?.name ||
    candidate?.name ||
    "Candidate";

  const role =
    candidate?.role ||
    candidate?.member?.role ||
    "Software Developer";

  const conversation = history
    .map((item, index) => {
      const question =
        item.question ||
        item.reply ||
        `Question ${index + 1}`;

      const answer =
        item.answer ||
        item.candidateAnswer ||
        "";

      return `
Question ${index + 1}:
${question}

Candidate Answer:
${answer}
`;
    })
    .join("\n");

  const curriculumTopics = curriculumDays
    .slice(0, 4)
    .map(
      (day) =>
        `Day ${day.day}: ${day.topic || day.title || "Technical Topic"}`
    )
    .join("\n");

  const prompt = `
You are a senior technical interviewer.

Evaluate the completed technical interview.

Candidate:
Name: ${candidateName}
Role: ${role}

Curriculum covered:
${curriculumTopics}

Interview:
${conversation}

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "technicalAccuracy": 0,
  "summary": "",
  "strengths": [],
  "gaps": [],
  "curriculumPerformance": [],
  "recommendations": [],
  "next": [],
  "finalVerdict": ""
}

Rules:

- overallScore must be between 0 and 100.
- technicalAccuracy must be between 0 and 100.
- Evaluate the actual candidate answers.
- Mention strong technical areas.
- Mention incorrect or weak answers.
- Mention the curriculum topics tested.
- Give actionable recommendations.
- Give suggested next steps.
- finalVerdict must clearly describe the candidate's interview performance.
`;

  const result = await askGemini(prompt);

  try {
    const cleaned = String(result)
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Feedback JSON parse error:", error);

    return {
      overallScore: 0,
      technicalAccuracy: 0,
      summary: String(result),
      strengths: [],
      gaps: [],
      curriculumPerformance: [],
      recommendations: [],
      next: [],
      finalVerdict: "Feedback generated but could not be parsed.",
    };
  }
};

module.exports = {
  generateInterviewQuestion,
  generateFinalFeedback,
};