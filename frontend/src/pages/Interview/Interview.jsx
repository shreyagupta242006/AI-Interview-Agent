import { useEffect, useRef, useState } from "react";

function Interview() {
  const candidate = JSON.parse(localStorage.getItem("selectedCandidate"));

  const videoRef = useRef(null);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  useEffect(() => {
    checkDevices();
    setupSpeechRecognition();
  }, []);

  const checkDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
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
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let text = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }

        setTranscript(text);
      };

      recognition.onend = () => {
        setListening(false);
      };

      window.recognition = recognition;
    }
  };

  const startRecording = () => {
    if (window.recognition) {
      window.recognition.start();
      setListening(true);
    }
  };

  const stopRecording = () => {
    if (window.recognition) {
      window.recognition.stop();
      setListening(false);
    }
  };

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <div className="bg-slate-900 rounded-3xl w-[950px] p-10 border border-slate-700">

          <h1 className="text-4xl font-bold text-cyan-400">
            AI Interview Lobby
          </h1>

          <p className="text-gray-400 mt-2">
            Complete your system check before starting.
          </p>

          <div className="grid md:grid-cols-2 gap-10 mt-10">

            <div>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full rounded-2xl border border-slate-700"
              />
            </div>

            <div>

              <h2 className="text-3xl font-bold">
                {candidate?.member?.name}
              </h2>

              <p className="text-gray-400 mt-2">
                {candidate?.member?.jobRole}
              </p>

              <div className="mt-8 space-y-4">

                <p>
                  📹 Camera :
                  <span className="ml-2 text-green-400">
                    {cameraReady ? "Ready" : "Not Ready"}
                  </span>
                </p>

                <p>
                  🎤 Microphone :
                  <span className="ml-2 text-green-400">
                    {micReady ? "Ready" : "Not Ready"}
                  </span>
                </p>

                <p>
                  🌐 Internet :
                  <span className="ml-2 text-green-400">
                    {navigator.onLine ? "Connected" : "Offline"}
                  </span>
                </p>

              </div>

              <div className="mt-8">

                <h3 className="text-xl font-bold">
                  Interview Rules
                </h3>

                <ul className="mt-4 space-y-2 text-gray-300">
                  <li>• Camera should remain ON</li>
                  <li>• Microphone should remain ON</li>
                  <li>• Answer in English</li>
                  <li>• Do not refresh the page</li>
                </ul>

              </div>

              <button
                onClick={() => setInterviewStarted(true)}
                className="mt-10 w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600"
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

      <div className="max-w-6xl mx-auto py-10 px-8">

        <h1 className="text-4xl font-bold text-cyan-400">
          Live AI Interview
        </h1>

        <div className="mt-8 bg-slate-900 rounded-2xl p-6">

          <h2 className="text-2xl font-bold">
            {candidate?.member?.name}
          </h2>

          <p className="text-gray-400 mt-2">
            {candidate?.member?.jobRole}
          </p>

        </div>

        <div className="mt-8 bg-slate-900 rounded-2xl p-8">

          <h2 className="text-2xl font-bold">
            AI Question
          </h2>

          <p className="mt-4 text-xl">
            Tell me about yourself.
          </p>

        </div>

        <div className="mt-8 flex gap-4">

          {!listening ? (
            <button
              onClick={startRecording}
              className="bg-cyan-500 px-8 py-4 rounded-xl"
            >
              🎤 Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 px-8 py-4 rounded-xl"
            >
              ⏹ Stop Recording
            </button>
          )}

        </div>

        <div className="mt-8 bg-slate-900 rounded-2xl p-8">

          <h2 className="text-2xl font-bold">
            Live Transcript
          </h2>

          <p className="mt-4 text-gray-300 min-h-[120px]">
            {transcript || "Start speaking..."}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Interview;