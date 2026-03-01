import React, { useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import OrgAdminDashboard from './components/Dashboard/OrgAdminDashboard'
import OrgEmployeeDashboard from './components/Dashboard/OrgEmployeeDashboard'
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const readPersistedAuth = () => {
  try {
    const loggedInUser = localStorage.getItem('loggedInUser')
    if (!loggedInUser) {
      return { role: null, data: null, authMode: 'legacy' }
    }

    const parsed = JSON.parse(loggedInUser)

    return {
      role: parsed.role || null,
      data: parsed.data || null,
      authMode: parsed.authMode || 'legacy'
    }
  } catch {
    return { role: null, data: null, authMode: 'legacy' }
  }
}

const InviteSignup = () => {
  const [searchParams] = useSearchParams()
  const [inviteState, setInviteState] = useState({ loading: true, valid: false, email: '', message: '' })

  const token = searchParams.get('token')

  useEffect(() => {
    const validateInvite = async () => {
      if (!token) {
        setInviteState({ loading: false, valid: false, email: '', message: 'Invite token is missing.' })
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/invitations/validate?token=${encodeURIComponent(token)}`)
        const data = await response.json()

        if (!response.ok || !data.valid) {
          setInviteState({ loading: false, valid: false, email: '', message: data.message || 'Invite is invalid or expired.' })
          return
        }

        setInviteState({ loading: false, valid: true, email: data.email, message: '' })
      } catch {
        setInviteState({ loading: false, valid: false, email: '', message: 'Unable to validate invite. Please try again.' })
      }
    }

    validateInvite()
  }, [token])

  const continueWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/google?role=employee&inviteToken=${encodeURIComponent(token)}`
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#020617] text-white px-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <h1 className="text-3xl font-bold">Employee Invite</h1>

        {inviteState.loading ? <p className="mt-4 text-white/70">Validating invite...</p> : null}

        {!inviteState.loading && inviteState.valid ? (
          <>
            <p className="mt-4 text-white/70">This invite is for:</p>
            <p className="mt-1 text-cyan-300 font-medium">{inviteState.email}</p>
            <button
              onClick={continueWithGoogle}
              className="mt-6 w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500">
              Continue with Google as Employee
            </button>
          </>
        ) : null}

        {!inviteState.loading && !inviteState.valid ? (
          <p className="mt-4 text-red-400">{inviteState.message}</p>
        ) : null}
      </div>
    </div>
  )
}

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'Unable to reset password')
      }

      setMessage('Password reset successful. You can now login with email and password.')
      setNewPassword('')
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#020617] text-white px-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <p className="text-white/70 mt-2 text-sm">Set a new password for your account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleReset}>
          <input
            type="password"
            minLength={8}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 8 chars)"
            className="w-full py-3 px-4 rounded-xl bg-[#0b1220] border border-white/10"
          />
          <button disabled={saving || !token} className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 disabled:opacity-50">
            {saving ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {!token ? <p className="mt-4 text-red-400">Reset token is missing.</p> : null}
        {message ? <p className="mt-4 text-emerald-300">{message}</p> : null}
        {error ? <p className="mt-4 text-red-400">{error}</p> : null}
      </div>
    </div>
  )
}

const AuthSuccess = ({ onSuccess }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setError('Missing token from OAuth callback')
      return
    }

    const loadUser = async () => {
      try {
        localStorage.setItem('authToken', token)

        const response = await fetch(`${API_BASE_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load user profile')
        }

        const profile = await response.json()
        onSuccess(profile)
        navigate('/')
      } catch {
        localStorage.removeItem('authToken')
        setError('OAuth login completed but profile fetch failed. Check backend and token.')
      }
    }

    loadUser()
  }, [navigate, onSuccess, searchParams])

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#020617] text-white px-6 text-center">
        <div className="max-w-xl">
          <h1 className="text-2xl font-semibold">Sign-in failed</h1>
          <p className="mt-3 text-white/70">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#020617] text-white px-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Completing sign-in...</h1>
        <p className="mt-3 text-white/70">Fetching your profile from server.</p>
      </div>
    </div>
  )
}

const AppRoutes = () => {
  const persistedAuth = readPersistedAuth()
  const [user, setUser] = useState(persistedAuth.role)

  const completeOrgLogin = (profile, mode = 'org') => {
    setUser(profile.role)
    localStorage.setItem('loggedInUser', JSON.stringify({ role: profile.role, data: profile, authMode: mode }))
  }

  const handleCredentialLogin = async (email, password) => {
    try {
      const loginResponse = await fetch(`${API_BASE_URL}/auth/local-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (loginResponse.ok) {
        const loginData = await loginResponse.json()
        localStorage.setItem('authToken', loginData.token)

        const profileResponse = await fetch(`${API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${loginData.token}` }
        })

        if (!profileResponse.ok) {
          throw new Error('Profile fetch failed')
        }

        const profile = await profileResponse.json()
        completeOrgLogin(profile, 'org')
        return { ok: true }
      }
    } catch {
      localStorage.removeItem('authToken')
    }

    return { ok: false, message: 'Invalid credentials' }
  }

  const handleForgotPassword = async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    const payload = await response.json()
    if (!response.ok) {
      throw new Error(payload.message || 'Unable to process forgot password request')
    }

    return payload
  }

  const handleGoogleLogin = (role) => {
    window.location.href = `${API_BASE_URL}/auth/google?role=${role}`
  }

  const handleOAuthSuccess = (profile) => {
    completeOrgLogin(profile, 'oauth')
  }

  const renderRoleRoutes = () => {
    if (!user) {
      return (
        <>
          <Route path="/invite" element={<InviteSignup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="*"
            element={
              <Login
                handleLogin={handleCredentialLogin}
                handleForgotPassword={handleForgotPassword}
                handleGoogleLoginAdmin={() => handleGoogleLogin('admin')}
                handleGoogleLoginEmployee={() => handleGoogleLogin('employee')}
              />
            }
          />
        </>
      )
    }

    if (user === 'admin') {
      return (
        <>
          <Route path="/" element={<OrgAdminDashboard changeUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )
    }

    if (user === 'employee') {
      return (
        <>
          <Route path="/" element={<OrgEmployeeDashboard changeUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )
    }

    return <Route path="*" element={<Navigate to="/" replace />} />
  }

  return (
    <Routes>
      <Route path="/auth/success" element={<AuthSuccess onSuccess={handleOAuthSuccess} />} />
      {renderRoleRoutes()}
    </Routes>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
