import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LogIn from "./pages/LogIn";
import AccountCreation from "./pages/AccountCreation/AccountCreation";
import Profile from "./pages/Profile/Profile";
import Start from "./components/Start";
import Courses from "./pages/Courses/Courses";
import Contacts from "./pages/Contacts";
import Settings from "./pages/Settings";
import { SignUpProvider } from "./context/SignUpContext";
import { FormProvider } from "./context/FormContext";
import "./App.css";

const router = createBrowserRouter([
  { path: "/", element: <Start /> },
  { path: "/sign-up", element: <AccountCreation /> },
  { path: "/log-in", element: <LogIn /> },
  { path: "/profile", element: <Profile /> },
  { path: "/courses", element: <Courses /> },
  { path: "/contacts", element: <Contacts /> },
  { path: "/settings", element: <Settings /> },
  { path: "*", element: <h1>Not Found</h1> },
]);

function App() {
  return (
    <main style={{ height: "100vh", width: "100vw", margin: 0 }}>
      <SignUpProvider>
        <FormProvider>
          <RouterProvider router={router} />
        </FormProvider>
      </SignUpProvider>
    </main>
  );
}

export default App;
