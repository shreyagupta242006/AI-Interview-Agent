import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

 const handleLogin = (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    alert("Please fill all fields");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(form.email)) {
    alert("Please enter a valid email address");
    return;
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordRegex.test(form.password)) {
    alert(
      "Password must contain at least:\n\n• 8 characters\n• 1 uppercase letter\n• 1 lowercase letter\n• 1 number\n• 1 special character"
    );
    return;
  }

  localStorage.setItem("user", JSON.stringify(form));

  navigate("/home");
};
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">

      <div className="bg-slate-900 p-10 rounded-3xl w-[420px] border border-slate-700 shadow-2xl">

        <h1 className="text-4xl font-bold text-cyan-400 text-center">
          Login
        </h1>

        <p className="text-center text-gray-400 mt-2">
          Welcome to AI Interview Agent
        </p>

        <form onSubmit={handleLogin} className="mt-8">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white mb-5 outline-none"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white mb-8 outline-none"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-semibold transition"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;