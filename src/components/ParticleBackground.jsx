import React, { useState, useEffect } from 'react';

const ParticleBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕尺寸
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初始检测
    checkIsMobile();

    // 监听窗口大小变化
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // 生成粒子
  const generateParticles = () => {
    const particleCount = isMobile ? 20 : 40;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 5 + (isMobile ? 1 : 2);
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 20 + 10;
      const opacity = Math.random() * 0.5 + 0.3;
      const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push(
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            backgroundColor: color,
            opacity: opacity,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite'
          }}
        />
      );
    }

    return particles;
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        .animate-float {
          animation-name: float;
        }
      `}</style>
      {generateParticles()}
    </div>
  );
};

export default ParticleBackground;