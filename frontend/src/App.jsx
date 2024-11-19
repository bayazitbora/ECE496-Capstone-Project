import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {Container} from "reactstrap";
import initFontAwesome from "./utils/initFontAwesome";
import 'bootstrap/dist/css/bootstrap.min.css';
initFontAwesome();

import Navbar from "./components/Navbar/Navbar";
import LogIn from "./pages/LogIn/LogIn";
import AccountCreation from "./pages/AccountCreation/AccountCreation";
import Profile from "./pages/Profile/Profile";
import Start from "./components/Start";
import Courses from "./pages/Courses/Courses";
import Contacts from "./pages/Contacts";
import Settings from "./pages/Settings";
import Course from "./pages/Course";
import { SignUpProvider } from "./context/SignUpContext";
import { FormProvider } from "./context/FormContext";

const router = createBrowserRouter([
  { path: "/", element: <Start /> },
  { path: "/sign-up", element: <AccountCreation /> },
  { path: "/log-in", element: <LogIn /> },
  { path: "/profile", element: <Profile /> },
  { path: "/courses", element: <Courses /> },
  { path: "/contacts", element: <Contacts /> },
  { path: "/settings", element: <Settings /> },
  { path: "/course/:courseCode", element: <Course /> },
  { path: "*", element: <h1>Not Found</h1> },
]);

function App() {
  return (
    <main style={{ height: "100vh", width: "100vw", margin: 0 }}>
      <SignUpProvider>
        <FormProvider>
          <Navbar />
          <Container>
          <RouterProvider router={router} />
          </Container>
        </FormProvider>
      </SignUpProvider>
    </main>
  );
}

export default App;
