import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CandidateSelection() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(
        "https://ai-interview-backend-rb9p.onrender.com/api/candidates"
      );

      console.log("Candidates:", res.data);

      setCandidates(res.data);
    } catch (err) {
      console.error("Failed to load candidates:", err);
      alert("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (candidate) => {
    localStorage.setItem(
      "selectedCandidate",
      JSON.stringify(candidate)
    );

    navigate("/interview");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        <h2 className="text-2xl text-cyan-400">
          Loading Candidates...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto py-16 px-8">

        <h1 className="text-5xl font-bold text-center">
          Select Candidate
        </h1>

        <p className="text-center text-gray-400 mt-3">
          Choose a profile to begin the AI interview
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-14">

          {candidates.map((candidate) => (
            <div
              key={candidate.member.id}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 hover:border-cyan-400 transition"
            >

              <h2 className="text-2xl font-bold text-cyan-400">
                {candidate.member.name}
              </h2>

              <p className="mt-4">
                <strong>Role:</strong>{" "}
                {candidate.member.jobRole}
              </p>

              <p className="mt-2">
                <strong>Experience:</strong>{" "}
                {candidate.member.yearsExperience} Years
              </p>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span className="text-green-400">
                  {candidate.member.status}
                </span>
              </p>

              <button
                onClick={() => handleSelect(candidate)}
                className="mt-8 w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
              >
                Start Interview
              </button>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default CandidateSelection;
