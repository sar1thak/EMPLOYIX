import React from 'react'

const TaskNumberPanel = ({ data }) => {
  return (
    <div className='grid grid-cols-4 gap-6'>
      <div className='rounded-2xl p-7 
bg-gradient-to-br from-blue-500/10 to-cyan-500/10
border border-blue-400/20 backdrop-blur-xl
hover:scale-[1.03] transition-all duration-300
shadow-lg shadow-cyan-500/10'>
        <h2 className='text-4xl font-bold text-cyan-400'>{data.taskNumbers.newTask}</h2>
        <h3 className='text-sm text-white/70 mt-1 tracking-wider uppercase'>New Task</h3>
      </div>

      <div className='rounded-2xl p-7 
bg-gradient-to-br from-purple-500/10 to-violet-500/10
border border-purple-400/20 backdrop-blur-xl
hover:scale-[1.03] transition-all duration-300
shadow-lg shadow-violet-500/10'>
        <h2 className='text-4xl font-bold text-violet-400'>{data.taskNumbers.active}</h2>
        <h3 className='text-sm text-white/70 mt-1 tracking-wider uppercase'>Accepted Task</h3>
      </div>

      <div className='rounded-2xl p-7 
bg-gradient-to-br from-emerald-500/10 to-green-500/10
border border-emerald-400/20 backdrop-blur-xl
hover:scale-[1.03] transition-all duration-300
shadow-lg shadow-emerald-500/10'>
        <h2 className='text-4xl font-bold text-emerald-400'>{data.taskNumbers.completed}</h2>
        <h3 className='text-sm text-white/70 mt-1 tracking-wider uppercase'>Completed Task</h3>
      </div>

      <div className='rounded-2xl p-7 
bg-gradient-to-br from-red-500/10 to-orange-500/10
border border-red-400/20 backdrop-blur-xl
hover:scale-[1.03] transition-all duration-300
shadow-lg shadow-red-500/10'>
        <h2 className='text-4xl font-bold text-red-400'>{data.taskNumbers.failed}</h2>
        <h3 className='text-sm text-white/70 mt-1 tracking-wider uppercase'>Failed Task</h3>
      </div>

    </div>
  )
}

export default TaskNumberPanel
