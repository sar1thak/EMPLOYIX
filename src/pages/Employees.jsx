import React from "react";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const navigate = useNavigate();
  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  return (
    <div className="min-h-screen bg-[#020617] text-white px-10 py-10">

      <div className="flex items-center gap-4 mb-8">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl
    bg-white/5 border border-white/10 backdrop-blur-md
    hover:bg-white/10 hover:border-cyan-400/40
    hover:shadow-lg hover:shadow-cyan-500/20
    transition-all duration-300 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition">←</span>
          <span className="text-sm text-gray-300 group-hover:text-white">
            Back to Dashboard
          </span>
        </button>

      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">

        <div>
          <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Employees Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Monitor workforce productivity & performance
          </p>
        </div>

        <div className="relative w-full md:w-[320px]">
          <input
            type="text"
            placeholder="Search employee..."
            className="w-full bg-[#0b1220] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm
          focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition"
          />
          <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-400/20 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Total Employees</p>
          <h2 className="text-3xl font-bold mt-1">{employees.length}</h2>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-400/20 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Active Workforce</p>
          <h2 className="text-3xl font-bold mt-1">
            {employees.reduce((acc, e) => acc + (e.taskNumbers?.active || 0), 0)}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-400/20 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Completed Tasks</p>
          <h2 className="text-3xl font-bold mt-1">
            {employees.reduce((acc, e) => acc + (e.taskNumbers?.completed || 0), 0)}
          </h2>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

        {employees.map((e, i) => {

          const total =
            (e.taskNumbers?.active || 0) +
            (e.taskNumbers?.completed || 0) +
            (e.taskNumbers?.failed || 0)

          const completionPercent = total
            ? Math.round((e.taskNumbers?.completed / total) * 100)
            : 0

          return (
            <div
              key={i}
              className="group relative bg-gradient-to-br from-[#0f172a] to-[#020617]
            p-6 rounded-2xl border border-white/10
            hover:border-cyan-400/40
            hover:shadow-cyan-500/10 hover:shadow-lg
            transition-all duration-300 hover:-translate-y-1"
            >

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
            bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 
            blur-xl rounded-2xl transition"></div>

              <div className="flex items-center gap-4 mb-5 relative z-10">

                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 
              flex items-center justify-center font-bold text-lg shadow-lg">
                  {e.firstname.charAt(0)}
                </div>

                <div>
                  <h2 className="text-xl font-semibold">{e.firstname}</h2>
                  <p className="text-xs text-gray-400">Employee ID: #{i + 1}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center relative z-10">

                <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl py-3">
                  <p className="text-xs text-gray-400">Active</p>
                  <p className="text-lg font-bold text-cyan-400">
                    {e.taskNumbers?.active}
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-400/20 rounded-xl py-3">
                  <p className="text-xs text-gray-400">Completed</p>
                  <p className="text-lg font-bold text-green-400">
                    {e.taskNumbers?.completed}
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-400/20 rounded-xl py-3">
                  <p className="text-xs text-gray-400">Failed</p>
                  <p className="text-lg font-bold text-red-400">
                    {e.taskNumbers?.failed}
                  </p>
                </div>
              </div>

              <div className="mt-6 relative z-10">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Productivity</span>
                  <span>{completionPercent}%</span>
                </div>

                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700"
                    style={{ width: `${completionPercent}%` }}
                  ></div>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Employees;
