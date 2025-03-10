'use client'
import React, {useEffect, useRef, useState} from 'react';
import styled, {keyframes} from 'styled-components';

const Loader = () => {
    const [mousePos, setMousePos] = useState({x: 0, y: 0});
    const containerRef = useRef<HTMLDivElement>(null);
    const [stars, setStars] = useState<{ x: number, y: number, size: number, opacity: number }[]>([]);

    useEffect(() => {
        // Generate random stars for the galaxy background
        const newStars = Array.from({length: 100}, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.8 + 0.2
        }));
        setStars(newStars);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Calculate mouse position relative to container center
            setMousePos({
                x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
                y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
            });
        }
    };

  return (
      <StyledWrapper>
          <div
              className="loader-container"
              ref={containerRef}
              onMouseMove={handleMouseMove}
          >
              {/* Stars in the background */}
              {stars.map((star, i) => (
                  <div
                      key={i}
                      className="star"
                      style={{
                          left: `${star.x}%`,
                          top: `${star.y}%`,
                          width: `${star.size}px`,
                          height: `${star.size}px`,
                          opacity: star.opacity,
                      }}
                  />
              ))}

              <div
                  className="galaxy-container"
                  style={{
                      transform: `rotate(${mousePos.x * 10}deg) perspective(800px) rotateX(${mousePos.y * 15}deg) rotateY(${mousePos.x * 15}deg)`
                  }}
          >
                  <div className="planet"></div>
                  <div className="orbit orbit-1">
                      <div className="satellite satellite-1"></div>
                  </div>
                  <div className="orbit orbit-2">
                      <div className="satellite satellite-2"></div>
                  </div>
                  <div className="orbit orbit-3">
                      <div className="satellite satellite-3"></div>
                  </div>
                  <div className="dust-ring"></div>
              </div>

          </div>
      </StyledWrapper>
  );
}

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const rotateReverse = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

const wave = keyframes`
  0% { height: 10px; }
  20% { height: 30px; }
  40% { height: 15px; }
  60% { height: 40px; }
  80% { height: 20px; }
  100% { height: 10px; }
`;

const dotAnimation = keyframes`
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
`;

const twinkle = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 0.8; }
  100% { opacity: 0.2; }
`;

const orbitWobble = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg) scaleX(1); }
  25% { transform: translate(-50%, -50%) rotate(90deg) scaleX(0.98); }
  50% { transform: translate(-50%, -50%) rotate(180deg) scaleX(1); }
  75% { transform: translate(-50%, -50%) rotate(270deg) scaleX(0.98); }
  100% { transform: translate(-50%, -50%) rotate(360deg) scaleX(1); }
`;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: radial-gradient(ellipse at center, #0B0D17 0%, #090B13 80%, #050608 100%);
  overflow: hidden;

  .loader-container {
    position: relative;
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease;
    perspective: 1000px;
  }

  .star {
    position: absolute;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.6);
    animation: ${twinkle} 3s infinite ease-in-out;
    pointer-events: none;
  }

  .star:nth-child(odd) {
    animation-delay: 1.5s;
  }
  
  .star:nth-child(3n) {
    animation-delay: 0.7s;
  }

  .galaxy-container {
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform-style: preserve-3d;
    transition: transform 0.3s ease-out;
  }

  .planet {
    width: 50px;
    height: 50px;
    background: linear-gradient(145deg, #1F4068 0%, #0F2952 50%, #071E3D 100%);
    border-radius: 50%;
    box-shadow: 
      0 0 20px rgba(79, 172, 254, 0.6),
      inset 4px -4px 10px rgba(255, 255, 255, 0.1),
      inset -8px 4px 15px rgba(0, 0, 0, 0.8);
    animation: ${pulse} 4s infinite ease-in-out;
    position: relative;
    z-index: 2;
    
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
    }
  }

  .dust-ring {
    position: absolute;
    width: 130px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 0 20px 2px rgba(255, 165, 0, 0.2);
    background: radial-gradient(ellipse at center, rgba(255, 165, 0, 0.2) 0%, rgba(255, 165, 0, 0) 70%);
    transform: rotateX(75deg);
    z-index: 1;
    animation: ${rotate} 15s linear infinite;
  }

  .orbit {
    position: absolute;
    border: 1px dotted rgba(79, 172, 254, 0.3);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-style: preserve-3d;
    animation: ${orbitWobble} 20s linear infinite;
  }

  .orbit-1 {
    width: 100px;
    height: 100px;
    animation: ${orbitWobble} 10s linear infinite;
  }

  .orbit-2 {
    width: 150px;
    height: 150px;
    animation: ${orbitWobble} 15s linear infinite reverse;
  }

  .orbit-3 {
    width: 200px;
    height: 200px;
    animation: ${orbitWobble} 20s linear infinite;
  }

  .satellite {
    position: absolute;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
    transform-style: preserve-3d;
  }

  .satellite-1 {
    width: 12px;
    height: 12px;
    top: -6px;
    left: 44px;
    background: linear-gradient(145deg, #FF9966 0%, #FF5E62 100%);
    box-shadow: 0 0 10px rgba(255, 94, 98, 0.7);
  }

  .satellite-2 {
    width: 16px;
    height: 16px;
    top: -8px;
    left: 67px;
    background: linear-gradient(145deg, #A770EF 0%, #CF8BF3 100%);
    box-shadow: 0 0 10px rgba(167, 112, 239, 0.7);
  }

  .satellite-3 {
    width: 20px;
    height: 20px;
    top: -10px;
    left: 90px;
    background: linear-gradient(145deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%);
    box-shadow: 0 0 10px rgba(127, 127, 213, 0.7);
  }
  
  .wave-bar {
    width: 5px;
    height: 20px;
    background: linear-gradient(to top, #4facfe, #00f2fe);
    border-radius: 3px;
    box-shadow: 0 0 8px rgba(79, 172, 254, 0.6);
    animation: ${wave} 1.5s ease-in-out infinite;
  }

  .wave-bar:nth-child(2) {
    animation-delay: 0.2s;
  }

  .wave-bar:nth-child(3) {
    animation-delay: 0.4s;
  }

  .wave-bar:nth-child(4) {
    animation-delay: 0.6s;
  }

  .wave-bar:nth-child(5) {
    animation-delay: 0.8s;
  }

  .wave-bar:nth-child(6) {
    animation-delay: 1s;
  }

`;

export default Loader;