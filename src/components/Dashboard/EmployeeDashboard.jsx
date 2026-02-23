import React from 'react'
import Header from '../other/Header'
import TaskNumberPanel from '../other/TaskNumberPanel'
import TaskList from '../TaskList/TaskList'

const EmployeeDashboard = (props) => {
  
  return (
    <div className="min-h-screen text-white px-12 py-10 
bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]">
  <div className="fixed top-0 left-0 w-full h-[300px] 
bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent 
blur-3xl pointer-events-none"/>

    <Header changeUser={props.changeUser} data={props.data} />

    <div className="mt-10 space-y-10">

        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 
        rounded-3xl p-6 shadow-[0_0_40px_rgba(0,255,255,0.08)]">
            <TaskNumberPanel data={props.data}/>
        </div>

        <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 
        rounded-3xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.08)]">
            <h2 className="text-xl font-semibold mb-6 text-white/90 tracking-wide">
                Your Tasks
            </h2>

            <TaskList data={props.data}/>
        </div>

    </div>
</div>
  )
}

export default EmployeeDashboard
