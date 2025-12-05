import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex justify-between px-4 md:px-10 py-5 items-center">
      <h1 className="text-3xl max-sm:text-xl font-semibold tracking-wide text-white">NOTES MANAGER</h1>
      <button onClick={handleLogout} className="bg-white/20 text-white font-medium px-5 py-2 rounded-lg cursor-pointer hover:bg-red-500 transition max-sm:px-3 max-sm:py-1 max-sm:text-sm">Logout</button>
    </div>
  );
};

export default Navbar;
