function TopBar({ questionNumber, totalQuestions, time }) {
  return (
    <div className="w-full bg-[#0B1020] border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        <div>
          <h1 className="text-2xl font-bold text-white">
            AI Interview Agent
          </h1>

          <p className="text-slate-400 text-sm">
            Technical Interview
          </p>
        </div>

        <div className="flex gap-10">

          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Question
            </p>

            <h2 className="text-cyan-400 text-2xl font-bold">
              {questionNumber}/{totalQuestions}
            </h2>
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Time Left
            </p>

            <h2 className="text-red-400 text-2xl font-bold">
              {time}
            </h2>
          </div>

        </div>

      </div>
    </div>
  );
}

export default TopBar;