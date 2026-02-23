import React from 'react'
import AcceptTask from './AcceptTask'
import NewTask from './NewTask'
import CompleteTask from './CompleteTask'
import FailedTask from './FailedTask'

const TaskList = ({data}) => {
  
  return (
    <div id='tasklist' className='flex gap-6 overflow-x-auto pb-4 scrollbar-hide'>
      {data.tasks.map(task => {
        if(task.status === "newTask")
          return <NewTask key={task.id} data={task}/>
        if(task.status === "active")
          return <AcceptTask key={task.id} data={task}/>
        if(task.status === "completed")
          return <CompleteTask key={task.id} data={task}/>
        if(task.status === "failed")
          return <FailedTask key={task.id} data={task}/>
      })}
        

        

        

        
        
      
    </div>
  )
}

export default TaskList
