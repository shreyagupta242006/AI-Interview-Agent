function ListeningPanel({ transcript, listening }) {
  return (
    <div className="mt-8 bg-[#0E1528] border border-slate-700 rounded-3xl p-8">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold text-white">
          Your Answer
        </h2>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            listening
              ? "bg-green-500 text-white"
              : "bg-slate-700 text-slate-300"
          }`}
        >
          {listening ? "Listening..." : "Idle"}
        </span>

      </div>

      <div className="mt-6 min-h-[180px] rounded-2xl bg-[#09101E] p-6">

        <p className="text-slate-300 text-lg leading-8 whitespace-pre-wrap">
          {transcript || "Start speaking..."}
        </p>

      </div>

    </div>
  );
}

export default ListeningPanel;