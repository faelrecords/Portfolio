import { Gauge, Settings2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { RenderQuality } from "./BlackHoleScene";

interface ExperienceControlsProps {
  quality: RenderQuality;
  reducedMotion: boolean;
  onQualityChange: (quality: RenderQuality) => void;
  onReducedMotionChange: (reduced: boolean) => void;
}

const qualityLabels: Array<{ value: RenderQuality; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "high", label: "Alta" },
  { value: "low", label: "Leve" },
];

export function ExperienceControls({
  quality,
  reducedMotion,
  onQualityChange,
  onReducedMotionChange,
}: ExperienceControlsProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <div className="experience-controls" ref={panelRef}>
      <button
        className="icon-button"
        type="button"
        aria-label={open ? "Fechar configurações visuais" : "Abrir configurações visuais"}
        aria-expanded={open}
        aria-controls="experience-panel"
        title="Configurações visuais"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={18} /> : <Settings2 size={18} />}
      </button>

      {open && (
        <div className="experience-panel" id="experience-panel">
          <div className="control-heading">
            <Gauge size={16} />
            <span>Qualidade gráfica</span>
          </div>
          <div className="segmented-control" role="group" aria-label="Qualidade gráfica">
            {qualityLabels.map((option) => (
              <button
                key={option.value}
                type="button"
                className={quality === option.value ? "is-active" : undefined}
                aria-pressed={quality === option.value}
                onClick={() => onQualityChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <label className="motion-toggle">
            <span>Reduzir movimento</span>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(event) => onReducedMotionChange(event.target.checked)}
            />
            <span className="toggle-track" aria-hidden="true">
              <span />
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
