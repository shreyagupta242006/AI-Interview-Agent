import { useEffect, useRef, useState } from "react";
import { generateQuestion } from "../../services/geminiService";

function Interview() {
  const candidate = JSON.parse(
    localStorage.getItem("selectedCandidate") || "null"
  );

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const [question, setQuestion] = useState(
    "Tell me about yourself."
  );

  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(1500);

  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);

  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

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
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
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

      setTranscript(text);
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
    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 0) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // -------------------------
  // FORMAT TIME
  // -------------------------

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // -------------------------
  // AI VOICE
  // -------------------------

  const speakQuestion = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

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
  // LOAD GEMINI QUESTION
  // -------------------------

  const loadQuestion = async () => {
    try {
      const generatedQuestion =
        await generateQuestion(candidate);

      if (generatedQuestion) {
        setQuestion(generatedQuestion);

        speakQuestion(generatedQuestion);
      }
    } catch (error) {
      console.error("Gemini error:", error);

      speakQuestion(
        "Tell me about yourself."
      );
    }
  };

  // -------------------------
  // START RECORDING
  // -------------------------

  const startRecording = () => {
    if (!recognitionRef.current) return;

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
  // START AI INTERVIEW
  // -------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      speakQuestion(
        "Good Morning " +
          (candidate?.member?.name || "Candidate") +
          ". Welcome to your AI Interview. Tell me about yourself."
      );
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      {/* ================= TOP BAR ================= */}

      <div className="h-[90px] border-b border-slate-800 flex items-center justify-between px-10">

        <div className="text-3xl font-bold">
          <span className="text-violet-500">
            ✦
          </span>{" "}
          AI Interview
        </div>

        <div className="border border-violet-600 rounded-full px-8 py-3 text-xl font-bold">
          Question {questionNumber} / 8
        </div>

        <div className="flex items-center gap-5">

          <div className="border border-slate-700 rounded-full px-7 py-3 text-xl font-bold">
            🕐 {formatTime()}
          </div>

          <button className="bg-red-600 hover:bg-red-700 px-7 py-4 rounded-xl font-bold">
            ☎ End Interview
          </button>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="p-7">

        {/* AI + CAMERA */}

        <div className="grid lg:grid-cols-2 gap-5">

          {/* ================= AI PANEL ================= */}

          <div className="relative h-[460px] rounded-3xl overflow-hidden border border-violet-700 bg-gradient-to-b from-[#11183c] to-[#070d20]">

            {/* Label */}

            <div className="absolute top-5 left-5 z-20 bg-[#20264c] px-5 py-4 rounded-2xl text-xl font-semibold">

              🤖 AI Interviewer

            </div>

            {/* AI */}

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

            {/* Voice Wave */}

            {aiSpeaking && (
              <div className="absolute bottom-7 left-0 right-0 flex justify-center gap-2">

                {[20, 35, 50, 30, 60, 40, 25, 55, 35, 45].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="w-2 bg-violet-500 rounded-full animate-pulse"
                      style={{
                        height: `${height}px`,
                      }}
                    />
                  )
                )}

              </div>
            )}

          </div>

          {/* ================= CAMERA ================= */}

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

              <span className="text-green-400">
                ●
              </span>

            </div>

          </div>

        </div>

        {/* ================= SPEAKING ================= */}

        <div className="mt-6 rounded-3xl border border-violet-700 bg-gradient-to-r from-[#0c1429] to-[#080f20] p-8">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-violet-700/30 flex items-center justify-center text-2xl">
              🔊
            </div>

            <h2 className="text-2xl font-bold text-violet-500">
              {aiSpeaking
                ? "AI Speaking..."
                : "AI Interviewer"}
            </h2>

          </div>

          <div className="ml-16 mt-5 space-y-4 text-2xl">

            <p>
              Good Morning{" "}
              {candidate?.member?.name ||
                "Candidate"}
              .
            </p>

            <p>
              Welcome to your AI Interview.
            </p>

            <p className="font-semibold">
              {question}
            </p>

          </div>

        </div>

        {/* ================= LISTENING ================= */}

        <div className="mt-6 rounded-3xl border border-emerald-700 bg-[#031b1b] p-7">

          <div className="flex items-center gap-6">

            <div className="w-24 h-24 rounded-full border-2 border-emerald-400 flex items-center justify-center text-5xl">
              🎤
            </div>

            <div>

              <h2 className="text-2xl font-bold text-emerald-400">
                {listening
                  ? "Listening..."
                  : "Ready"}
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

        {/* ================= MIC BUTTON ================= */}

        <div className="flex justify-center mt-6">

          {!listening ? (

            <button
              onClick={startRecording}
              className="px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-lg"
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