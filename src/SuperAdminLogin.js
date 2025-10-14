import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = isForgot
        ? "https://mynexus.co.in/api/api/auth/forgot"
        : "https://mynexus.co.in/api/api/auth/login";

      const body = isForgot ? { loginId } : { loginId, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const loginData = await res.json();
      if (!res.ok) throw new Error(loginData.message || "Something went wrong");

      if (isForgot) {
        setMessage("📩 Reset link sent to your loginId.");
      } else {
        setMessage("✅ Login successful!");
        console.log("Login Response loginData:", loginData);
        // Save token if needed
        // localStorage.setItem("token", loginData?.data);
        localStorage.setItem("token", loginData.data.token);
        // localStorage.setItem("role", loginData.user.role);
        // localStorage.setItem("collegeId", loginData.user.id);
        if (loginData.data.user.role === "superadmin") {
          setTimeout(() => navigate("/dashboard"), 1000); // redirect to dashboard
        } else {
          alert("You are not authorized to access this page.");
        }
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h1
          className="text-2xl font-bold text-center"
          style={{ color: "#246fb2" }}
        >
          {isForgot ? "Forgot Password" : "Login"}
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">loginId</label>
            <input
              type="loginId"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: "#246fb2" }}
            />
          </div>

          {!isForgot && (
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: "#246fb2" }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition flex items-center justify-center"
            style={{ backgroundColor: "#246fb2" }}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : isForgot ? (
              "Send Reset Link"
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setIsForgot(!isForgot);
              setMessage("");
            }}
            className="text-sm font-medium hover:underline"
            style={{ color: "#246fb2" }}
          >
            {isForgot ? "⬅️ Back to Login" : "Forgot Password?"}
          </button>
        </div>

        {message && (
          <div className="mt-4 text-center text-sm font-medium text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
