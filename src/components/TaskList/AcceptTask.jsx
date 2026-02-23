import React from 'react'

const AcceptTask = ({ data }) => {
  return (
    <div className="
      group
      relative
      min-w-[340px] max-w-[340px]
      backdrop-blur-2xl
      bg-gradient-to-br from-cyan-500/[0.08] via-slate-900 to-slate-900
      border border-cyan-400/20
      rounded-3xl p-6
      shadow-[0_10px_40px_rgba(0,0,0,0.5)]
      hover:shadow-[0_20px_70px_rgba(34,211,238,0.25)]
      hover:-translate-y-1
      transition-all duration-300
      flex flex-col justify-between
    ">

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
      bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent 
      blur-2xl rounded-3xl transition"></div>

      <div className='flex justify-between items-center mb-4 relative z-10'>
        <span className='text-xs px-3 py-1 rounded-full 
        bg-cyan-500/10 text-cyan-400 
        border border-cyan-400/20 
        uppercase tracking-wide'>
          {data.category}
        </span>

        <span className='text-xs text-gray-400'>
          {data.taskDate}
        </span>
      </div>

      <h2 className='text-xl font-semibold text-white group-hover:text-cyan-300 transition relative z-10'>
        {data.taskTitle}
      </h2>

      <p className='text-gray-400 text-sm leading-relaxed mt-2 line-clamp-3 relative z-10'>
        {data.taskDescription}
      </p>

      <div className="h-[1px] w-full bg-white/10 my-5 relative z-10"></div>

      <div className='flex gap-3 relative z-10'>

        <button className='flex-1 py-2.5 rounded-xl text-sm font-semibold
        bg-gradient-to-r from-emerald-500 to-green-600
        shadow-lg shadow-emerald-500/20
        hover:shadow-emerald-500/40
        hover:scale-[1.04]
        active:scale-95
        transition-all duration-200'>
          Complete ✓
        </button>

        <button className='flex-1 py-2.5 rounded-xl text-sm font-semibold
        bg-gradient-to-r from-red-500 to-rose-600
        shadow-lg shadow-red-500/20
        hover:shadow-red-500/40
        hover:scale-[1.04]
        active:scale-95
        transition-all duration-200'>
          Fail ✕
        </button>

      </div>

    </div>
  )
}

export default AcceptTask