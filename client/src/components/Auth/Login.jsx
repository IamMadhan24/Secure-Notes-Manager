import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email, 
        password: password,
      }),
    });

    if (!response.ok) {
      alert("Invalid username or password");
      return;
    }

    const data = await response.json();
    login(data.token); 

    navigate("/dashboard");
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Login
        </h2>

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

        <button type="submit" className="auth-btn mt-2">
          Login
        </button>

        <p className="text-center text-white/80">
          Don't have an account?
          <a href="/signup" className="auth-link pl-2">
            Signup
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
