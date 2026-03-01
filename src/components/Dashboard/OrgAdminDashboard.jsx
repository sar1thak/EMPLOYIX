import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Header from '../other/Header'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const OrgAdminDashboard = ({ changeUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const [employees, setEmployees] = useState([])
  const [teamTasks, setTeamTasks] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [invites, setInvites] = useState([])
  const [auditLogs, setAuditLogs] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDate, setTaskDate] = useState('')
  const [assignedToId, setAssignedToId] = useState('')
  const [category, setCategory] = useState('')
  const [savingTask, setSavingTask] = useState(false)

  const [inviteEmail, setInviteEmail] = useState('')
  const [creatingInvite, setCreatingInvite] = useState(false)
  const [latestInviteLink, setLatestInviteLink] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const [employeeSearch, setEmployeeSearch] = useState('')
  const [employeeSortBy, setEmployeeSortBy] = useState('createdAt')
  const [employeeOrder, setEmployeeOrder] = useState('desc')

  const [taskSearch, setTaskSearch] = useState('')
  const [taskStatus, setTaskStatus] = useState('all')
  const [taskSortBy, setTaskSortBy] = useState('createdAt')
  const [taskOrder, setTaskOrder] = useState('desc')

  const [inviteSearch, setInviteSearch] = useState('')
  const [inviteStatus, setInviteStatus] = useState('all')
  const [inviteSortBy, setInviteSortBy] = useState('createdAt')
  const [inviteOrder, setInviteOrder] = useState('desc')

  const [analyticsFrom, setAnalyticsFrom] = useState('')
  const [analyticsTo, setAnalyticsTo] = useState('')

  const token = localStorage.getItem('authToken')

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }),
    [token]
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const employeeParams = new URLSearchParams({
        q: employeeSearch,
        sortBy: employeeSortBy,
        order: employeeOrder
      })

      const inviteParams = new URLSearchParams({
        q: inviteSearch,
        status: inviteStatus,
        sortBy: inviteSortBy,
        order: inviteOrder
      })

      const taskParams = new URLSearchParams({
        q: taskSearch,
        status: taskStatus,
        sortBy: taskSortBy,
        order: taskOrder
      })

      const analyticsParams = new URLSearchParams()
      if (analyticsFrom) analyticsParams.set('from', analyticsFrom)
      if (analyticsTo) analyticsParams.set('to', analyticsTo)

      const [employeesRes, teamTasksRes, analyticsRes, invitesRes, logsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/employees?${employeeParams.toString()}`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/tasks/team?${taskParams.toString()}`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/analytics/admin?${analyticsParams.toString()}`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/invitations?${inviteParams.toString()}`, { headers: authHeaders }),
        fetch(`${API_BASE_URL}/api/audit-logs?limit=30`, { headers: authHeaders })
      ])

      if (!employeesRes.ok || !teamTasksRes.ok || !analyticsRes.ok || !invitesRes.ok || !logsRes.ok) {
        throw new Error('Failed to load organization data')
      }

      const [employeesData, tasksData, analyticsData, invitesData, logsData] = await Promise.all([
        employeesRes.json(),
        teamTasksRes.json(),
        analyticsRes.json(),
        invitesRes.json(),
        logsRes.json()
      ])

      setEmployees(employeesData)
      setTeamTasks(tasksData)
      setAnalytics(analyticsData)
      setInvites(invitesData)
      setAuditLogs(logsData)
    } catch {
      setError('Unable to load organization data. Confirm backend is running and token is valid.')
    } finally {
      setLoading(false)
    }
  }, [authHeaders, employeeSearch, employeeSortBy, employeeOrder, taskSearch, taskStatus, taskSortBy, taskOrder, analyticsFrom, analyticsTo, inviteSearch, inviteStatus, inviteSortBy, inviteOrder])

  useEffect(() => {
    loadData()
  }, [loadData])

  const submitTask = async (e) => {
    e.preventDefault()
    setSavingTask(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          assignedToId,
          taskTitle,
          taskDescription,
          taskDate,
          category
        })
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to create task')
      }

      setTaskTitle('')
      setTaskDescription('')
      setTaskDate('')
      setAssignedToId('')
      setCategory('')
      await loadData()
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setSavingTask(false)
    }
  }

  const createInvite = async (e) => {
    e.preventDefault()
    setCreatingInvite(true)
    setError('')
    setLatestInviteLink('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/invitations`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ email: inviteEmail })
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to create invite')
      }

      setInviteEmail('')
      setLatestInviteLink(payload.inviteLink)
      await loadData()
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setCreatingInvite(false)
    }
  }

  const resendInvite = async (inviteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/invitations/${inviteId}/resend`, {
        method: 'POST',
        headers: authHeaders
      })
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'Unable to resend invite')
      }
      setLatestInviteLink(payload.inviteLink)
      await loadData()
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  const revokeInvite = async (inviteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/invitations/${inviteId}/revoke`, {
        method: 'POST',
        headers: authHeaders
      })
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'Unable to revoke invite')
      }
      await loadData()
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  const copyInviteLink = async () => {
    if (!latestInviteLink) {
      return
    }

    try {
      await navigator.clipboard.writeText(latestInviteLink)
      alert('Invite link copied')
    } catch {
      alert('Unable to copy invite link. Please copy manually.')
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setSavingPassword(true)
    setPasswordMsg('')
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/account/password`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'Failed to update password')
      }

      setCurrentPassword('')
      setNewPassword('')
      setPasswordMsg('Password updated successfully.')
    } catch (apiError) {
      setPasswordMsg(apiError.message)
    } finally {
      setSavingPassword(false)
    }
  }

  const totals = useMemo(() => {
    return employees.reduce(
      (acc, employee) => {
        acc.employees += 1
        acc.newTask += employee.taskNumbers.newTask
        acc.active += employee.taskNumbers.active
        acc.completed += employee.taskNumbers.completed
        acc.failed += employee.taskNumbers.failed
        return acc
      },
      { employees: 0, newTask: 0, active: 0, completed: 0, failed: 0 }
    )
  }, [employees])

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#020617] text-white">
      <aside className="w-72 border-r border-white/10 bg-[#020617]/80 p-6 hidden md:block">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Admin Dashboard</h2>
        <nav className="mt-8 space-y-3">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === 'dashboard' ? 'bg-cyan-500/20 border border-cyan-400/40' : 'bg-white/5 border border-white/10'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('invite')} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === 'invite' ? 'bg-cyan-500/20 border border-cyan-400/40' : 'bg-white/5 border border-white/10'}`}>Invite Employee</button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === 'analytics' ? 'bg-cyan-500/20 border border-cyan-400/40' : 'bg-white/5 border border-white/10'}`}>Analytics</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-3 rounded-xl ${activeTab === 'settings' ? 'bg-cyan-500/20 border border-cyan-400/40' : 'bg-white/5 border border-white/10'}`}>Settings</button>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <Header changeUser={changeUser} />

        {error ? <p className="mt-5 text-red-400">{error}</p> : null}
        {loading ? <p className="mt-6 text-white/70">Loading dashboard...</p> : null}

        {activeTab === 'dashboard' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mt-10">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5"><p className="text-sm text-white/70">Employees</p><p className="text-3xl font-bold">{totals.employees}</p></div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5"><p className="text-sm text-white/70">New</p><p className="text-3xl font-bold">{totals.newTask}</p></div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5"><p className="text-sm text-white/70">Active</p><p className="text-3xl font-bold">{totals.active}</p></div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5"><p className="text-sm text-white/70">Completed</p><p className="text-3xl font-bold">{totals.completed}</p></div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5"><p className="text-sm text-white/70">Failed</p><p className="text-3xl font-bold">{totals.failed}</p></div>
            </div>

            <div className="mt-8 p-8 rounded-2xl bg-white/5 border border-white/10 shadow-xl">
              <h2 className="text-xl font-semibold mb-5">Assign Task to Employee</h2>
              <form onSubmit={submitTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required placeholder="Task title" className="py-3 px-4 rounded-xl bg-[#0b1220] border border-white/10" />
                <input type="date" value={taskDate} onChange={(e) => setTaskDate(e.target.value)} required className="py-3 px-4 rounded-xl bg-[#0b1220] border border-white/10" />
                <select value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} required className="py-3 px-4 rounded-xl bg-[#0b1220] border border-white/10">
                  <option value="">Assign to employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>{employee.name} ({employee.email})</option>
                  ))}
                </select>
                <input value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="Category" className="py-3 px-4 rounded-xl bg-[#0b1220] border border-white/10" />
                <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} required placeholder="Task description" className="md:col-span-2 py-3 px-4 rounded-xl bg-[#0b1220] border border-white/10 min-h-[120px]" />
                <button disabled={savingTask} className="md:col-span-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 disabled:opacity-50">{savingTask ? 'Creating...' : 'Create Task'}</button>
              </form>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold mb-3">Employees (Search / Sort)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <input value={employeeSearch} onChange={(e) => setEmployeeSearch(e.target.value)} placeholder="Search employee" className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10" />
                <select value={employeeSortBy} onChange={(e) => setEmployeeSortBy(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
                  <option value="createdAt">Newest</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                </select>
                <select value={employeeOrder} onChange={(e) => setEmployeeOrder(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="grid grid-cols-5 px-8 py-4 bg-[#0f172a]/60 border-b border-white/10 text-sm font-semibold text-gray-300">
                <div>Employee</div><div className="text-center">New</div><div className="text-center">Active</div><div className="text-center">Completed</div><div className="text-center">Failed</div>
              </div>
              <div className="divide-y divide-white/5">
                {employees.map((employee) => (
                  <div key={employee.id} className="grid grid-cols-5 items-center px-8 py-4 hover:bg-white/[0.04]">
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-center">{employee.taskNumbers.newTask}</div>
                    <div className="text-center">{employee.taskNumbers.active}</div>
                    <div className="text-center">{employee.taskNumbers.completed}</div>
                    <div className="text-center">{employee.taskNumbers.failed}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold mb-3">Team Tasks (Search / Filter / Sort)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <input value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} placeholder="Search tasks" className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10" />
                <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
                  <option value="all">All status</option>
                  <option value="newTask">New</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <select value={taskSortBy} onChange={(e) => setTaskSortBy(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
                  <option value="createdAt">Newest</option>
                  <option value="taskDate">Due date</option>
                  <option value="status">Status</option>
                  <option value="category">Category</option>
                </select>
                <select value={taskOrder} onChange={(e) => setTaskOrder(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teamTasks.slice(0, 8).map((task) => (
                  <div key={task.id} className="rounded-xl border border-white/10 bg-[#0b1220] p-4">
                    <p className="text-xs text-white/60">{task.taskDate} | {task.category}</p>
                    <p className="font-semibold mt-1">{task.taskTitle}</p>
                    <p className="text-xs text-white/60 mt-1">{task.employee?.name || 'N/A'} | {task.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {activeTab === 'invite' ? (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Invite Employee</h2>
              <p className="text-sm text-white/70 mt-1">Generate an invite link. Employee must use this link for first OAuth signup.</p>
              <form className="mt-5 space-y-4" onSubmit={createInvite}>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="employee@company.com"
                  className="w-full py-3 px-4 rounded-xl bg-[#0b1220] border border-white/10"
                />
                <button disabled={creatingInvite} className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 disabled:opacity-50">
                  {creatingInvite ? 'Creating Invite...' : 'Create Invite Link'}
                </button>
              </form>
              {latestInviteLink ? (
                <div className="mt-5 rounded-xl bg-[#0b1220] border border-white/10 p-4">
                  <p className="text-xs text-white/60">Invite Link</p>
                  <p className="text-sm break-all mt-1">{latestInviteLink}</p>
                  <button onClick={copyInviteLink} className="mt-3 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/40">Copy Link</button>
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Invite History</h2>
              <div className="grid grid-cols-2 gap-3 my-4">
                <input value={inviteSearch} onChange={(e) => setInviteSearch(e.target.value)} placeholder="Search email" className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10" />
                <select value={inviteStatus} onChange={(e) => setInviteStatus(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
                  <option value="all">All status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="expired">Expired</option>
                  <option value="revoked">Revoked</option>
                </select>
                <select value={inviteSortBy} onChange={(e) => setInviteSortBy(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
                  <option value="createdAt">Created</option>
                  <option value="expiresAt">Expires</option>
                  <option value="email">Email</option>
                  <option value="status">Status</option>
                </select>
                <select value={inviteOrder} onChange={(e) => setInviteOrder(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10">
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              <div className="space-y-3 max-h-[440px] overflow-auto pr-1">
                {invites.map((invite) => (
                  <div key={invite.id} className="rounded-xl border border-white/10 bg-[#0b1220] p-4">
                    <p className="font-medium">{invite.email}</p>
                    <p className="text-xs text-white/60 mt-1">Status: {invite.status}</p>
                    <p className="text-xs text-white/60">Expires: {new Date(invite.expiresAt).toLocaleString()}</p>
                    <div className="flex gap-2 mt-3">
                      {invite.status !== 'accepted' ? (
                        <button onClick={() => resendInvite(invite.id)} className="px-3 py-1 text-xs rounded-lg bg-cyan-500/20 border border-cyan-400/40">Resend</button>
                      ) : null}
                      {invite.status === 'pending' ? (
                        <button onClick={() => revokeInvite(invite.id)} className="px-3 py-1 text-xs rounded-lg bg-red-500/20 border border-red-400/40">Revoke</button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'analytics' ? (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Overview</h2>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <input type="date" value={analyticsFrom} onChange={(e) => setAnalyticsFrom(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10" />
                <input type="date" value={analyticsTo} onChange={(e) => setAnalyticsTo(e.target.value)} className="py-2 px-3 rounded-lg bg-[#0b1220] border border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="rounded-xl bg-[#0b1220] p-4 border border-white/10"><p className="text-xs text-white/60">Employees</p><p className="text-2xl font-bold">{analytics?.employeeCount || 0}</p></div>
                <div className="rounded-xl bg-[#0b1220] p-4 border border-white/10"><p className="text-xs text-white/60">Total Tasks</p><p className="text-2xl font-bold">{analytics?.taskCount || 0}</p></div>
                <div className="rounded-xl bg-[#0b1220] p-4 border border-white/10"><p className="text-xs text-white/60">Completed</p><p className="text-2xl font-bold">{analytics?.statusCounts?.completed || 0}</p></div>
                <div className="rounded-xl bg-[#0b1220] p-4 border border-white/10"><p className="text-xs text-white/60">Failed</p><p className="text-2xl font-bold">{analytics?.statusCounts?.failed || 0}</p></div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Top Employees</h2>
              <div className="mt-4 space-y-3">
                {(analytics?.topEmployees || []).map((row, idx) => (
                  <div key={`${row.email}-${idx}`} className="rounded-xl bg-[#0b1220] border border-white/10 p-4">
                    <p className="font-medium">{row.name}</p>
                    <p className="text-xs text-white/60">{row.email}</p>
                    <p className="text-sm mt-1">Completed: {row.completed}/{row.total} ({row.completionRate}%)</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Audit Logs</h2>
              <div className="mt-4 space-y-3 max-h-[320px] overflow-auto pr-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="rounded-xl border border-white/10 bg-[#0b1220] p-4">
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-white/60 mt-1">By: {log.actor?.name || 'System'} ({log.actor?.email || 'N/A'})</p>
                    <p className="text-xs text-white/60">At: {new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'settings' ? (
          <div className="mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Account Password</h2>
            <p className="text-sm text-white/70 mt-1">Create or reset password for future email/password login.</p>
            <form className="mt-5 space-y-4" onSubmit={savePassword}>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password (required if already set)"
                className="w-full py-3 px-4 rounded-xl bg-[#0b1220] border border-white/10"
              />
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                className="w-full py-3 px-4 rounded-xl bg-[#0b1220] border border-white/10"
              />
              <button disabled={savingPassword} className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 disabled:opacity-50">
                {savingPassword ? 'Saving...' : 'Save Password'}
              </button>
            </form>
            {passwordMsg ? <p className="mt-4 text-sm text-white/80">{passwordMsg}</p> : null}
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default OrgAdminDashboard

