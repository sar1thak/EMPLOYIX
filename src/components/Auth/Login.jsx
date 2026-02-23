import React from 'react'
import { useState } from 'react'
import { useEffect, useRef } from "react"
import * as THREE from "three"

import EmployeeModel from '../other/EmployeeModel'



const Login = ({ handleLogin }) => {

    const mountRef = useRef(null)


    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const submitHandler = (e) => {
        e.preventDefault()
        handleLogin(email, password)

        setemail("")
        setpassword("")


    }

    useEffect(() => {
    const scene = new THREE.Scene()

    const glowLight = new THREE.PointLight("#22d3ee", 2, 100)
    glowLight.position.set(0, 0, 8)
    scene.add(glowLight)

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    mountRef.current.appendChild(renderer.domElement)

    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 2000

    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20
    }

    particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(posArray, 3)
    )

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.045,          
        color: "#22d3ee",     
        transparent: true,
        opacity: 0.9,
        depthWrite: false
    })

    const particlesMesh = new THREE.Points(
        particlesGeometry,
        particlesMaterial
    )

    scene.add(particlesMesh)

    const light = new THREE.PointLight("#00ffff", 2, 50)
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
    window.addEventListener("resize", handleResize)

    return () => {
        window.removeEventListener("resize", handleResize)
        if (mountRef.current && renderer.domElement) {
            mountRef.current.removeChild(renderer.domElement)
        }
    }
}, [])


    return (
        <div className="flex h-screen w-screen text-white relative overflow-hidden">

    <div ref={mountRef} className="absolute inset-0 z-0" />

    <div className="absolute inset-0 
bg-gradient-to-br from-[#020617]/90 via-[#020617]/80 to-[#020617]/95 
z-[1]" />

    <div className="w-1/2 flex items-center justify-center relative z-10">

      <div className="backdrop-blur-2xl bg-white/[0.03] 
      border border-white/10 shadow-[0_0_80px_rgba(0,255,255,0.15)]
      rounded-3xl px-12 py-14 w-[420px]">

        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            EMPLOYIX
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Manage. Track. Grow.
          </p>
        </div>

        <form onSubmit={submitHandler} className="flex flex-col gap-5">

          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
            type="email"
            placeholder="Enter your email"
            className="px-5 py-4 rounded-xl bg-[#0b1220] border border-white/10 text-white
            focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
          />

          <input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
            type="password"
            placeholder="Enter your password"
            className="px-5 py-4 rounded-xl bg-[#0b1220] border border-white/10 text-white
            focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition"
          />

          <button
            type="submit"
            className="mt-3 py-4 rounded-xl font-semibold text-lg
            bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600
            hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-500/30
            active:scale-[0.98]
            transition-all duration-300 text-white"
          >
            Login
          </button>

        </form>
      </div>
    </div>

    
    <div className="w-1/2 h-screen flex items-center justify-center relative z-10">

      
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full"/>

      <EmployeeModel />

    </div>

  </div>
    )
}

export default Login
