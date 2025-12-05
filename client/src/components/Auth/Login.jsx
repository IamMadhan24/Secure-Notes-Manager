import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "./ButtonLoader.jsx";  
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(50);
  const [showMessage, setShowMessage] = useState(false); 

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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
      setSecondsLeft((sec) => (sec > 0 ? sec - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(stopTimer);
      clearTimeout(messageTimer);
      clearInterval(countdown);
    };
  }, [loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setSecondsLeft(50);
    setShowMessage(false); 

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password,
      }),
    });

    if (!response.ok) {
      setLoading(false);
      setShowMessage(false);
      alert("Invalid username or password");
      return;
    }

    const data = await response.json();
    login(data.token);
    navigate("/dashboard");
  }

  return (
    <div className="auth-container flex flex-col">
      <h1 className="mb-5 text-3xl font-bold text-white tracking-wider">NOTES MANAGER</h1>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center text-white mb-2">Login</h2>

        <input
          type="text"
          className="auth-input"
          placeholder="Username or Email"
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
          {loading ? <ButtonLoader /> : "Login"}
        </button>

        {loading && showMessage && (
          <p className="text-center text-white/70 text-sm mt-2">
            Backend is waking up… retry in <b>{secondsLeft}s</b>
          </p>
        )}

        <p className="text-center text-white/80 mt-3">
          Don’t have an account?
          <a href="/signup" className="auth-link pl-2">Signup</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
