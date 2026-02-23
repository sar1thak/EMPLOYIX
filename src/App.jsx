import React, { useContext } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { getLocalStorage, setLocalStorage } from './utils/localStorage'
import { useEffect,useState } from 'react'
import { AuthContext } from './context/AuthProvider'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Employees from './pages/Employees'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'

const App = () => {

  const [user, setuser] = useState(null)
  const [LoggedInUserData, setLoggedInUserData] = useState(null)
  const [userData,setuserData] = useContext(AuthContext)

  useEffect(()=>{
    const loggedInUser = localStorage.getItem('loggedInUser')
    if(loggedInUser){
      const userData = JSON.parse(loggedInUser)
      setuser(userData.role)
      setLoggedInUserData(userData.data)
    }
  },[])
  
  

  const handleLogin = (email,password)=>{
    if(email=='admin@me.com' && password == '1234'){
      setuser('admin')
      localStorage.setItem('loggedInUser',JSON.stringify({role:'admin'}))
    }
    else if(userData){
      const employee =  userData.find((e)=>email==e.email && e.password==password)
      if(employee){
        setuser('employee')
        setLoggedInUserData(employee)
        
        localStorage.setItem('loggedInUser',JSON.stringify({role:'employee', data:employee}))

      }
      
    }
    else{
      alert("Invalid Credentials")
    }
  }
  
  

  return (
    
    <>
    {!user ? <Login handleLogin={handleLogin}/>:''}
    {user === "admin" && (
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<AdminDashboard changeUser = {setuser}/>} />
       <Route path="/employees" element={<Employees />} />
       <Route path="/tasks" element={<Tasks />} />
       <Route path="/settings" element={<Settings />} />
     </Routes>
   </BrowserRouter>
 )}

 {user === "employee" && (
   <EmployeeDashboard changeUser = {setuser} data={LoggedInUserData}/>
 )}
    </>
  )
}

export default App
