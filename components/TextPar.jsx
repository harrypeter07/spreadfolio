import React, { useEffect, useRef } from 'react';

const TextParallax = ({ 
  slides = [
    { text: "Front End Developer", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop", direction: "left" },
    { text: "Creative Designer", image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=200&fit=crop", direction: "right" },
    { text: "Web Developer", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop", direction: "left" }
  ],
  className = "",
  textSize = "text-7xl",
  spacing = "px-8 gap-8"
}) => {
  const containerRef = useRef();
  const scrollRef = useRef({ y: 0, progress: 0 });
  const rafRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetProgress = 0;
    let currentProgress = 0;

    const updateParallax = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate target progress with extended range for smoother animation
      targetProgress = Math.max(-0.2, Math.min(1.2, 
        (windowHeight - rect.top) / (windowHeight + containerHeight)
      ));
      
      // Smooth interpolation for buttery smooth animation
      currentProgress += (targetProgress - currentProgress) * 0.08;
      scrollRef.current.progress = currentProgress;

      // Update each slide with increased distance
      const slides = container.querySelectorAll('.parallax-slide');
      slides.forEach((slide, index) => {
        const direction = slide.dataset.direction === 'left' ? -1 : 1;
        // Increased multiplier for more dramatic movement
        const translateX = (currentProgress * 600 - 300) * direction;
        slide.style.transform = `translateX(${translateX}px)`;
        slide.style.willChange = 'transform';
      });

      // Continue animation loop
      rafRef.current = requestAnimationFrame(updateParallax);
    };

    const handleScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateParallax);
      }
    };

    // Start animation loop
    rafRef.current = requestAnimationFrame(updateParallax);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className={`overflow-hidden ${className}`}>
      {/* Spacer before */}
      <div className="h-screen" />
      
      <div ref={containerRef} className="relative space-y-16">
        {slides.map((slide, index) => (
          <Slide 
            key={index}
            text={slide.text}
            image={slide.image}
            direction={slide.direction}
            textSize={textSize}
            spacing={spacing}
            style={{
              left: index === 0 ? "-40%" : index === 1 ? "-25%" : "-75%",
              marginBottom: index < slides.length - 1 ? "8rem" : "0"
            }}
          />
        ))}
      </div>
      
      {/* Spacer after */}
      <div className="h-screen" />
    </div>
  );
};

const Slide = ({ text, image, direction, textSize, spacing, style }) => {
  return (
    <div 
      className="parallax-slide relative flex whitespace-nowrap mb-16"
      data-direction={direction}
      style={style}
    >
      <Phrase text={text} image={image} textSize={textSize} spacing={spacing} />
      <Phrase text={text} image={image} textSize={textSize} spacing={spacing} />
      <Phrase text={text} image={image} textSize={textSize} spacing={spacing} />
      <Phrase text={text} image={image} textSize={textSize} spacing={spacing} />
    </div>
  );
};

const Phrase = ({ text, image, textSize, spacing }) => {
  return (
    <div className={`flex items-center ${spacing}`}>
      <p className={`font-bold ${textSize} tracking-tight`}>{text}</p>
      <div className="relative w-36 h-18 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
        <img 
          src={image} 
          alt="parallax image" 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
    </div>
  );
};

export default TextParallax;