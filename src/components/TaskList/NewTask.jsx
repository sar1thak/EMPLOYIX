import React from 'react'

const NewTask = ({ data }) => {
  return (
    <div className="
      group
      min-w-[340px] max-w-[340px]
      backdrop-blur-2xl
      bg-gradient-to-br from-cyan-500/[0.08] to-slate-900
      border border-cyan-400/20
      rounded-3xl p-6
      shadow-[0_10px_40px_rgba(0,0,0,0.5)]
      hover:shadow-[0_20px_60px_rgba(34,211,238,0.25)]
      hover:-translate-y-1
      transition-all duration-300
      flex flex-col justify-between
    ">

      <div className='flex justify-between items-center mb-4'>
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

      <h2 className='text-xl font-semibold text-white group-hover:text-cyan-400 transition'>
        {data.taskTitle}
      </h2>

      <p className='text-gray-400 text-sm leading-relaxed mt-2 line-clamp-3'>
        {data.taskDescription}
      </p>

      <div className="h-[1px] w-full bg-white/10 my-5"></div>

      <button className='w-full py-2.5 rounded-xl text-sm font-semibold
      bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500
      shadow-lg shadow-cyan-500/20
      hover:shadow-cyan-500/40
      hover:scale-[1.03]
      active:scale-95
      transition-all duration-200'>
        Accept Task →
      </button>

    </div>
  )
}

export default NewTask