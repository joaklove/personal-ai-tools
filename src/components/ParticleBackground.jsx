import React, { useState, useEffect } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const ParticleBackground = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [init, setInit] = useState(false);

  // 初始化粒子引擎
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

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

  // 根据屏幕尺寸调整粒子参数
  const particlesOptions = {
    fullScreen: {
      enable: true,
      zIndex: 0
    },
    particles: {
      number: {
        value: isMobile ? 60 : 120,
        density: {
          enable: true,
          value_area: isMobile ? 800 : 600
        }
      },
      color: {
        value: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']
      },
      shape: {
        type: 'circle'
      },
      opacity: {
        value: isMobile ? 0.6 : 0.8,
        random: true,
        animation: {
          enable: true,
          speed: 1.5,
          minimumValue: 0.3
        }
      },
      size: {
        value: isMobile ? 3 : 5,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: isMobile ? 1 : 2
        }
      },
      links: {
        enable: !isMobile,
        distance: 100,
        color: ['#3b82f6', '#8b5cf6'],
        opacity: 0.4,
        width: 1.5
      },
      move: {
        enable: true,
        speed: isMobile ? 1 : 2,
        direction: 'none',
        random: true,
        straight: false,
        outMode: 'out',
        bounce: false
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: !isMobile,
          mode: 'grab'
        },
        onClick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 120,
          links: {
            opacity: 0.8,
            width: 2
          }
        },
        push: {
          particles_nb: isMobile ? 4 : 8
        }
      }
    },
    detectRetina: true
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {init && <Particles options={particlesOptions} />}
    </div>
  );
};

export default ParticleBackground;