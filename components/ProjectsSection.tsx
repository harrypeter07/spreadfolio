'use client'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import portfolioData from '../data/portfolio.json'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const projectsRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    // GSAP animations for the projects section
    const ctx = gsap.context(() => {
      // Animate the title
      gsap.fromTo('.projects-title', 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate project items
      gsap.fromTo('.project-item', 
        { x: -100, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: projectsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Parallax effect for the background canvas
      gsap.to(canvasRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // GSAP hover effect for project images
  const handleProjectHover = (index: number, project: any) => {
    setActiveProject(index)
    
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 1,
        scale: 1.05,
        duration: 0.4,
        ease: "power2.out"
      })
      
      // Update image source
      imageRef.current.src = project.image
    }
  }

  const handleProjectLeave = () => {
    setActiveProject(null)
    
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      })
    }
  }

  return (
    <>
      <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
        {/* Background canvas with GSAP parallax */}
        <div ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 animate-pulse" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, #60A5FA 2px, transparent 2px), radial-gradient(circle at 75% 75%, #A78BFA 2px, transparent 2px)`,
                backgroundSize: '100px 100px'
              }}></div>
            </div>
            
            {/* Floating project image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                ref={imageRef}
                src={portfolioData.projects[0]?.image || ''}
                alt="Project Preview"
                className="w-96 h-96 object-cover rounded-2xl shadow-2xl opacity-0 transition-all duration-500"
                style={{
                  filter: 'brightness(0.8) contrast(1.2) saturate(1.1)',
                  transform: 'perspective(1000px) rotateY(5deg) rotateX(5deg)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Projects list overlay */}
        <div className="relative z-10 mix-blend-difference text-white h-full w-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="projects-title text-4xl md:text-6xl lg:text-8xl font-black text-center mb-16">
              Featured Projects
            </h2>
            
            <ul 
              ref={projectsRef}
              onMouseLeave={handleProjectLeave} 
              className="space-y-8"
            >
              {portfolioData.projects.map((project, index) => (
                <li 
                  key={project.title}
                  onMouseOver={() => handleProjectHover(index, project)}
                  className="project-item group cursor-pointer"
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

// Tech Stack Row Component with GSAP Parallax Effect
function TechStackRow({ skills, direction, speed, className, opacity }: { 
  skills: any[], 
  direction: 'left' | 'right', 
  speed: number,
  className: string,
  opacity: number
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!rowRef.current) return
    
    const row = rowRef.current
    
    // GSAP ScrollTrigger for parallax effect
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          const translateX = direction === 'left' 
            ? -progress * speed * 1000
            : progress * speed * 1000
          
          gsap.set(row, { x: translateX })
        }
      }
    })
    
    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [direction, speed])
  
  return (
    <div 
      ref={rowRef}
      className={`flex gap-8 md:gap-12 lg:gap-16 ${className}`}
      style={{ 
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
    </div>
  )
}
