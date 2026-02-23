import React from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTask from '../other/AllTask'
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = (props) => {
  const [stats, setStats] = useState({
    employees: 0,
    active: 0,
    completed: 0,
    failed: 0,
    newTask: 0
  })
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("employees")) || [];

    let totalEmployees = data.length;
    let active = 0;
    let completed = 0;
    let failed = 0;
    let newTask = 0;

    data.forEach(emp => {
      if (emp.taskNumbers) {
        active += emp.taskNumbers.active || 0;
        completed += emp.taskNumbers.completed || 0;
        failed += emp.taskNumbers.failed || 0;
        newTask += emp.taskNumbers.newTask || 0;
      }
    });

    setStats({
      employees: totalEmployees,
      active,
      completed,
      failed,
      newTask
    });
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#020617] text-white">

      <div className="w-64 bg-[#020617] border-r border-white/10 p-6 hidden md:block">

        <h1 className="text-2xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Admin Panel
        </h1>

        <nav className="flex flex-col gap-4 text-gray-400">

          <Link to="/" className="hover:text-white hover:bg-white/5 p-3 rounded-lg">
            📊 Dashboard
          </Link>

          <Link to="/employees" className="hover:text-white hover:bg-white/5 p-3 rounded-lg">
            🧑 Employees
          </Link>

          <Link to="/tasks" className="hover:text-white hover:bg-white/5 p-3 rounded-lg">
            📋 Tasks
          </Link>

          <Link to="/settings" className="hover:text-white hover:bg-white/5 p-3 rounded-lg">
            ⚙ Settings
          </Link>

        </nav>
      </div>


      <div className="flex-1 p-10">

        <Header changeUser={props.changeUser} />

        <div className="grid grid-cols-4 gap-7 mt-10">

          {/* TOTAL EMPLOYEES */}
          <div className="group relative overflow-hidden rounded-2xl 
  bg-[#0b1220]/70 backdrop-blur-xl border border-white/10 
  p-7 transition-all duration-300 
  hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,200,255,0.15)]">

            {/* glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl"></div>

            <div className="flex items-center justify-between">
              <h3 className="text-gray-400 text-medium tracking-wide">Total Employees</h3>
              <span className="text-blue-400 text-xl">👥</span>
            </div>

            <p className="text-4xl font-bold mt-4 text-white group-hover:text-blue-400 transition">
              {stats.employees}
            </p>
          </div>

          {/* ACTIVE TASKS */}
          <div className="group relative overflow-hidden rounded-2xl 
  bg-[#0b1220]/70 backdrop-blur-xl border border-white/10 
  p-7 transition-all duration-300 
  hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(168,85,247,0.25)]">

            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl"></div>

            <div className="flex items-center justify-between">
              <h3 className="text-gray-400 text-medium tracking-wide">Active Tasks</h3>
              <span className="text-yellow-400 text-xl">⚡</span>
            </div>

            <p className="text-4xl font-bold mt-4 text-white group-hover:text-purple-400 transition">
              {stats.active}
            </p>
          </div>

          {/* COMPLETED */}
          <div className="group relative overflow-hidden rounded-2xl 
  bg-[#0b1220]/70 backdrop-blur-xl border border-white/10 
  p-7 transition-all duration-300 
  hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,255,150,0.18)]">

            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 blur-3xl"></div>

            <div className="flex items-center justify-between">
              <h3 className="text-gray-400 text-medium tracking-wide">Completed</h3>
              <span className="text-emerald-400 text-xl">✔</span>
            </div>

            <p className="text-4xl font-bold mt-4 text-white group-hover:text-emerald-400 transition">
              {stats.completed}
            </p>
          </div>

          {/* FAILED */}
          <div className="group relative overflow-hidden rounded-2xl 
  bg-[#0b1220]/70 backdrop-blur-xl border border-white/10 
  p-7 transition-all duration-300 
  hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,60,60,0.18)]">

            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 blur-3xl"></div>

            <div className="flex items-center justify-between">
              <h3 className="text-gray-400 text-medium tracking-wide">Failed</h3>
              <span className="text-red-400 text-xl">✖</span>
            </div>

            <p className="text-4xl font-bold mt-4 text-white group-hover:text-red-400 transition">
              {stats.failed}
            </p>
          </div>

        </div>


        <div className="mt-10">
          <CreateTask />
        </div>


        <div className="mt-10">
          <AllTask />
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard
