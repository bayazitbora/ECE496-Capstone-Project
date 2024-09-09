import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import Questionnaire from "./pages/Questionnaire/Questionnaire";
import Start from "./components/Start";
import { SignUpProvider } from "./context/SignUpContext";
import "./App.css";

const router = createBrowserRouter([
  { path: "/", element: <Start /> },
  { path: "/log-in", element: <LogIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/questionnaire", element: <Questionnaire /> },
]);

function App() {
  return (
    <main style={{ height: "100vh", width: "100vw", margin: 0 }}>
      <SignUpProvider>
        <RouterProvider router={router} />
      </SignUpProvider>
    </main>
  );
}

export default App;
