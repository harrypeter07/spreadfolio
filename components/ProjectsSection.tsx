'use client'
import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from "framer-motion-3d"
import { animate, useMotionValue, useTransform } from 'framer-motion'
import { useTexture, useAspect } from '@react-three/drei'
import Image from 'next/image'
import portfolioData from '../data/portfolio.json'

// Shader code for the distortion effect
const vertex = `
varying vec2 vUv;
uniform vec2 uDelta;
uniform float uAmplitude;
float PI = 3.141592653589793238;

void main() {
    vUv = uv;
    vec3 newPosition = position;
    newPosition.x += sin(uv.y * PI) * uDelta.x * uAmplitude;
    newPosition.y += sin(uv.x * PI) * uDelta.y * uAmplitude;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

const fragment = `
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uAlpha;
void main() {
    vec3 texture = texture2D(uTexture, vUv).rgb;
    gl_FragColor = vec4(texture, uAlpha);
}
`

// 3D Model component for the distortion effect
function DistortionModel({ activeProject, projects }: { activeProject: number | null, projects: any[] }) {
  const plane = React.useRef<any>()
  const { viewport } = useThree()
  const mouse = useMouse()
  const opacity = useMotionValue(0)
  const textures = projects.map(project => useTexture(project.image))
  const { width, height } = textures[0]?.image || { width: 1, height: 1 }
  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a

  const scale = useAspect(width, height, 0.225)
  const smoothMouse = {
    x: useMotionValue(0),
    y: useMotionValue(0)
  }

  useEffect(() => {
    if (activeProject !== null) {
      plane.current.material.uniforms.uTexture.value = textures[activeProject]
      animate(opacity, 1, { 
        duration: 0.2, 
        onUpdate: (latest) => plane.current.material.uniforms.uAlpha.value = latest 
      })
    } else {
      animate(opacity, 0, { 
        duration: 0.2, 
        onUpdate: (latest) => plane.current.material.uniforms.uAlpha.value = latest 
      })
    }
  }, [activeProject, textures, opacity])

  const uniforms = React.useRef({
    uDelta: { value: { x: 0, y: 0 } },
    uAmplitude: { value: 0.0005 },
    uTexture: { value: textures[0] },
    uAlpha: { value: 0 }
  })

  useFrame(() => {
    const { x, y } = mouse
    const smoothX = smoothMouse.x.get()
    const smoothY = smoothMouse.y.get()

    if (Math.abs(x - smoothX) > 1) {
      smoothMouse.x.set(lerp(smoothX, x, 0.1))
      smoothMouse.y.set(lerp(smoothY, y, 0.1))
      if (plane.current?.material?.uniforms) {
        plane.current.material.uniforms.uDelta.value = {
          x: x - smoothX,
          y: -1 * (y - smoothY)
        }
      }
    }
  })

  const x = useTransform(smoothMouse.x, [0, window.innerWidth], [-1 * viewport.width / 2, viewport.width / 2])
  const y = useTransform(smoothMouse.y, [0, window.innerHeight], [viewport.height / 2, -1 * viewport.height / 2])

  return (
    <motion.mesh position-x={x} position-y={y} ref={plane} scale={scale}>
      <planeGeometry args={[1, 1, 15, 15]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms.current}
        transparent={true}
      />
    </motion.mesh>
  )
}

// Custom hooks
function useMouse() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      setMouse({
        x: clientX,
        y: clientY
      })
    }

    window.addEventListener("mousemove", mouseMove)
    return () => window.removeEventListener("mousemove", mouseMove)
  }, [])

  return mouse
}

function useThree() {
  const [viewport, setViewport] = useState({ width: 1, height: 1 })

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  return { viewport }
}

function useFrame(callback: () => void) {
  useEffect(() => {
    let animationId: number

    const animate = () => {
      callback()
      animationId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationId)
  }, [callback])
}

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<number | null>(null)

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        {/* 3D Canvas with distortion effect */}
        <div className="fixed top-0 left-0 w-full h-full z-0">
          <Canvas>
            <DistortionModel activeProject={activeProject} projects={portfolioData.projects} />
          </Canvas>
        </div>

        {/* Projects list overlay */}
        <div className="relative z-10 mix-blend-difference text-white h-full w-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-center mb-16">
              Featured Projects
            </h2>
            
            <ul 
              onMouseLeave={() => setActiveProject(null)} 
              className="space-y-8"
            >
              {portfolioData.projects.map((project, index) => (
                <li 
                  key={project.title}
                  onMouseOver={() => setActiveProject(index)}
                  className="group cursor-pointer"
                >
                  <div className="flex items-center justify-between p-6 border-t border-white/20 hover:border-white/40 transition-colors duration-300">
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-2 group-hover:text-white/80 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-lg md:text-xl lg:text-2xl text-white/70 group-hover:text-white/90 transition-colors duration-300 max-w-2xl">
                        {project.description}
                      </p>
                      <div className="text-sm md:text-base lg:text-lg text-white/60 mt-2">
                        {project.tech}
                      </div>
                    </div>
                    
                    <div className="ml-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg 
                        className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tech Stack Parallax Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3B82F6 1px, transparent 1px), radial-gradient(circle at 75% 75%, #10B981 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-16 text-gray-800">
            Tech Stack I Use
          </h2>
          
          {/* Parallax scrolling tech stack */}
          <div className="relative">
            {/* First row - moving left */}
            <div className="flex whitespace-nowrap mb-12">
              <TechStackRow 
                skills={portfolioData.skills} 
                direction="left" 
                speed={0.4}
                className="text-4xl md:text-6xl lg:text-7xl"
                opacity={0.9}
              />
            </div>
            
            {/* Second row - moving right */}
            <div className="flex whitespace-nowrap mb-12">
              <TechStackRow 
                skills={portfolioData.skills} 
                direction="right" 
                speed={0.25}
                className="text-3xl md:text-5xl lg:text-6xl"
                opacity={0.7}
              />
            </div>
            
            {/* Third row - moving left (faster) */}
            <div className="flex whitespace-nowrap">
              <TechStackRow 
                skills={portfolioData.skills} 
                direction="left" 
                speed={0.6}
                className="text-2xl md:text-4xl lg:text-5xl"
                opacity={0.5}
              />
            </div>
          </div>
          
          {/* Additional tech stack info */}
          <div className="mt-20 text-center">
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Continuously learning and adapting to new technologies to deliver cutting-edge solutions
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

// Tech Stack Row Component with Parallax Effect
function TechStackRow({ skills, direction, speed, className, opacity }: { 
  skills: any[], 
  direction: 'left' | 'right', 
  speed: number,
  className: string,
  opacity: number
}) {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const translateX = direction === 'left' 
    ? -scrollY * speed 
    : scrollY * speed
  
  return (
    <motion.div 
      className={`flex gap-8 md:gap-12 lg:gap-16 ${className}`}
      style={{ 
        transform: `translateX(${translateX}px)`,
        willChange: 'transform',
        opacity: opacity
      }}
    >
      {/* Duplicate skills for seamless loop */}
      {[...skills, ...skills, ...skills].map((skill, index) => (
        <div 
          key={`${skill.title}-${index}`}
          className="group flex items-center gap-4 md:gap-6 text-gray-700 hover:text-gray-900 transition-all duration-500 hover:scale-105 cursor-pointer"
        >
          <div className="relative">
            <span className="text-2xl md:text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-300">
              {skill.icon || '💻'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-sm"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold group-hover:text-gray-800 transition-colors duration-300">
              {skill.title}
            </span>
            <span className="text-sm md:text-base opacity-70 group-hover:opacity-90 transition-opacity duration-300">
              {skill.tech}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  )
}
