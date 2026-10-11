import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProtectedRoute from "./components/ProtectedRoute";
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import Education from "./pages/Education";
import Messages from "./pages/Messages";
import Portfolio from "./pages/Portfolio";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/skills"
          element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
           }
        />
        <Route
          path="/dashboard/experience"
          element={
          <ProtectedRoute>
            <Experience />
          </ProtectedRoute>
          }
        />
        <Route path="/dashboard/education" element={
          <ProtectedRoute>
            <Education />
          </ProtectedRoute>
          }
        />
      <Route path="/dashboard/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
        }
        />

      </Routes>
    </BrowserRouter>
  );
}
export default App;