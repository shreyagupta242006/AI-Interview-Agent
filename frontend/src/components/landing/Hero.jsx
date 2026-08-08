import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#0B1120] text-white py-20">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">

        {/* Left Side */}
        <div>

          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
            <span className="text-white">
              Next Generation
            </span>

            <br />

            <span className="text-cyan-400">
              AI Interview Agent
            </span>

          </h1>

          <p className="mt-8 text-xl text-gray-300 leading-8">
            Conduct adaptive AI-powered technical interviews,
            evaluate candidates intelligently,
            and generate instant technical reports.
          </p>

          <div className="mt-10 flex gap-6">

            {/* ✅ Updated Button */}
            <button
              onClick={() => navigate("/candidate-selection")}
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold"
            >
              Start Interview
            </button>

            <button
              className="px-8 py-4 rounded-xl border border-cyan-500 hover:bg-cyan-500 hover:text-black transition"
            >
              View Demo
            </button>

          </div>

          {/* Stats */}

          <div className="flex gap-12 mt-14">

            <div>

              <h2 className="text-4xl font-bold text-cyan-400">
                10K+
              </h2>

              <p className="text-gray-400">
                Interviews
              </p>

            </div>

            <div>

              <h2 className="text-4xl font-bold text-cyan-400">
                98%
              </h2>

              <p className="text-gray-400">
                Accuracy
              </p>

            </div>

            <div>

              <h2 className="text-4xl font-bold text-cyan-400">
                31
              </h2>

              <p className="text-gray-400">
                Modules
              </p>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex justify-center">

          <div className="bg-slate-800 rounded-3xl p-10 border border-slate-700 shadow-2xl w-full max-w-lg">

            <div className="flex justify-between items-center">

              <h2 className="text-3xl font-bold">
                Live Interview
              </h2>

              <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>

            </div>

            <p className="text-gray-400 mt-8">
              Question 3 / 8
            </p>

            <div className="w-full h-3 bg-slate-700 rounded-full mt-4">

              <div className="w-2/3 h-3 bg-cyan-400 rounded-full"></div>

            </div>

            <p className="mt-10 text-lg text-gray-300 leading-8">
              Explain Retrieval-Augmented Generation and where
              vector databases fit into the pipeline.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;