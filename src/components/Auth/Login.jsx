import React from 'react'
import { useState } from 'react'
import { useEffect, useRef } from "react"
import * as THREE from "three"
import googleLogo from '../../assets/google.svg'

import EmployeeModel from '../other/EmployeeModel'

const Login = ({ handleLogin, handleForgotPassword, handleGoogleLoginAdmin, handleGoogleLoginEmployee }) => {
  const mountRef = useRef(null)

  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotMsg, setForgotMsg] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoginError('')

    const result = await handleLogin(email, password)
    if (!result?.ok) {
      setLoginError(result?.message || 'Login failed')
      return
    }

    setemail('')
    setpassword('')
  }

  const forgotHandler = async (e) => {
    e.preventDefault()
    setForgotLoading(true)
    setForgotMsg('')

    try {
      const payload = await handleForgotPassword(forgotEmail)
      if (payload.resetLink) {
        setForgotMsg(`Reset link generated: ${payload.resetLink}`)
      } else {
        setForgotMsg(payload.message || 'If account exists, reset link has been generated.')
      }
    } catch (error) {
      setForgotMsg(error.message || 'Unable to generate reset link')
    } finally {
      setForgotLoading(false)
    }
  }

  useEffect(() => {
    const scene = new THREE.Scene()

    const glowLight = new THREE.PointLight('#22d3ee', 2, 100)
    glowLight.position.set(0, 0, 8)
    scene.add(glowLight)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    const mountNode = mountRef.current
    mountNode.appendChild(renderer.domElement)

    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 2000

    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.045,
      color: '#22d3ee',
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)

    scene.add(particlesMesh)

    const light = new THREE.PointLight('#00ffff', 2, 50)
    light.position.set(0, 0, 5)
    scene.add(light)

    const animate = () => {
      requestAnimationFrame(animate)
      particlesMesh.rotation.y += 0.0006
      particlesMesh.rotation.x += 0.0002
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="flex h-screen w-screen text-white relative overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/90 via-[#020617]/80 to-[#020617]/95 z-[1]" />

      <div className="w-1/2 flex items-center justify-center relative z-10">
        <div className="relative rounded-3xl px-12 py-14 w-[470px] border border-white/20 bg-white/[0.06] backdrop-blur-3xl shadow-[0_25px_70px_rgba(2,6,23,0.65)]">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/10 via-white/[0.02] to-violet-400/10" />
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              EMPLOYIX
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Manage. Track. Grow.</p>
          </div>

          <form onSubmit={submitHandler} className="relative z-10 flex flex-col gap-4">
            <input
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
              type="email"
              placeholder="Enter your email"
              className="px-5 py-4 rounded-xl bg-white/[0.06] border border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 outline-none transition"
            />

            <input
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              required
              type="password"
              placeholder="Enter your password"
              className="px-5 py-4 rounded-xl bg-white/[0.06] border border-white/20 text-white placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-400/30 outline-none transition"
            />

            {loginError ? <p className="text-sm text-red-400">{loginError}</p> : null}

            <button
              type="submit"
              className="mt-1 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:brightness-110 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] transition-all duration-300 text-white"
            >
              Login (Email/Password)
            </button>

            <button
              type="button"
              onClick={handleGoogleLoginAdmin}
              className="py-3 rounded-xl font-medium text-sm border border-cyan-300/35 bg-white/[0.05] hover:bg-cyan-500/15 transition flex items-center justify-center gap-2"
            >
              <img src={googleLogo} alt="Google" className="w-5 h-5" />
              Continue with Google as Admin
            </button>

            <button
              type="button"
              onClick={handleGoogleLoginEmployee}
              className="py-3 rounded-xl font-medium text-sm border border-emerald-300/35 bg-white/[0.05] hover:bg-emerald-500/15 transition flex items-center justify-center gap-2"
            >
              <img src={googleLogo} alt="Google" className="w-5 h-5" />
              Continue with Google as Employee
            </button>
          </form>

          <form onSubmit={forgotHandler} className="relative z-10 mt-6 border-t border-white/15 pt-4 space-y-3">
            <p className="text-xs text-white/60">Forgot password?</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter email"
                required
                className="flex-1 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/20 text-sm placeholder:text-slate-400"
              />
              <button
                disabled={forgotLoading}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/[0.08] border border-white/25 hover:bg-white/[0.14] disabled:opacity-50">
                {forgotLoading ? 'Sending...' : 'Send Link'}
              </button>
            </div>
            {forgotMsg ? <p className="text-xs text-cyan-300 break-all">{forgotMsg}</p> : null}
          </form>
        </div>
      </div>

      <div className="w-1/2 h-screen flex items-center justify-center relative z-10">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />
        <EmployeeModel />
      </div>
    </div>
  )
}

export default Login
