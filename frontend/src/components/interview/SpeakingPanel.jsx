function SpeakingPanel({ question, aiSpeaking }) {
  return (
    <div className="mt-8 bg-[#0E1528] border border-slate-700 rounded-3xl p-8">

      <div className="flex items-center gap-3">

        <div
          className={`w-4 h-4 rounded-full ${
            aiSpeaking
              ? "bg-cyan-400 animate-pulse"
              : "bg-slate-500"
          }`}
        />

        <h2 className="text-2xl font-bold text-white">
          AI Interviewer
        </h2>

      </div>

      <p className="text-slate-300 text-xl leading-9 mt-6">
        {question || "Generating question..."}
      </p>

    </div>
  );
}

export default SpeakingPanel;