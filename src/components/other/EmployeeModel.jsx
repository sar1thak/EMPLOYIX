import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { useRef, useEffect } from "react"
import { useAnimations } from "@react-three/drei"
import { Suspense } from "react"

function Model() {
  const group = useRef()
  const { scene, animations } = useGLTF("/models/employee.glb")
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play()
    }
  }, [actions, animations])

  return <primitive ref={group} object={scene} scale={2.2} position={[0,-2,0]} />
}

export default function EmployeeModel() {
  return (
    <Canvas camera={{ position:[0,1.7,4] }}>
      <ambientLight intensity={1}/>
      <directionalLight position={[3,3,3]} intensity={4}/>
      <Suspense>
        <Model/>
      </Suspense>
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false}/>
    </Canvas>
  )
}

useGLTF.preload("/models/employee.glb")