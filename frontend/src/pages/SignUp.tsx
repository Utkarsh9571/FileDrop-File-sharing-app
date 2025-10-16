import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

export default function SignUp() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/sign-up", form);
      const token = res.data?.data?.token || res.data?.token;
      if (!token) {
        console.error("Unexpected sign-up response:", res.data);
        alert("Signup failed");
        return;
      }
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("auth"));
      navigate("/my-files");
    } catch (err) {
      console.error("Sign-up error:", err);
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-warmWhite dark:bg-charcoal transition-colors duration-300">
      <div className="w-full max-w-md scandi-card">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Create account</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} className="scandi-input w-full" required />
          <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} className="scandi-input w-full" required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="scandi-input w-full" required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="scandi-input w-full" required />
          <button type="submit" disabled={loading} className="scandi-btn w-full">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm scandi-muted">
          Already have an account?
          <Link to="/sign-in" className="ml-2 text-scandi-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
