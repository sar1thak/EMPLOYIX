import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const AllTask = ({ data }) => {
   const [userData,setuserData] = useContext(AuthContext)

   return (
      <div className="mt-12">

    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Team Analytics</h1>
        <p className="text-gray-400 text-sm">Employee task performance overview</p>
      </div>
    </div>

    <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl
    shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden">

      <div className="
      grid grid-cols-5 
px-8 py-5
bg-[#0f172a]/60 backdrop-blur-xl
border-b border-white/10
shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)]
text-sm font-semibold tracking-wide text-gray-300">

        <div>Employee</div>
        <div className="text-center">New</div>
        <div className="text-center">Active</div>
        <div className="text-center">Completed</div>
        <div className="text-center">Failed</div>
      </div>

      <div className="divide-y divide-white/5">

        {userData.map((ele, idx) => (
          <div key={idx}
            className="
            grid grid-cols-5 items-center
            px-8 py-5
            hover:bg-white/[0.04]
            transition-all duration-300
            group">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 
              flex items-center justify-center font-bold text-sm">
                {ele.firstname.charAt(0)}
              </div>

              <div className="font-semibold text-white group-hover:text-cyan-400 transition">
                {ele.firstname}
              </div>
            </div>

            <div className="flex justify-center">
              <span className="px-3 py-1 rounded-full text-sm font-bold
              bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {ele.taskNumbers.newTask}
              </span>
            </div>

            <div className="flex justify-center">
              <span className="px-3 py-1 rounded-full text-sm font-bold
              bg-violet-500/20 text-violet-400 border border-violet-500/30">
                {ele.taskNumbers.active}
              </span>
            </div>

            <div className="flex justify-center">
              <span className="px-3 py-1 rounded-full text-sm font-bold
              bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {ele.taskNumbers.completed}
              </span>
            </div>

            <div className="flex justify-center">
              <span className="px-3 py-1 rounded-full text-sm font-bold
              bg-red-500/20 text-red-400 border border-red-500/30">
                {ele.taskNumbers.failed}
              </span>
            </div>

          </div>
        ))}

      </div>
    </div>
  </div>
   )
}

export default AllTask
