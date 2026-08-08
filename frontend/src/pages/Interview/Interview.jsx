import { useEffect, useRef, useState } from "react";

import TopBar from "../../components/interview/TopBar";
import AIAvatar from "../../components/interview/AIAvatar";
import CameraFeed from "../../components/interview/CameraFeed";
import SpeakingPanel from "../../components/interview/SpeakingPanel";
import ListeningPanel from "../../components/interview/ListeningPanel";

function Interview() {

  const candidate = JSON.parse(
    localStorage.getItem("selectedCandidate")
  );

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);

  const [question, setQuestion] = useState(
    "Tell me about yourself."
  );

  const [questionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(1500);

  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  useEffect(() => {

    checkDevices();

    setupSpeechRecognition();

  }, []);

  useEffect(() => {

    if (!interviewStarted) return;

    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 0) {

          clearInterval(timer);

          return 0;

        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [interviewStarted]);

  const checkDevices = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({

          video: true,

          audio: true,

        });

      if (videoRef.current) {

        videoRef.current.srcObject = stream;

      }

      setCameraReady(true);

      setMicReady(true);

    } catch (err) {

      console.log(err);

      alert("Please allow Camera & Microphone");

    }

  };

  const setupSpeechRecognition = () => {

    if (

      "webkitSpeechRecognition" in window ||

      "SpeechRecognition" in window

    ) {

      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      const recognition =
        new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {

        let text = "";

        for (

          let i = event.resultIndex;

          i < event.results.length;

          i++

        ) {

          text +=
            event.results[i][0].transcript;

        }

        setTranscript(text);

      };

      recognition.onend = () => {

        setListening(false);

      };

      recognitionRef.current = recognition;

    }

  };

  return (
    <div>
      {/* Interview page content goes here */}
    </div>
  );


  const startRecording = () => {

    if (recognitionRef.current) {

      recognitionRef.current.start();

      setListening(true);

    }

  };

  const stopRecording = () => {

    if (recognitionRef.current) {

      recognitionRef.current.stop();

      setListening(false);

    }

  };

  const formatTime = () => {

    const min = Math.floor(timeLeft / 60);

    const sec = timeLeft % 60;

    return `${min}:${sec.toString().padStart(2, "0")}`;

  };

  if (!interviewStarted) {

    return (

      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-10">

        <div className="w-full max-w-7xl bg-[#0E1528] rounded-3xl border border-slate-700 p-10">

          <h1 className="text-5xl font-bold text-violet-400">

            AI Interview Lobby

          </h1>

          <p className="text-gray-400 mt-3 text-lg">

            Complete your system check before starting your interview.

          </p>

          <div className="grid md:grid-cols-2 gap-10 mt-10">

            <div>

              <video

                ref={videoRef}

                autoPlay

                muted

                playsInline

                className="rounded-3xl w-full h-[420px] object-cover border border-slate-700"

              />

            </div>

            <div>

              <h2 className="text-4xl font-bold">

                {candidate?.member?.name || "Candidate"}

              </h2>

              <p className="text-xl text-gray-400 mt-3">

                {candidate?.member?.jobRole || "Software Developer"}

              </p>

              <div className="mt-10 space-y-6">

                <div className="flex justify-between">

                  <span>📹 Camera</span>

                  <span className="text-green-400">

                    {cameraReady ? "Ready" : "Not Ready"}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>🎤 Microphone</span>

                  <span className="text-green-400">

                    {micReady ? "Ready" : "Not Ready"}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span>🌐 Internet</span>

                  <span className="text-green-400">

                    {navigator.onLine ? "Connected" : "Offline"}

                  </span>

                </div>

              </div>

              <div className="mt-10">

                <h3 className="text-2xl font-bold">

                  Interview Rules

                </h3>

                <ul className="mt-5 space-y-3 text-gray-300">

                  <li>• Camera must remain ON</li>

                  <li>• Microphone must remain ON</li>

                  <li>• Speak only in English</li>

                  <li>• Do not refresh the browser</li>

                  <li>• Keep your face visible</li>

                </ul>

              </div>

              <button

                onClick={() => setInterviewStarted(true)}

                className="mt-10 w-full py-5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-xl font-bold"

              >

                Start Live Interview

              </button>

            </div>

          </div>

        </div>

      </div>

    );

  }
    return (

    <div className="min-h-screen bg-[#020617] text-white">

      <TopBar
        questionNumber={questionNumber}
        totalQuestions={8}
        time={formatTime()}
      />

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Camera + AI */}

        <div className="grid md:grid-cols-2 gap-8">

          <AIAvatar />

          <CameraFeed />

        </div>

        {/* AI Speaking */}

        <SpeakingPanel
          question={question}
        />

        {/* Transcript */}

        <ListeningPanel
          transcript={transcript}
        />

        {/* Controls */}

        <div className="mt-8 flex justify-center gap-6">

          {!listening ? (

            <button

              onClick={startRecording}

              className="
              bg-green-500
              hover:bg-green-600
              px-8
              py-4
              rounded-2xl
              text-xl
              font-semibold
              "

            >

              🎤 Start Answer

            </button>

          ) : (

            <button

              onClick={stopRecording}

              className="
              bg-red-500
              hover:bg-red-600
              px-8
              py-4
              rounded-2xl
              text-xl
              font-semibold
              "

            >

              ⏹ Stop Answer

            </button>

          )}

          <button

            className="
            bg-violet-600
            hover:bg-violet-700
            px-8
            py-4
            rounded-2xl
            text-xl
            font-semibold
            "

          >

            Next Question →

          </button>

        </div>

      </div>

    </div>

  );

}

export default Interview;