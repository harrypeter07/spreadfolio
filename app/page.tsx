"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
import Image from "next/image"
import portfolioData from "../data/portfolio.json"
import TextParallax from "@/components/TextPar"
// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

export default function Portfolio() {
  const heroRef = useRef<HTMLDivElement>(null)
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const portfolioRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const navbarRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Scroll to hero section on page load with scroll snap
    setTimeout(() => {
      if (heroRef.current) {
        heroRef.current.scrollIntoView({ 
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        })
      }
    }, 100)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Ensure ScrollTrigger is available
    if (typeof window === "undefined") return

    const ctx = gsap.context(() => {
      // Force initial background color
      gsap.set(document.body, {
        backgroundColor: "#ffffff",
        transition: "none",
      })

      // Initial setup for animations
      gsap.set(".navbar-link", { y: -30, opacity: 0 })
      gsap.set(".main-line", { scaleX: 0, opacity: 0 })
      gsap.set(".card-container", { y: isMobile ? 300 : 500, opacity: 0 })
      gsap.set(".hero-card", { 
        x: 0, 
        y: 0, 
        rotation: 0, 
        z: (index) => (index === 6 ? 100 : 50 - index),
        opacity: 1,
        scale: 1
      })
      gsap.set(".main-title", { y: 50, opacity: 0 })
      gsap.set(".description-text", { y: 20, opacity: 0 })
      gsap.set(".cta-button", { y: 20, opacity: 0 })

      // Portfolio section setup - only animate elements, not containers
      gsap.set(".portfolio-title", { y: 50, opacity: 0 })
      gsap.set(".portfolio-card", { y: isMobile ? 100 : 200, opacity: 0, scale: 0.8, rotation: isMobile ? 0 : 15 })
      gsap.set(".portfolio-line", { scaleX: 0, opacity: 0 })

      // About section setup - keep containers visible
      gsap.set(".about-title", { y: 50, opacity: 0 })
      gsap.set(".about-image", {
        x: isMobile ? 0 : -200,
        y: isMobile ? -100 : 0,
        opacity: 0,
        rotation: isMobile ? 0 : -10,
      })
      gsap.set(".about-text", { y: 30, opacity: 0 })
      gsap.set(".service-card", { y: 100, opacity: 0, scale: 0.8 })

      // Footer setup - keep containers visible
      gsap.set(".footer-title", { y: 100, opacity: 0 })
      gsap.set(".floating-icon", { y: 200, opacity: 0, scale: 0 })
      gsap.set(".footer-card", { y: 50, opacity: 0 })

      // Hero animations sequence - faster start
      const heroTl = gsap.timeline({ delay: 0.2 })

      // 1. Navbar animation
      heroTl.to(".navbar-link", {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
      })

      // 2. Main line appears
      heroTl.to(
        ".main-line",
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3",
      )

      // 3. Card container comes from bottom
      heroTl.to(
        ".card-container",
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: "back.out(1.2)",
        },
        "+=0.3",
      )

      // 4. Cards spread (restored original smooth animation)
      heroTl.to(
        ".hero-card",
        {
          x: (index) => {
            if (index === 6) return 0 // Center card stays at center
            if (isMobile) {
              // Better spaced mobile layout
              if (index === 0) return -180
              if (index === 1) return -120
              if (index === 2) return -60
              if (index === 3) return 60
              if (index === 4) return 120
              if (index === 5) return 180
              return 0 // Center card (index 6)
            } else {
              // Improved desktop spacing for rainbow effect
              if (index === 0) return -520
              if (index === 1) return -320
              if (index === 2) return -200
              if (index === 3) return 200
              if (index === 4) return 320
              if (index === 5) return 520
              return 0 // Center card (index 6)
            }
          },
          rotation: (index) => {
            if (index === 6) return 0
            if (isMobile) {
              // Very subtle rotations for mobile
              const rotations = [-1, 1, -3, 3, -4, 2, 0]
              return rotations[index] || 0
            } else {
              // Reduced desktop rotations
              if (index === 0) return -2
              if (index === 1) return 2
              if (index === 2) return -6
              if (index === 3) return 6
              if (index === 4) return -8
              if (index === 5) return 4
              return 0
            }
          },
          y: (index) => {
            if (index === 6) return 0 // Center card at normal height
            if (isMobile) {
              // Subtle rainbow arc for mobile
              if (index === 0 || index === 5) return 40 // Outermost cards lowest
              if (index === 1 || index === 4) return 20 // Middle cards slightly down
              if (index === 2 || index === 3) return 10 // Inner cards slightly down
              return 0
            } else {
              // More pronounced rainbow arc for desktop
              if (index === 0 || index === 5) return 60 // Outermost cards lowest
              if (index === 1 || index === 4) return 30 // Middle cards moderately down
              if (index === 2 || index === 3) return 15 // Inner cards slightly down
              return 0
            }
          },
          z: (index) => (index === 6 ? 100 : 50 - Math.abs(index - 3)),
          duration: 1.2,
          ease: "back.out(1.4)",
          stagger: 0.06,
        },
        "+=0.1",
      )

      // 5. Title appears
      heroTl.to(
        ".main-title",
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=1.2",
      )

      // 6. Description and button
      heroTl.to(
        ".description-text",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.3",
      )

      heroTl.to(
        ".cta-button",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4",
      )

      // Configure ScrollTrigger for custom scroll container
      ScrollTrigger.config({ 
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        limitCallbacks: true
      })

      // Set the scroll container for ScrollTrigger
      ScrollTrigger.scrollerProxy(".scroll-container", {
        scrollTop(value) {
          const container = document.querySelector('.scroll-container')
          if (arguments.length && container && typeof value === 'number') {
            container.scrollTop = value
          }
          return container?.scrollTop || 0
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
          }
        },
        pinType: "transform"
      })

      // Add debug scroll event
      const scrollContainer = document.querySelector('.scroll-container')
      scrollContainer?.addEventListener('scroll', () => {
        console.log('Scroll detected:', scrollContainer.scrollTop)
      })

      // Navbar hide/show on scroll (disabled on mobile when menu is open)
      let lastScrollY = 0
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scroller: ".scroll-container",
        onUpdate: (self) => {
          if (isMobileMenuOpen) return // Don't hide navbar when mobile menu is open

          const currentScrollY = self.scroll()
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down - hide navbar
            gsap.to(navbarRef.current, {
              y: -100,
              duration: 0.3,
              ease: "power2.out",
            })
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up - show navbar
            gsap.to(navbarRef.current, {
              y: 0,
              duration: 0.3,
              ease: "power2.out",
            })
          }
          lastScrollY = currentScrollY
        },
      })

      // Setup ScrollTriggers immediately, don't wait for hero animation
      console.log("Setting up ScrollTriggers...")

      // Background color change for Hero section
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scroller: ".scroll-container",
        onEnter: () => {
          console.log("⚪ Entering Hero - White Background")
          console.log("Hero ScrollTrigger FIRED - onEnter")
          gsap.to(document.body, {
            backgroundColor: "#ffffff",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onLeave: () => {
          console.log("🔵 Leaving Hero - Blue Background")
          gsap.to(document.body, {
            backgroundColor: "#85CBD9",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onEnterBack: () => {
          console.log("⚪ Re-entering Hero - White Background")
          gsap.to(document.body, {
            backgroundColor: "#ffffff",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onLeaveBack: () => {
          console.log("⚪ Staying Hero - White Background")
          // Keep white background when scrolling above hero
          gsap.to(document.body, {
            backgroundColor: "#ffffff",
            duration: 0.6,
            ease: "power2.out",
          })
        },
      })

      // Background color change for Portfolio section
      ScrollTrigger.create({
        trigger: portfolioRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scroller: ".scroll-container",
        onEnter: () => {
          console.log("🔵 Entering Portfolio - Blue Background")
          console.log("Portfolio ScrollTrigger FIRED - onEnter")
          gsap.to(document.body, {
            backgroundColor: "#85CBD9",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onLeave: () => {
          console.log("🟡 Leaving Portfolio - Yellow Background")
          gsap.to(document.body, {
            backgroundColor: "#FFC86D",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onEnterBack: () => {
          console.log("🔵 Re-entering Portfolio - Blue Background")
          gsap.to(document.body, {
            backgroundColor: "#85CBD9",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onLeaveBack: () => {
          console.log("⚪ Leaving Portfolio Back - White Background")
          gsap.to(document.body, {
            backgroundColor: "#ffffff",
            duration: 0.6,
            ease: "power2.out",
          })
        },
      })

      // Background color change for About section
      ScrollTrigger.create({
        trigger: aboutRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scroller: ".scroll-container",
        onEnter: () => {
          console.log("🟡 Entering About - Yellow Background")
          gsap.to(document.body, {
            backgroundColor: "#FFC86D",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onLeave: () => {
          console.log("🔴 Leaving About - Red Background")
          gsap.to(document.body, {
            backgroundColor: "#FC8585",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onEnterBack: () => {
          console.log("🟡 Re-entering About - Yellow Background")
          gsap.to(document.body, {
            backgroundColor: "#FFC86D",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onLeaveBack: () => {
          console.log("🔵 Leaving About Back - Blue Background")
          gsap.to(document.body, {
            backgroundColor: "#85CBD9",
            duration: 0.6,
            ease: "power2.out",
          })
        },
      })

      // Background color change for Footer section
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scroller: ".scroll-container",
        onEnter: () => {
          console.log("🔴 Entering Footer - Red Background")
          gsap.to(document.body, {
            backgroundColor: "#FC8585",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onLeave: () => {
          console.log("🔴 Staying Footer - Red Background")
          // Keep red background when scrolling past footer
          gsap.to(document.body, {
            backgroundColor: "#FC8585",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onEnterBack: () => {
          console.log("🔴 Re-entering Footer - Red Background")
          gsap.to(document.body, {
            backgroundColor: "#FC8585",
            duration: 0.6,
            ease: "power2.out",
          })
        },
        onLeaveBack: () => {
          console.log("🟡 Leaving Footer Back - Yellow Background")
          gsap.to(document.body, {
            backgroundColor: "#FFC86D",
            duration: 0.6,
            ease: "power2.out",
          })
        },
      })

      // Handle edge cases - top and bottom of document
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "top 100px",
        scroller: ".scroll-container",
        onEnter: () => {
          console.log("🏠 At very top - White Background")
          gsap.to(document.body, {
            backgroundColor: "#ffffff",
            duration: 0.6,
            ease: "power2.out",
          })
        },
      })



      // Simple animations for About section elements when they come into view
      ScrollTrigger.create({
        trigger: aboutRef.current,
        start: "top 80%",
        scroller: ".scroll-container",
        onEnter: () => {
          gsap.to(".about-title", { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
          gsap.to(".about-image", { x: 0, y: 0, opacity: 1, rotation: 0, duration: 1, ease: "power2.out", delay: 0.2 })
          gsap.to(".about-text", { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.4 })
          gsap.to(".service-card", { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out", stagger: 0.1, delay: 0.6 })
        }
      })

      // Simple animations for Footer section elements when they come into view
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 80%",
        scroller: ".scroll-container",
        onEnter: () => {
          gsap.to(".footer-title", { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
          gsap.to(".floating-icon", { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out", stagger: 0.1, delay: 0.2 })
          gsap.to(".footer-card", { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.4 })
        }
      })

      // Refresh ScrollTrigger after a short delay to ensure proper setup
      setTimeout(() => {
        ScrollTrigger.refresh()
        console.log("ScrollTrigger refreshed")
        console.log("Total ScrollTrigger instances:", ScrollTrigger.getAll().length)
        
        // Test if scroll container is working
        const scrollContainer = document.querySelector('.scroll-container')
        console.log("Scroll container found:", !!scrollContainer)
        console.log("Scroll container height:", scrollContainer?.scrollHeight)
        console.log("Scroll container scroll top:", scrollContainer?.scrollTop)
      }, 500)
      









    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [isMobile, isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return // Disable hover effects on mobile

    gsap.to(e.currentTarget, {
      scale: 1.08,
      rotationY: 8,
      z: 100,
      boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
      duration: 0.4,
      ease: "power2.out",
    })
  }

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return // Disable hover effects on mobile

    gsap.to(e.currentTarget, {
      scale: 1,
      rotationY: 0,
      z: 0,
      boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
      duration: 0.4,
      ease: "power2.out",
    })
  }

  const handleNavHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) return

    gsap.to(e.currentTarget.querySelector(".nav-underline"), {
      scaleX: 1,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  const handleNavLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) return

    gsap.to(e.currentTarget.querySelector(".nav-underline"), {
      scaleX: 0,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  return (
    <div className="scroll-container w-full">
      {/* Navigation */}
      <nav ref={navbarRef} className="navbar fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-lg md:text-xl font-bold text-gray-800">{portfolioData.branding.logo}</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {portfolioData.navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="navbar-link relative text-sm font-medium cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                onMouseEnter={handleNavHover}
                onMouseLeave={handleNavLeave}
              >
                {item.label}
                <div className="nav-underline absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 transform scale-x-0 origin-center"></div>
              </a>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs">🌐</span>
            </div>
            <div className="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded-full flex items-center justify-center relative">
              <span className="text-xs text-gray-800">🛒</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-800">1</span>
              </div>
            </div>

            {/* Hamburger Menu */}
            <div className="md:hidden">
              <div className={`hamburger ${isMobileMenuOpen ? "open" : ""}`} onClick={toggleMobileMenu}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div ref={mobileMenuRef} className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        {portfolioData.navigation.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className="mobile-menu-item"
            onClick={closeMobileMenu}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className="hero-section snap-section flex flex-col items-center justify-center relative px-4 z-10"
      >
        {/* Single Main Line */}
        <div className="absolute top-24 md:top-32 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
          <div className="main-line h-0.5 bg-gray-300 w-full origin-center"></div>
        </div>

        {/* Main Title */}
        <div className="main-title text-center mb-12 md:mb-20 z-20 absolute top-12 md:top-20">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-light text-gray-800 mb-1">{portfolioData.personal.title}</h1>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900">{portfolioData.personal.subtitle}</h2>
        </div>

        {/* Card Container */}
        <div
          ref={cardContainerRef}
          className="card-container relative flex justify-center items-center mb-12 md:mb-20 mt-20 md:mt-32"
          style={{ perspective: "1000px" }}
        >
          {portfolioData.skills.map((card, index) => (
            <div key={index} className="hero-card absolute">
              <div
                className="relative overflow-hidden rounded-2xl w-[120px] h-[160px] sm:w-[150px] sm:h-[200px] md:w-[180px] md:h-[240px] lg:w-[200px] lg:h-[260px]"
                style={{
                  backgroundColor: card.bg,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.1)",
                  transform: "translateZ(0)",
                }}
              >
                <Image
                  src={card.image || "/placeholder.svg"}
                  alt={card.title}
                  width={150}
                  height={200}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-sm md:text-base font-bold">{card.title}</div>
                  <div className="text-xs md:text-sm opacity-80">{card.tech}</div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Description Text */}
        <div className="description-text text-center max-w-2xl mb-6 md:mb-8 mt-8 md:mt-16 px-4">
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {portfolioData.personal.description}
          </p>
        </div>

        {/* CTA Button */}
        <button className="cta-button bg-gray-900 text-gray-800 px-6 md:px-8 py-2 md:py-3 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm md:text-base">
          View My Work
        </button>
      </section>

      {/* Portfolio Section */}
      <section 
        id="portfolio" 
        ref={portfolioRef} 
        className="portfolio-section snap-section flex flex-col justify-center relative z-10 min-h-screen"
      >
        <div className="portfolio-container w-full">
          <div className="portfolio-title text-center mb-12 md:mb-16 px-4">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-2 md:mb-4">
              My Portfolio
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Explore my creative work and projects
            </p>
          </div>
          
          <div className="portfolio-content w-full">
            <TextParallax 
              slides={[
                { 
                  text: portfolioData.projects[0]?.title || "E-Commerce Platform", 
                  image: portfolioData.projects[0]?.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop", 
                  direction: "left" 
                },
                { 
                  text: portfolioData.projects[1]?.title || "Social Media Dashboard", 
                  image: portfolioData.projects[1]?.image || "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=200&fit=crop", 
                  direction: "right" 
                },
                { 
                  text: portfolioData.projects[2]?.title || "Task Management App", 
                  image: portfolioData.projects[2]?.image || "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop", 
                  direction: "left" 
                }
              ]}
              className="w-full"
              textSize="text-4xl md:text-6xl lg:text-7xl"
              spacing="px-4 md:px-8 gap-4 md:gap-8"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="about-section snap-section flex flex-col justify-center relative z-10 min-h-screen bg-transparent">
        <div className="about-container max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20">
          <div className="about-title text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-2 md:mb-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{portfolioData.about.title}</h2>
            <p className="text-gray-600 text-base md:text-lg" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{portfolioData.about.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="about-image order-2 lg:order-1">
              <div className="about-image-container w-60 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 mx-auto lg:mx-0">
                <div className="about-image-bg absolute inset-0 bg-gradient-to-br from-[#FC8585] to-[#FFC86D] rounded-2xl md:rounded-3xl transform rotate-3"></div>
                <Image
                  src={portfolioData.about.image}
                  alt={portfolioData.about.title}
                  width={400}
                  height={500}
                  className="about-image-main relative rounded-2xl md:rounded-3xl shadow-2xl border-2 md:border-4 border-white/30 w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
              <div>
                <p className="about-text text-base md:text-xl leading-relaxed text-gray-700 mb-4 md:mb-6" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  {portfolioData.about.mainText}
                </p>
                <p className="about-text text-sm md:text-lg leading-relaxed text-gray-600" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  {portfolioData.about.secondaryText}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {portfolioData.about.services.map((service, index) => (
                  <div
                    key={index}
                    className="service-card bg-white/40 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-white/30"
                    style={{
                      border: "2px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
                    }}
                  >
                    <div className="text-xl md:text-2xl mb-1 md:mb-2">{service.icon}</div>
                    <h3 className="text-sm md:text-lg font-semibold text-gray-800" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{service.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section id="contact" ref={footerRef} className="footer-section snap-section flex items-center justify-center relative px-4 z-10 min-h-screen bg-transparent">
        <div className="footer-container text-center max-w-4xl mx-auto">
          <h2 className="footer-title text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black mb-8 md:mb-12 text-white leading-tight px-4">
            {portfolioData.branding.tagline}
          </h2>
          <div className="flex justify-center space-x-4 md:space-x-8 mb-8 md:mb-12">
            {portfolioData.footer.icons.map((icon, index) => (
              <div key={index} className="floating-icon text-2xl md:text-4xl">
                {icon}
              </div>
            ))}
          </div>
          <div
            className="footer-card bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-white/20 mx-4"
            style={{
              border: "2px solid rgba(255,255,255,0.2)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <p className="text-base md:text-xl text-white/90 mb-4 md:mb-6">{portfolioData.contact.subtitle}</p>
            <a 
              href={`mailto:${portfolioData.contact.email}`}
              className="inline-block bg-gradient-to-r from-[#FC8585] to-[#FFC86D] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {portfolioData.contact.button}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
