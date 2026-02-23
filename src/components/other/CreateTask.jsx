import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const CreateTask = () => {

  const [userData,setuserData] = useContext(AuthContext)




  const [taskTitle, settaskTitle] = useState('')
  const [taskDescription, settaskDescription] = useState('')
  const [taskDate, settaskDate] = useState('')
  const [asignTo, setasignTo] = useState('')
  const [category, setcategory] = useState('')

  const [newTask, setnewTask] = useState({})

  const submitHandler = (e) => {
    e.preventDefault()
    setnewTask({taskTitle,taskDescription,taskDate,category,status:"newTask"})

    const data = userData

    data.forEach(function (elem) {
      if(asignTo==elem.firstname){
        elem.tasks.push(newTask)
        elem.taskNumbers.newTask = elem.taskNumbers.newTask+1;
      }
      
    });
    setuserData(data)

    setasignTo('')
    setcategory('')
    settaskDate('')
    settaskDescription('')
    settaskTitle('')
  }
  return (
    <div className='mt-8 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl'>
      <form onSubmit={(e) => {
        submitHandler(e)
      }} className='space-y-4 flex flex-wrap w-full items-start justify-between '>
        <div className='w-1/2'>

          <div>
            <h3 className='text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold'>Task Title</h3>
            <input
            value = {taskTitle}
            onChange={(e)=>{
              settaskTitle(e.target.value)

            }}  
            className='mb-3 w-4/5 text-sm py-3 px-4 rounded-xl 
bg-[#0b1220] border border-white/10 
focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
outline-none transition-all' />
          </div>
          <div>
            <h3 className='text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold'>Date</h3>
            <input
            type='date' 
            value = {taskDate}
            onChange={(e)=>{
              settaskDate(e.target.value)

            }}
            className=' mb-3 w-4/5 text-sm py-3 px-4 rounded-xl 
bg-[#0b1220] border border-white/10 
focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
outline-none transition-all' />
          </div>
          <div>
            <h3 className='text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold'>Asign To</h3>
            <input 
            value = {asignTo}
            onChange={(e)=>{
              setasignTo(e.target.value)

            }}
            className=' mb-3 w-4/5 text-sm py-3 px-4 rounded-xl 
bg-[#0b1220] border border-white/10 
focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
outline-none transition-all' />
          </div>
          <div>
            <h3 className='text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold'>Category</h3>
            <input 
            value = {category}
            onChange={(e)=>{
              setcategory(e.target.value)

            }}
            className='mb-3 w-4/5 text-sm py-3 px-4 rounded-xl 
bg-[#0b1220] border border-white/10 
focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
outline-none transition-all' />
          </div>

        </div>

        <div className='w-2/5 flex flex-col items-start'>

          <h3 className='text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold'>Description</h3>
          <textarea 
          value = {taskDescription}
            onChange={(e)=>{
              settaskDescription(e.target.value)

            }}
          className='w-full h-44 text-sm py-3 px-4 rounded-xl 
bg-[#0b1220] border border-white/10 
focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
outline-none transition-all' name='' id=''></textarea>

          <button className='w-full mt-6 py-3 rounded-xl font-semibold 
bg-gradient-to-r from-blue-500 to-cyan-500
hover:from-blue-600 hover:to-cyan-600
shadow-lg hover:shadow-blue-500/30
transition-all duration-300'>Create Task</button>

        </div>




      </form>
    </div>
  )
}

export default CreateTask
