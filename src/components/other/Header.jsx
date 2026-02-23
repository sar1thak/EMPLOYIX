import React, { useEffect, useState } from 'react'

const Header = (props) => {

  const [username, setUsername] = useState("")

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')

    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser)

      if (parsedUser.role === "admin") {
        setUsername("Admin")
      } 
      else if (parsedUser.role === "employee" && parsedUser.data) {
        setUsername(parsedUser.data.firstname)
      }
    }
  }, [])

  const LogOutUser = () => {
    localStorage.removeItem('loggedInUser')
    props.changeUser('')
  }

  return (
    <div className='flex items-center justify-between bg-white/5 border border-white/10 backdrop-blur-lg px-8 py-6 rounded-2xl shadow-lg'>
      
      <h1 className='text-2xl font-medium'>
        Hello <br/> 
        <span className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
          {username} 👋
        </span>
      </h1>

      <button 
        onClick={LogOutUser}
        className='bg-gradient-to-r from-red-500 to-red-600 
        hover:from-red-600 hover:to-red-700
        px-6 py-2 rounded-xl font-semibold
        shadow-lg hover:shadow-red-500/30
        transition-all duration-300'>
        Log Out
      </button>

    </div>
  )
}

export default Header
