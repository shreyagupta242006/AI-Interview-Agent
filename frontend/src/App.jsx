import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Landing from "./pages/Landing/Landing";
import CandidateSelection from "./pages/CandidateSelection/CandidateSelection";
import Interview from "./pages/Interview/Interview";
import Report from "./pages/Report/Report";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login Page */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Landing Page */}
        <Route path="/home" element={<Landing />} />

        {/* Candidate Selection */}
        <Route
          path="/candidate-selection"
          element={<CandidateSelection />}
        />

        {/* Interview */}
        <Route
          path="/interview"
          element={<Interview />}
        />

        {/* Report */}
        <Route
          path="/report"
          element={<Report />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;