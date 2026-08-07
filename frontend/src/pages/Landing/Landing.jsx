import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";

function Landing() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-4xl font-bold">
          Welcome,
          <span className="text-cyan-400 ml-2">
            {user?.email?.split("@")[0] || "Student"}
          </span>
        </h1>

        <p className="text-gray-400 mt-2">
          Ready to begin your AI-powered technical interview?
        </p>
      </div>

      <Hero />
    </div>
  );
}

export default Landing;