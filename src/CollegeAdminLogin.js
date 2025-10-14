import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CollegeAdminLogin = () => {
  const [form, setForm] = useState({ loginId: "", password: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://mynexus.co.in/api/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.data.token) {
        // Save token
        localStorage.setItem("token", data.data.token);
        // redirect to dashboard
           if (data.data.user.role === "collegeadmin") {
           navigate("/dashboard-college-admin"); // redirect to dashboard
        } else {
          alert("You are not authorized to access this page.");
        }
      } else {
        setError(data.message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!form.loginId) {
      setError("Enter loginId for password reset.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://mynexus.co.in/api/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: form.loginId }),
      });
      const data = await res.json();
      alert(data.message || "If the loginId exists, a reset link has been sent.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "#246fb2" }}>
          College Admin Login
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="loginId"
            name="loginId"
            value={form.loginId}
            onChange={handleChange}
            placeholder="loginId"
            required
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
       

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: "#246fb2" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleForgot}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollegeAdminLogin;
