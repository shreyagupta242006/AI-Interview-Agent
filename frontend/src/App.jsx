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
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<Landing />} />

        <Route
          path="/candidate-selection"
          element={<CandidateSelection />}
        />

        <Route
          path="/interview"
          element={<Interview />}
        />

        <Route
          path="/report"
          element={<Report />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;