import { useEffect, useRef, useState } from "react";

export default function AuthBackground() {
  const canvasRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "rgba(255,59,48,", "rgba(10,132,255,", "rgba(245,166,35,",
      "rgba(48,209,88,", "rgba(191,90,242,", "rgba(255,255,255,",
    ];

    for (let i = 0; i < 50; i++) {
      const depth = Math.random();
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 1.5 + depth * 4,
        speedY: -(0.15 + depth * 0.6),
        speedX: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.1 + depth * 0.35,
        depth,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulse += p.pulseSpeed;
        const currentAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        const glow = p.size * 3;

        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
        grad.addColorStop(0, p.color + currentAlpha + ")");
        grad.addColorStop(1, p.color + "0)");
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = p.color + currentAlpha + ")";
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const px = (mouse.x - 0.5) * 20;
  const py = (mouse.y - 0.5) * 20;

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0, background: "#06060f" }}>
      <div
        className="auth-mesh absolute"
        style={{
          inset: "-60px",
          transform: `translate(${px * 0.15}px, ${py * 0.15}px)`,
        }}
      />
      <div
        className="auth-grid absolute inset-0"
        style={{
          transform: `translate(${px * 0.3}px, ${py * 0.3}px)`,
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${px * 0.7}px, ${py * 0.7}px)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #00d4ff06 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #a855f706 0%, transparent 50%), radial-gradient(ellipse at center, transparent 30%, #06060fcc 100%)",
        }}
      />
    </div>
  );
}