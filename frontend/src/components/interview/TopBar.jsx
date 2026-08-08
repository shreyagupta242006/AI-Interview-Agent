function TopBar({ questionNumber = 1, totalQuestions = 8, time = "25:00" }) {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-700 px-8 py-5 flex items-center justify-between">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-cyan-400">
          AI Interview
        </h1>

        <p className="text-gray-400 mt-1">
          Real-Time AI Technical Interview
        </p>
      </div>

      {/* Center */}
      <div className="flex gap-6">

        <div className="bg-slate-800 rounded-xl px-6 py-3 text-center">

          <p className="text-sm text-gray-400">
            Question
          </p>

          <h2 className="text-xl font-bold text-cyan-400">
            {questionNumber} / {totalQuestions}
          </h2>

        </div>

        <div className="bg-slate-800 rounded-xl px-6 py-3 text-center">

          <p className="text-sm text-gray-400">
            Time Left
          </p>

          <h2 className="text-xl font-bold text-red-400">
            {time}
          </h2>

        </div>

      </div>

      {/* Right */}

      <button
        className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-semibold duration-300"
      >
        Exit Interview
      </button>

    </div>
  );
}

export default TopBar;