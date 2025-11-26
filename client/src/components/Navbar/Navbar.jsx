import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="nav-container">
      <h1 className="nav-title">Notevue</h1>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default Navbar;
