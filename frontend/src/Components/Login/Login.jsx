import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase"; // 🔁 Adjust this path if needed
import { setPersistence, browserLocalPersistence,  signInWithEmailAndPassword } from "firebase/auth";

const Login= () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence); // 👈 Ensures user stays logged in
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate("/"); // ✅ Redirect after successful login
    } catch (err) {
      const rawCode = err.code || ""; // e.g., "auth/invalid-credential"
  const friendlyMessage = rawCode
    .replace("auth/", "")         // Remove "auth/"
    .replace(/-/g, " ")           // Replace dashes with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize words

  setError(friendlyMessage); // e.g., "Invalid Credential"
      setLoading(false);
      setTimeout(( )=> {
        setError("");
      },3000)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition cursor-pointer text-white py-2 rounded-lg font-medium"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-zinc-400 mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
