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
        background: {
          color: "#050a1a", // 深空蓝黑，突出量子光点
        },
        fpsLimit: 120,
        detectRetina: true,

        particles: {
          number: {
            value: isMobile ? 100 : 180,
            density: { enable: true, area: 900 },
          },

          // ⚛️ 量子能量色
          color: {
            value: ["#ffffff", "#b8f3ff", "#7fd9ff", "#4fc3ff"],
          },

          // ✨ 量子闪烁（不规则闪烁）
          opacity: {
            value: 1,
            random: true,
            animation: {
              enable: true,
              speed: 1.2,
              minimumValue: 0.1,
              sync: false,
            },
          },

          // 🌟 粒子大小（带轻微呼吸感）
          size: {
            value: { min: 1, max: 3.5 },
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 0.5,
              sync: false,
            },
          },

          // ⚡ 量子跳跃（瞬移效果）
          move: {
            enable: true,
            speed: isMobile ? 0.4 : 0.6,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "bounce",
            },

            // 关键：量子跳跃模拟
            trail: {
              enable: true,
              length: 3,
              fillColor: "#050a1a",
            },

            // 随机瞬移
            warp: true,
          },

          // 🔗 量子态连线（更亮、更灵动）
          links: {
            enable: !isMobile,
            distance: 160,
            color: "#7fd9ff",
            opacity: 0.45,
            width: 1.1,
          },
        },

        // 🖱️ 量子交互（靠近时粒子会“塌缩”）
        interactivity: {
          events: {
            onHover: { enable: !isMobile, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            repulse: {
              distance: 180,
              duration: 0.3,
            },
            push: { quantity: isMobile ? 2 : 3 },
          },
        },
      }}
    />
  );
}