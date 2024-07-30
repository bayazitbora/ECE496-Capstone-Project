import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Questionnaire from "./pages/Questionnaire";
import Navbar from "./components/Navbar";

function App() {
  return (
    <main>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
