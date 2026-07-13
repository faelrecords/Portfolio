import { useEffect, useRef } from "react";
import type { RenderQuality } from "./BlackHoleScene";

interface CosmicOverlayProps {
  quality: RenderQuality;
  reducedMotion: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  drift: number;
  phase: number;
  cool: boolean;
}

export function CosmicOverlay({ quality, reducedMotion }: CosmicOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    let startedAt = performance.now();
    let particles: Particle[] = [];

    let isHighQuality = quality === "high" || (quality === "auto" && window.innerWidth >= 820);

    const seedParticles = () => {
      const area = Math.min((width * height) / 11500, isHighQuality ? 115 : 58);
      particles = Array.from({ length: Math.max(34, Math.round(area)) }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: 0.35 + Math.random() * 1.25,
        alpha: 0.18 + Math.random() * 0.58,
        speed: 0.003 + Math.random() * 0.009,
        drift: (Math.random() - 0.5) * 0.006,
        phase: Math.random() * Math.PI * 2,
        cool: Math.random() > 0.32,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isHighQuality = quality === "high" || (quality === "auto" && width >= 820);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, isHighQuality ? 1.75 : 1.2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      seedParticles();
    };

    const drawRays = (time: number) => {
      const originX = width * 0.98;
      const originY = -height * 0.08;
      const reach = Math.hypot(width, height) * 1.35;
      const pulse = reducedMotion ? 0 : Math.sin(time * 0.00032) * 0.035;

      context.save();
      context.globalCompositeOperation = "screen";
      context.filter = `blur(${isHighQuality ? 20 : 12}px)`;

      const rays = [
        { angle: 2.1, width: 0.14, alpha: 0.075, color: "185, 210, 220" },
        { angle: 2.28, width: 0.08, alpha: 0.1, color: "131, 194, 209" },
        { angle: 2.47, width: 0.18, alpha: 0.055, color: "210, 226, 232" },
      ];

      rays.forEach((ray, index) => {
        const sway = reducedMotion ? 0 : Math.sin(time * 0.00018 + index * 1.7) * 0.025;
        const angle = ray.angle + sway + pulse;
        const gradient = context.createLinearGradient(originX, originY, originX - width, height);
        gradient.addColorStop(0, `rgba(${ray.color}, ${ray.alpha})`);
        gradient.addColorStop(0.48, `rgba(${ray.color}, ${ray.alpha * 0.48})`);
        gradient.addColorStop(1, `rgba(${ray.color}, 0)`);

        context.fillStyle = gradient;
        context.beginPath();
        context.moveTo(originX, originY);
        context.arc(originX, originY, reach, angle - ray.width, angle + ray.width);
        context.closePath();
        context.fill();
      });

      context.restore();
    };

    const drawParticles = (time: number, deltaSeconds: number) => {
      context.save();
      context.globalCompositeOperation = "screen";

      particles.forEach((particle, index) => {
        if (!reducedMotion) {
          particle.y -= particle.speed * deltaSeconds;
          particle.x += particle.drift * deltaSeconds;
          if (particle.y < -0.03) particle.y = 1.03;
          if (particle.x < -0.03) particle.x = 1.03;
          if (particle.x > 1.03) particle.x = -0.03;
        }

        const twinkle = reducedMotion ? 0.72 : 0.55 + Math.sin(time * 0.0018 + particle.phase) * 0.34;
        const alpha = Math.max(0.08, particle.alpha * twinkle);
        const x = particle.x * width;
        const y = particle.y * height;
        const color = particle.cool ? "186, 220, 230" : "238, 243, 245";

        context.fillStyle = `rgba(${color}, ${alpha})`;
        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();

        if (particle.size > 1.25 && index % 5 === 0) {
          context.strokeStyle = `rgba(${color}, ${alpha * 0.45})`;
          context.lineWidth = 0.5;
          context.beginPath();
          context.moveTo(x - particle.size * 3.2, y);
          context.lineTo(x + particle.size * 3.2, y);
          context.moveTo(x, y - particle.size * 3.2);
          context.lineTo(x, y + particle.size * 3.2);
          context.stroke();
        }
      });

      context.restore();
    };

    const render = (time: number) => {
      if (!reducedMotion && !isHighQuality && frame !== 0 && time - startedAt < 32) {
        frame = window.requestAnimationFrame(render);
        return;
      }

      const deltaSeconds = Math.min((time - startedAt) / 1000, 0.05);
      startedAt = time;
      context.clearRect(0, 0, width, height);
      drawRays(time);
      drawParticles(time, deltaSeconds);

      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };

    resize();
    render(performance.now());
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [quality, reducedMotion]);

  return <canvas ref={canvasRef} className="cosmic-overlay" aria-hidden="true" />;
}
