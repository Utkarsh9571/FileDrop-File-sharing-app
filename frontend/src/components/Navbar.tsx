import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const onAuth = () => setToken(localStorage.getItem("token"));
    window.addEventListener("auth", onAuth);
    window.addEventListener("storage", onAuth);
    return () => {
      window.removeEventListener("auth", onAuth);
      window.removeEventListener("storage", onAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth"));
    navigate("/sign-in");
  };

  return (
    <header className="border-b border-[#151516]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0f1112] rounded-lg flex items-center justify-center font-semibold">FD</div>
          <span className="font-semibold text-gray-100">Filedrop</span>
        </Link>

        <nav className="flex items-center gap-3">
          {token ? (
            <>
              <Link to="/my-files" className="scandi-btn bg-transparent border border-transparent text-white">My files</Link>
              <Link to="/upload" className="scandi-btn">Upload</Link>
              <button onClick={handleLogout} className="scandi-btn bg-transparent border border-transparent text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="scandi-btn bg-transparent border border-transparent">Sign in</Link>
              <Link to="/sign-up" className="scandi-btn">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
