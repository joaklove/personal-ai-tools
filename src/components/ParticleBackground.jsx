import { useEffect, useState, useRef } from "react";

export default function ParticleBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef(null);

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

  // 量子跳跃粒子效果 - 纯Canvas实现
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 粒子配置
    const particleCount = isMobile ? 80 : 150;
    const particles = [];
    const colors = ['#ffffff', '#b8f3ff', '#7fd9ff', '#4fc3ff'];

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        blinkSpeed: Math.random() * 0.02 + 0.01,
        warpTimer: Math.random() * 1000,
        warpInterval: Math.random() * 2000 + 1000
      });
    }

    // 鼠标交互
    const mouse = {
      x: null,
      y: null,
      radius: 150
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // 量子闪烁
        particle.opacity += particle.blinkSpeed;
        if (particle.opacity > 1 || particle.opacity < 0.2) {
          particle.blinkSpeed *= -1;
        }

        // 量子跳跃（随机瞬移）
        particle.warpTimer += 16;
        if (particle.warpTimer > particle.warpInterval) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.warpTimer = 0;
          particle.warpInterval = Math.random() * 2000 + 1000;
        }

        // 鼠标交互（粒子避开鼠标）
        if (mouse.x && mouse.y) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            particle.x += forceDirectionX * force * 2;
            particle.y += forceDirectionY * force * 2;
          }
        }

        // 粒子移动
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // 绘制粒子连线（仅桌面端）
        if (!isMobile) {
          particles.slice(index + 1).forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 160) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(127, 217, 255, ${0.2 * (1 - distance / 160)})`;
              ctx.lineWidth = 1;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          });
        }
      });

      requestAnimationFrame(animate);
    };

    // 启动动画
    const animationId = requestAnimationFrame(animate);

    // 窗口大小变化时重新调整画布尺寸
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 清理
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', () => {});
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      id="tsparticles"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundColor: '#050a1a',
      }}
    />
  );
}