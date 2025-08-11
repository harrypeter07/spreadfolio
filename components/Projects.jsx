import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const MouseImageDistortion = ({ 
  projects = [
    { title: "Richard Gaston", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center" },
    { title: "KangHee Kim", src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop&crop=center" },
    { title: "Inka and Niclas", src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop&crop=center" },
    { title: "Arch McLeish", src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop&crop=center" },
    { title: "Nadir Bucan", src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop&crop=center" },
    { title: "Chandler Bondurant", src: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&h=600&fit=crop&crop=center" },
    { title: "Arianna Lago", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=center" }
  ],
  className = "",
  textSize = "text-4xl md:text-6xl lg:text-7xl",
  imageSize = { width: 300, height: 200 }
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [smoothMouse, setSmoothMouse] = useState({ x: 0, y: 0 });
  const [imageDelta, setImageDelta] = useState({ x: 0, y: 0 });
  const [isInViewport, setIsInViewport] = useState(false);
  const imageRef = useRef();
  const containerRef = useRef();
  const animationRef = useRef();

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;
        
        // Only track mouse when it's within the container bounds
        if (relativeX >= 0 && relativeX <= rect.width && relativeY >= 0 && relativeY <= rect.height) {
          setMouse({ x: relativeX, y: relativeY });
        } else {
          // Hide image when mouse is outside container
          setActiveMenu(null);
        }
      }
    };

    const handleMouseLeave = () => {
      setActiveMenu(null);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // Smooth mouse animation and distortion effect
  useEffect(() => {
    const animate = () => {
      setSmoothMouse(prev => {
        const deltaX = mouse.x - prev.x;
        const deltaY = mouse.y - prev.y;
        
        // Only update if there's significant movement
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
          const newX = prev.x + deltaX * 0.1;
          const newY = prev.y + deltaY * 0.1;
          
          // Calculate distortion delta
          setImageDelta({
            x: deltaX * 0.5,
            y: deltaY * 0.5
          });
          
          return { x: newX, y: newY };
        }
        return prev;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mouse]);

  // Update image position and opacity
  useEffect(() => {
    if (imageRef.current && containerRef.current) {
      const image = imageRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      if (activeMenu !== null) {
        image.style.opacity = '1';
        
        // Calculate position relative to container
        const imageX = Math.max(0, Math.min(containerRect.width - imageSize.width, smoothMouse.x - imageSize.width / 2));
        const imageY = Math.max(0, Math.min(containerRect.height - imageSize.height, smoothMouse.y - imageSize.height / 2));
        
        image.style.left = `${imageX}px`;
        image.style.top = `${imageY}px`;
        
        // Apply distortion transform
        const distortionX = imageDelta.x * 0.02;
        const distortionY = imageDelta.y * 0.02;
        image.style.transform = `skew(${distortionX}deg, ${distortionY}deg) scale(${1 + Math.abs(distortionX) * 0.01})`;
      } else {
        image.style.opacity = '0';
      }
    }
  }, [activeMenu, smoothMouse, imageDelta, imageSize]);

  return (
    <div 
      className={`relative overflow-visible w-full h-full ${className}`} 
      ref={containerRef} 
      style={{ 
        contain: 'layout style paint',
        zIndex: 20,
        position: 'relative'
      }}
    >
      {/* Projects List */}
      <div 
        className="relative z-10 text-gray-800 w-full h-full bg-white/95 backdrop-blur-sm rounded-lg border border-gray-300 shadow-lg p-4"
        style={{ zIndex: 15 }}
      >
        <ul 
          onMouseLeave={() => setActiveMenu(null)} 
          className="border-b border-gray-200"
        >
          {projects.map((project, i) => (
            <li
              key={project.title}
              onMouseEnter={() => setActiveMenu(i)}
              className={`${textSize} p-6 border-t border-gray-200 cursor-pointer transition-all duration-300 hover:bg-gray-50 hover:pl-8 group flex items-center justify-between`}
            >
              <p className="font-light tracking-wide">{project.title}</p>
              <ArrowUpRight 
                className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:scale-110 text-gray-600" 
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Floating Distorted Image */}
      <div
        ref={imageRef}
        className="absolute pointer-events-none z-20 transition-opacity duration-200 ease-out overflow-hidden"
        style={{
          width: `${imageSize.width}px`,
          height: `${imageSize.height}px`,
          opacity: 0,
          maxWidth: '100%',
          maxHeight: '100%',
          zIndex: 25,
        }}
      >
        {activeMenu !== null && (
          <img
            src={projects[activeMenu]?.src}
            alt={projects[activeMenu]?.title}
            className="w-full h-full object-cover rounded-lg shadow-2xl"
            style={{
              filter: `brightness(1.1) contrast(1.1) saturate(1.2)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MouseImageDistortion;