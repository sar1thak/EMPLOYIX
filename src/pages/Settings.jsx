import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Settings = () => {
      const navigate = useNavigate();
  

  const [darkMode, setDarkMode] = useState(true)

  const resetSystem = () => {
    const confirmReset = window.confirm(
      "This will delete all employees & tasks. Continue?"
    )

    if(confirmReset){
      localStorage.clear()
      alert("System reset complete. Refresh app.")
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-10 py-10">

      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
    bg-white/5 border border-white/10 backdrop-blur-md
    hover:bg-white/10 hover:border-cyan-400/40
    hover:shadow-lg hover:shadow-cyan-500/20
    transition-all duration-300 group"
        >
          <span className="text-xl">←</span>
          Back to Dashboard
        </button>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Admin Settings
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Manage system preferences & controls
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Admin Profile</h2>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-xl font-bold">
              A
            </div>

            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-sm text-gray-400">admin@me.com</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-6">Appearance</h2>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Dark Mode</span>

            <button
              onClick={()=>setDarkMode(!darkMode)}
              className={`w-14 h-7 flex items-center rounded-full p-1 transition
              ${darkMode ? "bg-cyan-500" : "bg-gray-600"}`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition
                ${darkMode ? "translate-x-7" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-6">System Controls</h2>

          <div className="flex flex-col gap-4">

            <button
              onClick={resetSystem}
              className="bg-red-500/10 border border-red-400/30 text-red-400
              py-3 rounded-xl hover:bg-red-500/20 transition"
            >
              Reset All Data
            </button>

            <button
              className="bg-cyan-500/10 border border-cyan-400/30 text-cyan-400
              py-3 rounded-xl hover:bg-cyan-500/20 transition"
            >
              Export Data (coming soon)
            </button>

          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0f172a] to-[#020617] p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">About System</h2>

          <p className="text-gray-400 text-sm leading-relaxed">
            EMS is a modern employee management platform designed to track
            tasks, productivity and workforce performance in real time.
            Built with a modern React + LocalStorage architecture.
          </p>

          <div className="mt-4 text-xs text-gray-500">
            Version 1.0 • Internal Admin Panel
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;