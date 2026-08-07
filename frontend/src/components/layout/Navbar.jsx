import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-wide">
          AI Interview Agent
        </h1>

        <ul className="hidden md:flex gap-10 text-gray-300">

          <li className="hover:text-cyan-400 cursor-pointer duration-300">
            Features
          </li>

          <li className="hover:text-cyan-400 cursor-pointer duration-300">
            Workflow
          </li>

          <li className="hover:text-cyan-400 cursor-pointer duration-300">
            About
          </li>

        </ul>

        <button
          onClick={logout}
          className="bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 duration-300 px-6 py-3 rounded-xl shadow-xl"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;