import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Container, Spinner } from "reactstrap";
import initFontAwesome from "./utils/initFontAwesome";
import "bootstrap/dist/css/bootstrap.min.css";
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
import CourseMngmt from "./pages/CourseMngmt";
import { SignUpProvider } from "./context/SignUpContext";
import { FormProvider } from "./context/FormContext";
import { useAuth, AuthProvider } from "./context/AuthContext";

/**
 * Defines the routes for the application based on the user's authentication status.
 * Public routes are accessible to all users, while private routes are only accessible to authenticated users.
 */
const Routes = () => {
  const { token } = useAuth();

  const publicRoutes = [
    { path: "/", element: <Start /> },
    { path: "/sign-up", element: <AccountCreation /> },
    { path: "/log-in", element: <LogIn /> },
    {
      path: "*",
      element: (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner color="primary" />
        </div>
      ),
    },
  ];

  const privateRoutes = [
    { path: "/profile", element: <Profile /> },
    { path: "/courses", element: <Courses /> },
    { path: "/contacts", element: <Contacts /> },
    { path: "/settings", element: <Settings /> },
    { path: "/course/:courseCode", element: <Course /> },
    { path: "/course-management/:courseCode", element: <CourseMngmt /> },
  ];

  const router = createBrowserRouter([
    ...publicRoutes,
    ...(token ? privateRoutes : []),
  ]);

  return <RouterProvider router={router} />;
};

/**
 * The main App component that wraps the application with necessary providers and renders the Navbar and Routes.
 */
function App() {
  return (
    <main style={{ height: "100vh", width: "100vw", margin: 0 }}>
      <AuthProvider>
        <SignUpProvider>
          <FormProvider>
            <Navbar />
            <Container>
              <Routes />
            </Container>
          </FormProvider>
        </SignUpProvider>
      </AuthProvider>
    </main>
  );
}

export default App;
