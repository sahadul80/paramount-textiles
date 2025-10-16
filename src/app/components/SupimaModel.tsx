'use client'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group, Object3DEventMap } from 'three'
import { Suspense } from 'react'

function Model() {
  const gltf = useGLTF('/supima.glb')
  
  useFrame((state, delta) => {
    if (gltf.scene) {
      gltf.scene.rotation.y += delta * 0.5
    }
  })

  return (
    <primitive 
      object={gltf.scene as Group<Object3DEventMap>} 
      scale={2} 
      position={[0, 0, 0]}
    />
  )
}

// Three.js compatible loading component
function ModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  )
}

export default function SupimaModel() {
  return (
    <Suspense fallback={<ModelFallback />}>
      <Model />
    </Suspense>
  )
}

// Preload the model
useGLTF.preload('/supima.glb')