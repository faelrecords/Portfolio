import { useEffect, useRef } from "react";
import type { RenderQuality } from "./BlackHoleScene";

interface GalaxyFieldProps {
  quality: RenderQuality;
  reducedMotion: boolean;
}

interface GalaxyStar {
  radius: number;
  angle: number;
  depth: number;
  size: number;
  alpha: number;
  phase: number;
  offsetX: number;
  offsetY: number;
  velocityX: number;
  velocityY: number;
}

export function GalaxyField({ quality, reducedMotion }: GalaxyFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !section || !context) return;

    let width = section.clientWidth;
    let height = section.clientHeight;
    let stars: GalaxyStar[] = [];
    let animationFrame = 0;
    let lastRenderedAt = performance.now();
    let mouseX = -1000;
    let mouseY = -1000;
    let pointerActive = false;
    let highQuality = quality === "high" || (quality === "auto" && window.innerWidth >= 820);

    const createStars = () => {
      const count = Math.min(highQuality ? 240 : 110, Math.max(64, Math.round((width * height) / 7200)));
      stars = Array.from({ length: count }, () => ({
        radius: Math.pow(Math.random(), 0.64),
        angle: Math.random() * Math.PI * 2,
        depth: 0.35 + Math.random() * 0.95,
        size: 0.35 + Math.random() * 1.45,
        alpha: 0.16 + Math.random() * 0.62,
        phase: Math.random() * Math.PI * 2,
        offsetX: 0,
        offsetY: 0,
        velocityX: 0,
        velocityY: 0,
      }));
    };

    const resize = () => {
      width = section.clientWidth;
      height = section.clientHeight;
      highQuality = quality === "high" || (quality === "auto" && window.innerWidth >= 820);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, highQuality ? 1.6 : 1.15);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createStars();
    };

    const updatePointer = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType === "touch") return;
      const bounds = section.getBoundingClientRect();
      pointerActive =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      mouseX = event.clientX - bounds.left;
      mouseY = event.clientY - bounds.top;
    };

    const clearPointer = () => {
      pointerActive = false;
    };

    const drawGalaxyGlow = () => {
      const centerX = width * 0.62;
      const centerY = height * 0.42;
      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.62);
      glow.addColorStop(0, "rgba(131, 194, 209, 0.085)");
      glow.addColorStop(0.35, "rgba(82, 120, 135, 0.035)");
      glow.addColorStop(1, "rgba(5, 5, 6, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    };

    const render = (time: number) => {
      if (!reducedMotion && !highQuality && animationFrame !== 0 && time - lastRenderedAt < 32) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }

      const delta = Math.min((time - lastRenderedAt) / 1000, 0.05);
      lastRenderedAt = time;
      context.clearRect(0, 0, width, height);
      drawGalaxyGlow();

      const centerX = width * 0.62;
      const centerY = height * 0.42;
      const radiusX = width * 0.7;
      const radiusY = Math.max(height * 0.48, 420);

      context.save();
      context.globalCompositeOperation = "screen";

      stars.forEach((star, index) => {
        if (!reducedMotion) star.angle += delta * 0.018 * (1.35 - star.depth);

        const spiral = star.angle + star.radius * 4.2;
        const baseX = centerX + Math.cos(spiral) * star.radius * radiusX;
        const baseY = centerY + Math.sin(spiral) * star.radius * radiusY * (0.38 + star.depth * 0.36);
        const currentX = baseX + star.offsetX;
        const currentY = baseY + star.offsetY;

        if (!reducedMotion && pointerActive) {
          const differenceX = currentX - mouseX;
          const differenceY = currentY - mouseY;
          const distance = Math.hypot(differenceX, differenceY);
          const repulsionRadius = 132;

          if (distance > 0 && distance < repulsionRadius) {
            const force = Math.pow((repulsionRadius - distance) / repulsionRadius, 1.7) * 78;
            star.velocityX += (differenceX / distance) * force * delta;
            star.velocityY += (differenceY / distance) * force * delta;
          }
        }

        if (!reducedMotion) {
          star.velocityX += -star.offsetX * 4.2 * delta;
          star.velocityY += -star.offsetY * 4.2 * delta;
          const damping = Math.pow(0.82, delta * 60);
          star.velocityX *= damping;
          star.velocityY *= damping;
          star.offsetX += star.velocityX;
          star.offsetY += star.velocityY;
        }

        if (currentX < -20 || currentX > width + 20 || currentY < -20 || currentY > height + 20) return;

        const twinkle = reducedMotion ? 0.75 : 0.72 + Math.sin(time * 0.0016 + star.phase) * 0.22;
        const alpha = Math.max(0.06, star.alpha * twinkle);
        const size = star.size * star.depth;
        const cool = index % 5 === 0;
        const color = cool ? "167, 213, 224" : "228, 238, 242";

        context.fillStyle = `rgba(${color}, ${alpha})`;
        context.shadowColor = `rgba(${color}, ${alpha * 0.55})`;
        context.shadowBlur = size > 1.05 ? 5 : 0;
        context.beginPath();
        context.arc(currentX, currentY, size, 0, Math.PI * 2);
        context.fill();

        if (size > 1.1 && index % 9 === 0) {
          context.strokeStyle = `rgba(${color}, ${alpha * 0.38})`;
          context.lineWidth = 0.5;
          context.beginPath();
          context.moveTo(currentX - size * 3.5, currentY);
          context.lineTo(currentX + size * 3.5, currentY);
          context.moveTo(currentX, currentY - size * 3.5);
          context.lineTo(currentX, currentY + size * 3.5);
          context.stroke();
        }
      });

      context.restore();
      if (!reducedMotion) animationFrame = window.requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("blur", clearPointer);
    resize();
    render(performance.now());

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("blur", clearPointer);
    };
  }, [quality, reducedMotion]);

  return <canvas ref={canvasRef} className="projects-galaxy" aria-hidden="true" />;
}
