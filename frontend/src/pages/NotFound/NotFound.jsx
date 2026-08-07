import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import CandidateSelection from "./pages/CandidateSelection/CandidateSelection";
import Interview from "./pages/Interview/Interview";
import Report from "./pages/Report/Report";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/candidates" element={<CandidateSelection />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/report" element={<Report />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;