import React from "react";
import { useNavigate } from "react-router-dom";


const Tasks = () => {
    const navigate = useNavigate();
  
  const employees = JSON.parse(localStorage.getItem("employees")) || [];

  return (
    <div className="min-h-screen bg-[#020617] text-white px-10 py-10">
      <div className="mb-8">
      <button
        onClick={() =>navigate("/")}
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

    <div className="flex items-center justify-between mb-10">

      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Task Management
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          Overview of all assigned tasks
        </p>
      </div>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

      {employees.map(emp =>
        emp.tasks?.map((task, idx) => {

          const statusColor =
            task.status === "completed"
              ? "green"
              : task.status === "failed"
              ? "red"
              : task.status === "active"
              ? "cyan"
              : "purple";

          return (
            <div
              key={idx}
              className="group relative bg-gradient-to-br from-[#0f172a] to-[#020617]
              p-6 rounded-2xl border border-white/10
              hover:border-cyan-400/40
              hover:shadow-cyan-500/10 hover:shadow-lg
              transition-all duration-300 hover:-translate-y-1"
            >

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
              bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 
              blur-xl rounded-2xl transition"></div>

              <div className="flex items-center justify-between mb-4 relative z-10">

                <h2 className="font-semibold text-lg">
                  {task.taskTitle}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full border 
                  ${
                    statusColor === "green"
                      ? "bg-green-500/10 border-green-400/30 text-green-400"
                      : statusColor === "red"
                      ? "bg-red-500/10 border-red-400/30 text-red-400"
                      : statusColor === "cyan"
                      ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-400"
                      : "bg-purple-500/10 border-purple-400/30 text-purple-400"
                  }`}
                >
                  {task.status}
                </span>

              </div>

              <p className="text-gray-400 text-sm mb-5 relative z-10">
                {task.taskDescription}
              </p>

              <div className="flex items-center justify-between relative z-10">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 
                  flex items-center justify-center text-sm font-bold shadow-lg">
                    {emp.firstname.charAt(0)}
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Assigned to</p>
                    <p className="text-sm font-medium">{emp.firstname}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Task #{idx + 1}
                </div>

              </div>

            </div>
          );
        })
      )}

    </div>
  </div>
  );
};

export default Tasks;
