import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/sign-in", { email, password });
      const token = res.data?.data?.token || res.data?.token;
      if (!token) {
        console.error("Unexpected sign-in response:", res.data);
        alert("Sign-in failed");
        return;
      }
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("auth"));
      navigate("/my-files");
    } catch (err) {
      console.error("Sign-in error:", err);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-warmWhite dark:bg-charcoal transition-colors duration-300">
      <div className="w-full max-w-md scandi-card">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="scandi-input w-full"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="scandi-input w-full"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="scandi-btn w-full"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-sm scandi-muted">
          Don’t have an account?
          <Link
            to="/sign-up"
            className="ml-2 text-scandi-accent hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
