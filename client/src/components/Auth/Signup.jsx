import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "./ButtonLoader.jsx";  
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(50);
  const [showMessage, setShowMessage] = useState(false); 

  useEffect(() => {
    if (!loading) return;

    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 3000);

    const stopTimer = setTimeout(() => {
      setLoading(false);
      setShowMessage(false);
      setSecondsLeft(50);
      alert("Backend took too long. Please try again.");
    }, 50000);

    const countdown = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(stopTimer);
      clearInterval(countdown);
    };
  }, [loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setShowMessage(false);
    setSecondsLeft(50);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      setLoading(false);
      setShowMessage(false);
      alert("Signup failed — username or email may already exist");
      return;
    }

    alert("Signup successful!");
    navigate("/login");
  }

  return (
    <div className="auth-container flex flex-col">
      <h1 className="mb-5 text-3xl font-bold text-white tracking-wider">NOTES MANAGER</h1>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center text-white mb-2">Signup</h2>

        <input
          type="text"
          className="auth-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="auth-btn mt-2 flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? <ButtonLoader /> : "Signup"}
        </button>

        {loading && showMessage && (
          <p className="text-center text-white/70 text-sm mt-2">
            Backend is waking up… retry in <b>{secondsLeft}s</b>
          </p>
        )}

        <p className="text-center text-white/80">
          Already have an account?
          <a href="/login" className="auth-link pl-2">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
