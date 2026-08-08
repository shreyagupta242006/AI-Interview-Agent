import { useEffect, useRef, useState } from "react";
import {
  generateQuestion,
  generateFeedback as generateFeedbackService,
} from "../../services/geminiService";

function Interview() {
  const candidate = JSON.parse(
    localStorage.getItem("selectedCandidate") || "null"
  );

  // 8 questions = 2 questions from each of the first 4 curriculum days.
  // Gemini still chooses the exact technical question and follow-up.
  const CURRICULUM_DAYS = [
    { day: 1, topic: "Technical Fundamentals" },
    { day: 2, topic: "Programming and Problem Solving" },
    { day: 3, topic: "JavaScript and Web Development" },
    { day: 4, topic: "React and Frontend Development" },
    { day: 5, topic: "Node.js and Backend Development" },
    { day: 6, topic: "APIs and Databases" },
  ];

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);

  const candidateProfile = {
    name: candidate?.member?.name || "Candidate",
    jobRole:
      candidate?.member?.jobRole ||
      candidate?.member?.role ||
      candidate?.jobRole ||
      "Software Developer",
    skills:
      candidate?.member?.skills ||
      candidate?.member?.skillsRequired ||
      candidate?.skills ||
      [],
  };

  const getTargetDay = (number) => Math.min(4, Math.ceil(number / 2));

  // -------------------------
  // GENERATE NEXT QUESTION
  // -------------------------

  const generateNextQuestion = async (
    answer = "",
    currentHistory = [],
    number = 1
  ) => {
    try {
      setLoadingQuestion(true);

      const targetDay = getTargetDay(number);

      const result = await generateQuestion({
        candidate: candidateProfile,
        history: currentHistory,
        curriculumDays: CURRICULUM_DAYS,
        questionNumber: number,
        candidateAnswer: answer,
        targetDay,
        mode: "question",
      });

      const cleanQuestion = String(result || "")
        .replace(/^["']|["']$/g, "")
        .trim();

      if (!cleanQuestion) {
        throw new Error("Gemini returned an empty question.");
      }

      setQuestion(cleanQuestion);
      return cleanQuestion;
    } catch (error) {
      console.error("Question generation error:", error);
      throw error;
    } finally {
      setLoadingQuestion(false);
    }
  };

  // -------------------------
  // CAMERA + MIC
  // -------------------------

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setCameraReady(true);
        setMicReady(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera/Mic error:", error);
        alert("Please allow Camera and Microphone access.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // -------------------------
  // FIRST TECHNICAL QUESTION
  // -------------------------

  useEffect(() => {
    if (!candidate) return;

    const startInterview = async () => {
      try {
        const firstQuestion = await generateNextQuestion(
          "",
          [],
          1
        );

        speakQuestion(firstQuestion);
      } catch (error) {
        console.error("Initial question error:", error);

        const fallback =
          "Explain one technical concept you are most confident about and describe a practical example where you used it.";

        setQuestion(fallback);
        speakQuestion(fallback);
      }
    };

    startInterview();
  }, []);

  // -------------------------
  // SPEECH RECOGNITION
  // -------------------------

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let text = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        text += event.results[i][0].transcript;
      }

      setTranscript((previous) =>
        event.resultIndex === 0
          ? text
          : `${previous} ${text}`
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.log("Recognition error:", event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (error) {}

      window.speechSynthesis.cancel();
    };
  }, []);

  // -------------------------
  // TIMER
  // -------------------------

  useEffect(() => {
    if (interviewFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);

          if (!interviewFinished && history.length > 0) {
            generateFeedback(history);
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewFinished, history]);

  // -------------------------
  // FORMAT TIME
  // -------------------------

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // -------------------------
  // AI VOICE
  // -------------------------

  const speakQuestion = (text) => {
    if (!text || interviewFinished) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 0.95;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setAiSpeaking(true);
    };

    speech.onend = () => {
      setAiSpeaking(false);

      setTimeout(() => {
        startRecording();
      }, 500);
    };

    speech.onerror = () => {
      setAiSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  // -------------------------
  // START RECORDING
  // -------------------------

  const startRecording = () => {
    if (interviewFinished || !recognitionRef.current) return;

    setTranscript("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log("Already recording");
    }
  };

  // -------------------------
  // STOP RECORDING
  // -------------------------

  const stopRecording = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch (error) {}

    setListening(false);
  };

  // -------------------------
  // SUBMIT ANSWER + NEXT QUESTION
  // -------------------------

  const submitAnswer = async () => {
    if (!transcript.trim()) {
      alert("Please answer the question first.");
      return;
    }

    if (loadingQuestion || interviewFinished) return;

    stopRecording();

    const currentAnswer = transcript.trim();

    const newAnswer = {
      question,
      answer: currentAnswer,
      day: getTargetDay(questionNumber),
    };

    const updatedHistory = [...history, newAnswer];

    setHistory(updatedHistory);

    // Exactly 8 questions.
    if (questionNumber >= 8) {
      await generateFeedback(updatedHistory);
      return;
    }

    const nextQuestionNumber = questionNumber + 1;

    setQuestionNumber(nextQuestionNumber);
    setTranscript("");

    try {
      const nextQuestion = await generateNextQuestion(
        currentAnswer,
        updatedHistory,
        nextQuestionNumber
      );

      speakQuestion(nextQuestion);
    } catch (error) {
      alert("Unable to generate the next question. Please try again.");
    }
  };

  // -------------------------
  // FINAL STRUCTURED FEEDBACK
  // -------------------------

  const generateFeedback = async (finalHistory) => {
    if (interviewFinished) return;

    try {
      setLoadingQuestion(true);
      stopRecording();
      window.speechSynthesis.cancel();

      const result = await generateFeedbackService({
        candidate: candidateProfile,
        history: finalHistory,
        curriculumDays: CURRICULUM_DAYS,
      });

      let parsedFeedback;

      try {
        parsedFeedback =
          typeof result === "string"
            ? JSON.parse(
                result
                  .replace(/```json/g, "")
                  .replace(/```/g, "")
                  .trim()
              )
            : result;
      } catch (error) {
        console.error("Feedback JSON parse error:", error);

        parsedFeedback = {
          overallScore: 0,
          technicalAccuracy: 0,
          summary: String(result || "Feedback could not be parsed."),
          strengths: [],
          weaknesses: [],
          curriculumPerformance: [],
          recommendations: [],
          finalVerdict: "",
        };
      }

      // Keep a safe fallback if the AI does not return technicalAccuracy.
      parsedFeedback = {
        overallScore: parsedFeedback?.overallScore ?? 0,
        technicalAccuracy:
          parsedFeedback?.technicalAccuracy ??
          parsedFeedback?.overallScore ??
          0,
        summary: parsedFeedback?.summary ?? "",
        strengths: parsedFeedback?.strengths ?? [],
        weaknesses: parsedFeedback?.weaknesses ?? [],
        curriculumPerformance:
          parsedFeedback?.curriculumPerformance ?? [],
        recommendations: parsedFeedback?.recommendations ?? [],
        finalVerdict: parsedFeedback?.finalVerdict ?? "",
      };

      setFeedback(parsedFeedback);
      setInterviewFinished(true);
    } catch (error) {
      console.error("Feedback error:", error);
      alert("Unable to generate final feedback.");
    } finally {
      setLoadingQuestion(false);
    }
  };

  // -------------------------
  // END INTERVIEW
  // -------------------------

  const endInterview = async () => {
    if (history.length === 0) {
      alert("Please answer at least one question before ending.");
      return;
    }

    const shouldEnd = window.confirm(
      "End the interview and generate your feedback?"
    );

    if (!shouldEnd) return;

    await generateFeedback(history);
  };

  // -------------------------
  // FEEDBACK SCREEN
  // -------------------------

  if (interviewFinished && feedback) {
    return (
      <div className="min-h-screen bg-[#020617] text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-5xl font-bold text-violet-400">
              AI Interview Report
            </div>

            <p className="text-gray-400 mt-3 text-lg">
              Technical interview completed for{" "}
              {candidateProfile.name}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            <div className="rounded-3xl border border-violet-700 bg-[#0e1528] p-7 text-center">
              <p className="text-gray-400">Overall Score</p>
              <p className="text-5xl font-bold text-violet-400 mt-3">
                {feedback.overallScore ?? 0}
              </p>
                <p className="text-gray-400 mt-2">/ 100</p>
            </div>

            <div className="rounded-3xl border border-emerald-700 bg-[#031b1b] p-7 text-center">
              <p className="text-gray-400">Questions</p>
              <p className="text-5xl font-bold text-emerald-400 mt-3">
                {history.length}
              </p>
              <p className="text-gray-400 mt-2">completed</p>
            </div>

            <div className="rounded-3xl border border-cyan-700 bg-[#071827] p-7 text-center">
              <p className="text-gray-400">Curriculum Days</p>
              <p className="text-5xl font-bold text-cyan-400 mt-3">
                {new Set(history.map((item) => item.day)).size}
              </p>
              <p className="text-gray-400 mt-2">covered</p>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-700 bg-[#071827] p-7 text-center mb-8">
            <p className="text-gray-400">🎯 Technical Accuracy</p>
            <p className="text-5xl font-bold text-cyan-400 mt-3">
              {feedback.technicalAccuracy ?? feedback.overallScore ?? 0}%
            </p>
            <p className="text-gray-400 mt-2">Answer accuracy</p>
          </div>

          <div className="rounded-3xl border border-violet-700 bg-[#0e1528] p-8 mb-6">
            <h2 className="text-2xl font-bold text-violet-400">
              Summary
            </h2>
            <p className="text-gray-300 text-lg mt-4 leading-8">
              {feedback.summary}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-3xl border border-emerald-700 bg-[#031b1b] p-8">
              <h2 className="text-2xl font-bold text-emerald-400">
                Strengths
              </h2>

              <ul className="mt-5 space-y-3 text-gray-300">
                {(feedback.strengths || []).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-red-700 bg-[#1b0808] p-8">
              <h2 className="text-2xl font-bold text-red-400">
                Weaknesses
              </h2>

              <ul className="mt-5 space-y-3 text-gray-300">
                {(feedback.weaknesses || []).map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-[#0e1528] p-8 mb-6">
            <h2 className="text-2xl font-bold text-cyan-400">
              Curriculum Performance
            </h2>

            <div className="mt-6 space-y-4">
              {(feedback.curriculumPerformance || []).map(
                (item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-700 p-5"
                  >
                    <div className="flex justify-between gap-5">
                      <div>
                        <p className="font-bold">
                          Day {item.day}: {item.topic}
                        </p>
                        <p className="text-gray-400 mt-2">
                          {item.feedback}
                        </p>
                      </div>

                      <div className="text-2xl font-bold text-violet-400">
                        {item.score ?? 0}/100
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-violet-700 bg-[#0e1528] p-8 mb-6">
            <h2 className="text-2xl font-bold text-violet-400">
              Recommendations
            </h2>

            <ul className="mt-5 space-y-3 text-gray-300">
              {(feedback.recommendations || []).map(
                (item, index) => (
                  <li key={index}>• {item}</li>
                )
              )}
            </ul>
          </div>

          <div className="rounded-3xl border border-emerald-700 bg-[#031b1b] p-8">
            <h2 className="text-2xl font-bold text-emerald-400">
              Final Verdict
            </h2>

            <p className="text-gray-300 text-lg mt-4">
              {feedback.finalVerdict}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // INTERVIEW UI
  // -------------------------

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* TOP BAR */}
      <div className="h-[90px] border-b border-slate-800 flex items-center justify-between px-10">
        <div className="text-3xl font-bold">
          <span className="text-violet-500">✦</span> AI Interview
        </div>

        <div className="border border-violet-600 rounded-full px-8 py-3 text-xl font-bold">
          Question {questionNumber} / 8
        </div>

        <div className="flex items-center gap-5">
          <div className="border border-slate-700 rounded-full px-7 py-3 text-xl font-bold">
            🕐 {formatTime()}
          </div>

          <button
            onClick={endInterview}
            className="bg-red-600 hover:bg-red-700 px-7 py-4 rounded-xl font-bold"
          >
            ☎ End Interview
          </button>
        </div>
      </div>

      <div className="p-7">
        {/* AI + CAMERA */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* AI PANEL */}
          <div className="relative h-[460px] rounded-3xl overflow-hidden border border-violet-700 bg-gradient-to-b from-[#11183c] to-[#070d20]">
            <div className="absolute top-5 left-5 z-20 bg-[#20264c] px-5 py-4 rounded-2xl text-xl font-semibold">
              🤖 AI Interviewer
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-[270px] h-[270px] rounded-full flex items-center justify-center text-[130px] transition-all ${
                  aiSpeaking
                    ? "bg-cyan-400/20 animate-pulse"
                    : "bg-violet-500/10"
                }`}
              >
                🤖
              </div>
            </div>

            {aiSpeaking && (
              <div className="absolute bottom-7 left-0 right-0 flex justify-center gap-2">
                {[20, 35, 50, 30, 60, 40, 25, 55, 35, 45].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="w-2 bg-violet-500 rounded-full animate-pulse"
                      style={{ height: `${height}px` }}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* CAMERA */}
          <div className="relative h-[460px] rounded-3xl overflow-hidden border border-slate-700 bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            <div className="absolute top-5 left-5 bg-black/60 px-5 py-4 rounded-2xl text-xl">
              📹 Your Camera{" "}
              <span
                className={
                  cameraReady ? "text-green-400" : "text-red-400"
                }
              >
                ●
              </span>
            </div>
          </div>
        </div>

        {/* CANDIDATE INFO */}
        <div className="mt-5 rounded-2xl border border-slate-700 bg-[#0e1528] px-6 py-4">
          <div className="flex flex-wrap gap-6 text-gray-300">
            <span>
              Candidate:{" "}
              <strong className="text-white">
                {candidateProfile.name}
              </strong>
            </span>

            <span>
              Role:{" "}
              <strong className="text-white">
                {candidateProfile.jobRole}
              </strong>
            </span>

            <span>
              Camera:{" "}
              <strong
                className={
                  cameraReady ? "text-green-400" : "text-red-400"
                }
              >
                {cameraReady ? "Ready" : "Not Ready"}
              </strong>
            </span>

            <span>
              Mic:{" "}
              <strong
                className={
                  micReady ? "text-green-400" : "text-red-400"
                }
              >
                {micReady ? "Ready" : "Not Ready"}
              </strong>
            </span>
          </div>
        </div>

        {/* SPEAKING */}
        <div className="mt-6 rounded-3xl border border-violet-700 bg-gradient-to-r from-[#0c1429] to-[#080f20] p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-violet-700/30 flex items-center justify-center text-2xl">
              🔊
            </div>

            <h2 className="text-2xl font-bold text-violet-500">
              {aiSpeaking ? "AI Speaking..." : "AI Interviewer"}
            </h2>
          </div>

          <div className="ml-16 mt-5 space-y-4 text-2xl">
            <p>
              Good Morning{" "}
              {candidateProfile.name}.
            </p>

            <p>Welcome to your AI Interview.</p>

            <p className="font-semibold">
              {loadingQuestion && !question
                ? "Preparing your technical question..."
                : question}
            </p>
          </div>
        </div>

        {/* LISTENING */}
        <div className="mt-6 rounded-3xl border border-emerald-700 bg-[#031b1b] p-7">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-2 border-emerald-400 flex items-center justify-center text-5xl">
              🎤
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-400">
                {listening ? "Listening..." : "Ready"}
              </h2>

              <p className="text-xl text-gray-300 mt-2">
                {listening
                  ? "Speak clearly. We are listening."
                  : "Waiting for your answer."}
              </p>
            </div>
          </div>

          {transcript && (
            <div className="mt-5 ml-28 text-gray-300 text-lg">
              {transcript}
            </div>
          )}
        </div>

        {/* NEXT QUESTION */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={submitAnswer}
            disabled={loadingQuestion || !transcript.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-2xl text-xl font-semibold text-white"
          >
            {loadingQuestion
              ? "Generating..."
              : questionNumber === 8
              ? "Finish Interview →"
              : "Next Question →"}
          </button>
        </div>

        {/* MIC BUTTON */}
        <div className="flex justify-center mt-6">
          {!listening ? (
            <button
              onClick={startRecording}
              disabled={loadingQuestion}
              className="px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold text-lg"
            >
              🎤 Start Answer
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-10 py-4 rounded-2xl bg-red-500 hover:bg-red-600 font-bold text-lg"
            >
              ⏹ Stop Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interview;
