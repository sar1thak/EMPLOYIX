import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Header from '../other/Header'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const OrgEmployeeDashboard = ({ changeUser }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingTaskId, setUpdatingTaskId] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')

  const token = localStorage.getItem('authToken')

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }),
    [token]
  )

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        q: search,
        status: statusFilter,
        sortBy,
        order
      })

      const response = await fetch(`${API_BASE_URL}/api/tasks/my?${params.toString()}`, { headers: authHeaders })
      if (!response.ok) {
        throw new Error('Failed to load tasks')
      }

      const data = await response.json()
      setTasks(data)
    } catch {
      setError('Unable to load your tasks. Please retry.')
    } finally {
      setLoading(false)
    }
  }, [authHeaders, search, statusFilter, sortBy, order])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const updateStatus = async (taskId, status) => {
    setUpdatingTaskId(taskId)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.message || 'Failed to update task status')
      }

      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)))
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setUpdatingTaskId('')
    }
  }

  const taskNumbers = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        if (task.status === 'newTask') acc.newTask += 1
        if (task.status === 'active') acc.active += 1
        if (task.status === 'completed') acc.completed += 1
        if (task.status === 'failed') acc.failed += 1
        return acc
      },
      { newTask: 0, active: 0, completed: 0, failed: 0 }
    )
  }, [tasks])

  return (
    <div className="min-h-screen text-white px-12 py-10 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]">
      <Header changeUser={changeUser} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
        <div className="rounded-2xl p-7 bg-blue-500/10 border border-blue-400/20"><h2 className="text-4xl font-bold text-cyan-400">{taskNumbers.newTask}</h2><h3 className="text-sm text-white/70 mt-1 uppercase">New Task</h3></div>
        <div className="rounded-2xl p-7 bg-purple-500/10 border border-purple-400/20"><h2 className="text-4xl font-bold text-violet-400">{taskNumbers.active}</h2><h3 className="text-sm text-white/70 mt-1 uppercase">Accepted Task</h3></div>
        <div className="rounded-2xl p-7 bg-emerald-500/10 border border-emerald-400/20"><h2 className="text-4xl font-bold text-emerald-400">{taskNumbers.completed}</h2><h3 className="text-sm text-white/70 mt-1 uppercase">Completed Task</h3></div>
        <div className="rounded-2xl p-7 bg-red-500/10 border border-red-400/20"><h2 className="text-4xl font-bold text-red-400">{taskNumbers.failed}</h2><h3 className="text-sm text-white/70 mt-1 uppercase">Failed Task</h3></div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-semibold mb-3">Search / Filter / Sort</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks" className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
            <option value="all">All status</option>
            <option value="newTask">New</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
            <option value="createdAt">Newest</option>
            <option value="taskDate">Due date</option>
            <option value="status">Status</option>
            <option value="category">Category</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {error ? <p className="mt-6 text-red-400">{error}</p> : null}
      {loading ? <p className="mt-6 text-white/70">Loading tasks...</p> : null}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-3xl p-6 border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
            <div className='flex justify-between items-center mb-4'>
              <span className='text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 uppercase tracking-wide'>
                {task.category}
              </span>
              <span className='text-xs text-gray-400'>{task.taskDate}</span>
            </div>

            <h2 className='text-xl font-semibold text-white'>{task.taskTitle}</h2>
            <p className='text-gray-400 text-sm leading-relaxed mt-2'>{task.taskDescription}</p>
            <p className='text-xs text-white/60 mt-4'>Status: {task.status}</p>

            {task.status === 'newTask' ? (
              <button
                disabled={updatingTaskId === task.id}
                onClick={() => updateStatus(task.id, 'active')}
                className='w-full mt-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 disabled:opacity-50'>
                {updatingTaskId === task.id ? 'Updating...' : 'Accept Task'}
              </button>
            ) : null}

            {task.status === 'active' ? (
              <div className='flex gap-3 mt-5'>
                <button
                  disabled={updatingTaskId === task.id}
                  onClick={() => updateStatus(task.id, 'completed')}
                  className='flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-green-600 disabled:opacity-50'>
                  Complete
                </button>
                <button
                  disabled={updatingTaskId === task.id}
                  onClick={() => updateStatus(task.id, 'failed')}
                  className='flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-rose-600 disabled:opacity-50'>
                  Fail
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrgEmployeeDashboard
