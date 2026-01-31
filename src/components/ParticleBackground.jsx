import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleBackground() {
  const [engineReady, setEngineReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
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

  if (!engineReady) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        background: { color: "#000000" },
        fpsLimit: 120,
        detectRetina: true,

        particles: {
          number: {
            value: isMobile ? 100 : 220,
            density: { enable: true, area: 900 },
          },

          // 🌌 星空粒子颜色（AI 科技蓝）
          color: { value: ["#66ccff", "#99e0ff", "#ffffff"] },

          // ✨ 星云光晕效果
          opacity: {
            value: 0.7,
            random: true,
            animation: {
              enable: true,
              speed: 0.4,
              minimumValue: 0.2,
            },
          },

          // 🌟 粒子大小
          size: {
            value: { min: 0.5, max: 3 },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 0.3,
            },
          },

          // 🔗 AI 神经网络连线
          links: {
            enable: !isMobile,
            distance: 160,
            color: "#66ccff",
            opacity: 0.35,
            width: 1,
          },

          // 🌀 星轨运动（轻微旋转 + 漂移）
          move: {
            enable: true,
            speed: isMobile ? 0.3 : 0.6,
            direction: "none",
            random: false,
            straight: false,
            outModes: "bounce",
            attract: {
              enable: true,
              rotateX: 3000,
              rotateY: 3000,
            },
          },
        },

        // 🖱️ 智能交互
        interactivity: {
          events: {
            onHover: { enable: !isMobile, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            repulse: { distance: 150, duration: 0.4 },
            push: { quantity: isMobile ? 2 : 4 },
          },
        },
      }}
    />
  );
}