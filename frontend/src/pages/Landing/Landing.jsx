function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-cyan-400">
          AI Interview Agent
        </h1>

        <p className="text-gray-300 mt-6 text-xl">
          Adaptive AI Technical Interview Platform
        </p>

        <button
          className="mt-10 px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}

export default Landing;