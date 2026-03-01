import React, { useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const getUsername = () => {
  try {
    const loggedInUser = localStorage.getItem('loggedInUser')

    if (!loggedInUser) {
      return 'User'
    }

    const parsedUser = JSON.parse(loggedInUser)

    if ((parsedUser.authMode === 'oauth' || parsedUser.authMode === 'org') && parsedUser.data) {
      return parsedUser.data.name || parsedUser.data.email || 'User'
    }

    if (parsedUser.role === 'admin') {
      return 'Admin'
    }

    if (parsedUser.role === 'employee' && parsedUser.data) {
      return parsedUser.data.firstname || 'Employee'
    }
  } catch {
    return 'User'
  }

  return 'User'
}

const Header = (props) => {
  const [openNotifications, setOpenNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const token = localStorage.getItem('authToken')

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }),
    [token]
  )

  const loadNotifications = async () => {
    if (!token) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/my?limit=20`, { headers: authHeaders })
      if (!response.ok) {
        return
      }

      const payload = await response.json()
      setNotifications(payload.items || [])
      setUnreadCount(payload.unreadCount || 0)
    } catch {
      setNotifications([])
      setUnreadCount(0)
    }
  }

  const toggleNotifications = async () => {
    const next = !openNotifications
    setOpenNotifications(next)
    if (next) {
      await loadNotifications()
    }
  }

  const markRead = async (notificationId) => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: authHeaders
      })
      await loadNotifications()
    } catch {
      // Ignore errors for notification updates.
    }
  }

  const markAllRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: authHeaders
      })
      await loadNotifications()
    } catch {
      // Ignore errors for notification updates.
    }
  }

  const logOutUser = () => {
    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('authToken')
    props.changeUser('')
  }

  return (
    <div className='flex items-center justify-between bg-white/5 border border-white/10 backdrop-blur-lg px-8 py-6 rounded-2xl shadow-lg relative'>
      <h1 className='text-2xl font-medium'>
        Hello <br />
        <span className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
          {getUsername()}
        </span>
      </h1>

      <div className='flex items-center gap-3'>
        {token ? (
          <div className='relative'>
            <button
              onClick={toggleNotifications}
              className='px-4 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-sm'>
              Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>

            {openNotifications ? (
              <div className='absolute right-0 mt-2 w-[360px] rounded-2xl border border-white/10 bg-[#0b1220] shadow-xl z-20'>
                <div className='flex items-center justify-between px-4 py-3 border-b border-white/10'>
                  <p className='font-semibold'>Notifications</p>
                  <button onClick={markAllRead} className='text-xs text-cyan-300'>Mark all read</button>
                </div>
                <div className='max-h-80 overflow-auto'>
                  {notifications.length === 0 ? (
                    <p className='px-4 py-6 text-sm text-white/60'>No notifications yet.</p>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => markRead(item.id)}
                        className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 ${item.isRead ? 'opacity-70' : 'opacity-100'}`}>
                        <p className='text-sm font-medium'>{item.title}</p>
                        <p className='text-xs text-white/70 mt-1'>{item.message}</p>
                        <p className='text-[11px] text-white/50 mt-1'>{new Date(item.createdAt).toLocaleString()}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <button
          onClick={logOutUser}
          className='bg-gradient-to-r from-red-500 to-red-600
          hover:from-red-600 hover:to-red-700
          px-6 py-2 rounded-xl font-semibold
          shadow-lg hover:shadow-red-500/30
          transition-all duration-300'>
          Log Out
        </button>
      </div>
    </div>
  )
}

export default Header
