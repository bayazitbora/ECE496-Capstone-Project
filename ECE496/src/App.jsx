import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import Questionnaire from "./pages/Questionnaire/Questionnaire";
import Start from "./components/Start";
import { SignUpProvider } from "./context/SignUpContext";
import "./App.css";

function App() {
  return (
    <main style={{ height: "100vh", width: "100vw", margin: 0 }}>
      <SignUpProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/log-in" element={<LogIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}
            <Route path="/questionnaire" element={<Questionnaire />} />
          </Routes>
        </Router>
      </SignUpProvider>
    </main>
  );
}

export default App;
