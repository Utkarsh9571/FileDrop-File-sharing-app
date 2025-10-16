import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Upload from "./pages/Upload";
import MyFiles from "./pages/MyFiles";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  // Keep token in sync across tabs and same-tab auth events
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("token"));
    const onAuth = () => setToken(localStorage.getItem("token"));

    window.addEventListener("storage", onStorage); // other tabs
    window.addEventListener("auth", onAuth); // same-tab dispatch after login/logout

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth", onAuth);
    };
  }, []);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <Router>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
        }`}
      >
        {/* Dark Mode Toggle */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setIsDark((prev) => !prev)}
            className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 text-sm"
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Authenticated vs Unauthenticated Routes */}
        {!token ? (
          <main className="flex items-center justify-center min-h-screen px-4">
            <Routes>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </Routes>
          </main>
        ) : (
          <>
            <Navbar />
            <main className="flex-grow px-4 py-6">
              <Routes>
                <Route path="/" element={<Navigate to="/my-files" replace />} />
                <Route path="/my-files" element={<MyFiles />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </>
        )}
      </div>
    </Router>
  );
}
