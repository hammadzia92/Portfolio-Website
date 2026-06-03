"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  MousePointer2,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Hash,
  Layers,
} from "lucide-react";
import ArtboardContent from "./ArtboardContent";

interface DesignFileModeProps {
  onSwitchMode: () => void;
}

interface ArtboardDef {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const ARTBOARDS: ArtboardDef[] = [
  { id: "about",      label: "About",          x: 0,     y: 0,     width: 340, height: 280 },
  { id: "ai-fiesta",  label: "AI Fiesta",      x: -480,  y: -320,  width: 340, height: 380 },
  { id: "tagmango",   label: "TagMango",       x: 0,     y: -380,  width: 340, height: 380 },
  { id: "asseteye",   label: "AssetEye",       x: 480,   y: -320,  width: 340, height: 380 },
  { id: "nuros-ai",   label: "Nuros AI",       x: -480,  y: 320,   width: 340, height: 380 },
  { id: "posture-pal",label: "Posture Pal",    x: 0,     y: 400,   width: 340, height: 380 },
  { id: "framix",     label: "Framix",         x: 480,   y: 320,   width: 340, height: 380 },
  { id: "experience", label: "Experience",     x: 960,   y: 0,     width: 360, height: 400 },
  { id: "skills",     label: "Skills",         x: 960,   y: -400,  width: 320, height: 260 },
  { id: "contact",    label: "Contact",        x: -960,  y: 0,     width: 300, height: 260 },
  { id: "philosophy", label: "Philosophy",     x: -960,  y: 340,   width: 320, height: 360 },
];

export default function DesignFileMode({ onSwitchMode }: DesignFileModeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.8);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [toolMode, setToolMode] = useState<"pointer" | "hand">("hand");
  const [hoveredArtboard, setHoveredArtboard] = useState<string | null>(null);
  const [layersExpanded, setLayersExpanded] = useState(true);
  const [artboardVisibility, setArtboardVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(ARTBOARDS.map((a) => [a.id, true]))
  );

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: rect.height / 2 });
    }
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a") || target.closest("[data-no-drag]")) return;
      if (toolMode === "pointer" && !e.shiftKey) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    },
    [pan, toolMode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.min(Math.max(prev + -e.deltaY * 0.001, 0.15), 3));
  }, []);

  const focusArtboard = useCallback((artboard: ArtboardDef) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const z = 0.9;
    setPan({ x: rect.width / 2 - artboard.x * z, y: rect.height / 2 - artboard.y * z });
    setZoom(z);
  }, []);

  const fitAll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPan({ x: rect.width / 2, y: rect.height / 2 });
    setZoom(0.38);
  }, []);

  const zp = Math.round(zoom * 100);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`fixed inset-0 h-screen w-full overflow-hidden select-none ${
        toolMode === "hand" || isDragging ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
      }`}
      style={{ backgroundColor: "#1e1e1e" }}
    >
      {/* ═══ Figma-style canvas background ═══ */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, #3a3a3a 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* ═══ Top Ruler ═══ */}
      <div
        className="absolute top-0 left-[32px] right-0 h-[20px] z-40 border-b"
        style={{ backgroundColor: "#2c2c2c", borderColor: "#3a3a3a" }}
      >
        {Array.from({ length: 60 }, (_, i) => (
          <div key={i} className="absolute flex flex-col items-center" style={{ left: `${i * 80}px` }}>
            <span className="text-[8px] leading-none mt-1" style={{ color: "#6e6e6e", fontFamily: "var(--font-mono)" }}>
              {i * 100}
            </span>
            <div className="w-px h-1 mt-0.5" style={{ backgroundColor: "#4a4a4a" }} />
          </div>
        ))}
        {/* Minor ticks */}
        {Array.from({ length: 300 }, (_, i) => (
          <div
            key={`t${i}`}
            className="absolute bottom-0"
            style={{ left: `${i * 16}px`, width: "1px", height: i % 5 === 0 ? "5px" : "3px", backgroundColor: "#3e3e3e" }}
          />
        ))}
      </div>

      {/* ═══ Left Ruler ═══ */}
      <div
        className="absolute top-[20px] left-0 bottom-0 w-[32px] z-40 border-r"
        style={{ backgroundColor: "#2c2c2c", borderColor: "#3a3a3a" }}
      >
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} className="absolute flex items-center" style={{ top: `${i * 80}px`, left: "2px" }}>
            <span className="text-[8px] leading-none" style={{ color: "#6e6e6e", fontFamily: "var(--font-mono)" }}>
              {i * 100}
            </span>
          </div>
        ))}
        {Array.from({ length: 200 }, (_, i) => (
          <div
            key={`t${i}`}
            className="absolute right-0"
            style={{ top: `${i * 16}px`, height: "1px", width: i % 5 === 0 ? "5px" : "3px", backgroundColor: "#3e3e3e" }}
          />
        ))}
      </div>

      {/* ═══ Ruler corner ═══ */}
      <div
        className="absolute top-0 left-0 w-[32px] h-[20px] z-50 border-r border-b"
        style={{ backgroundColor: "#2c2c2c", borderColor: "#3a3a3a" }}
      />

      {/* ═══ Top Toolbar ═══ */}
      <div
        className="absolute top-[20px] left-[32px] right-0 h-[40px] z-40 flex items-center justify-between px-3 border-b"
        style={{ backgroundColor: "#2c2c2c", borderColor: "#3a3a3a" }}
      >
        {/* Left: breadcrumb */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ backgroundColor: "#383838" }}>
            <Hash className="h-3 w-3" style={{ color: "#9d9d9d" }} />
             <span className="text-xs" style={{ color: "#ccc", fontFamily: "var(--font-mono)" }}>
              hammad_zia_portfolio
            </span>
          </div>
          <span style={{ color: "#555" }}>/</span>
          <span className="text-[11px]" style={{ color: hoveredArtboard ? "#fff" : "#888", fontFamily: "var(--font-mono)" }}>
            {hoveredArtboard ? ARTBOARDS.find((a) => a.id === hoveredArtboard)?.label || "Canvas" : "Page 1"}
          </span>
        </div>

        {/* Center: tool toggles */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-md p-0.5" style={{ backgroundColor: "#383838" }}>
          <button
            onClick={() => setToolMode("pointer")}
            className="p-1.5 rounded cursor-pointer transition-colors"
            style={{ backgroundColor: toolMode === "pointer" ? "#4a4a4a" : "transparent" }}
          >
            <MousePointer2 className="h-3.5 w-3.5" style={{ color: toolMode === "pointer" ? "#fff" : "#888" }} />
          </button>
          <button
            onClick={() => setToolMode("hand")}
            className="p-1.5 rounded cursor-pointer transition-colors"
            style={{ backgroundColor: toolMode === "hand" ? "#4a4a4a" : "transparent" }}
          >
            <Hand className="h-3.5 w-3.5" style={{ color: toolMode === "hand" ? "#fff" : "#888" }} />
          </button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: "#888", fontFamily: "var(--font-mono)" }}>
            {zp}%
          </span>
          <button
            onClick={onSwitchMode}
            className="px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider cursor-pointer transition-all"
            style={{ backgroundColor: "#0d99ff", color: "#fff", fontFamily: "var(--font-mono)" }}
          >
            Portfolio View
          </button>
        </div>
      </div>

      {/* ═══ Left Panel: Layers ═══ */}
      <div
        className="absolute top-[60px] left-[32px] bottom-0 w-[200px] z-40 border-r flex flex-col"
        style={{ backgroundColor: "#2c2c2c", borderColor: "#3a3a3a" }}
      >
        {/* Panel tabs */}
        <div className="flex border-b" style={{ borderColor: "#3a3a3a" }}>
          <button className="flex-1 py-2 text-xs font-medium uppercase tracking-wider cursor-pointer border-b-2"
            style={{ color: "#fff", borderColor: "#0d99ff", fontFamily: "var(--font-mono)" }}>
            Layers
          </button>
          <button className="flex-1 py-2 text-xs uppercase tracking-wider cursor-pointer"
            style={{ color: "#666", fontFamily: "var(--font-mono)" }}>
            Assets
          </button>
        </div>

        {/* Page */}
        <div className="px-2 py-1.5 border-b flex items-center gap-1.5 cursor-pointer" style={{ borderColor: "#3a3a3a" }}>
          <button
            onClick={() => setLayersExpanded(!layersExpanded)}
            className="cursor-pointer p-0.5"
          >
            {layersExpanded ? (
              <ChevronDown className="h-3 w-3" style={{ color: "#888" }} />
            ) : (
              <ChevronRight className="h-3 w-3" style={{ color: "#888" }} />
            )}
          </button>
          <Layers className="h-3 w-3" style={{ color: "#888" }} />
          <span className="text-xs" style={{ color: "#ccc", fontFamily: "var(--font-mono)" }}>Page 1</span>
        </div>

        {/* Layer items */}
        {layersExpanded && (
          <div className="flex-1 overflow-y-auto layers-panel">
            {ARTBOARDS.map((artboard) => (
              <div
                key={artboard.id}
                className="flex items-center gap-1.5 px-2 py-[5px] cursor-pointer transition-colors group"
                style={{
                  paddingLeft: "24px",
                  backgroundColor: hoveredArtboard === artboard.id ? "#3a3a3a" : "transparent",
                }}
                onClick={() => focusArtboard(artboard)}
                onMouseEnter={() => setHoveredArtboard(artboard.id)}
                onMouseLeave={() => setHoveredArtboard(null)}
              >
                {/* Frame icon */}
                <div
                  className="shrink-0"
                  style={{
                    width: "8px",
                    height: "8px",
                    border: "1.5px solid",
                    borderColor: hoveredArtboard === artboard.id ? "#0d99ff" : "#666",
                    borderRadius: "1px",
                  }}
                />

                <span
                  className="flex-1 truncate text-xs"
                  style={{
                    color: hoveredArtboard === artboard.id ? "#fff" : "#aaa",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {artboard.label}
                </span>

                {/* Visibility toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setArtboardVisibility((prev) => ({ ...prev, [artboard.id]: !prev[artboard.id] }));
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5"
                >
                  {artboardVisibility[artboard.id] ? (
                    <Eye className="h-3 w-3" style={{ color: "#888" }} />
                  ) : (
                    <EyeOff className="h-3 w-3" style={{ color: "#555" }} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom info */}
        <div className="px-3 py-2 border-t" style={{ borderColor: "#3a3a3a" }}>
          <div className="space-y-1">
            <div className="flex justify-between text-[9px]" style={{ color: "#555", fontFamily: "var(--font-mono)" }}>
              <span>Frames</span>
              <span>{ARTBOARDS.filter((a) => artboardVisibility[a.id]).length}</span>
            </div>
            <div className="flex justify-between text-[9px]" style={{ color: "#555", fontFamily: "var(--font-mono)" }}>
              <span>Zoom</span>
              <span>{zp}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Canvas ═══ */}
      <div
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="absolute inset-0 w-0 h-0 pointer-events-none"
      >
        <div className="relative pointer-events-auto">
          {/* Render artboard frames */}
          {ARTBOARDS.map((artboard) => {
            if (!artboardVisibility[artboard.id]) return null;
            const isHovered = hoveredArtboard === artboard.id;

            return (
              <div
                key={artboard.id}
                style={{
                  position: "absolute",
                  left: `${artboard.x - artboard.width / 2}px`,
                  top: `${artboard.y - artboard.height / 2}px`,
                  width: `${artboard.width}px`,
                }}
                className="group"
                onMouseEnter={() => setHoveredArtboard(artboard.id)}
                onMouseLeave={() => setHoveredArtboard(null)}
              >
                {/* ─ Frame label (Figma style: small, above frame) ─ */}
                <div
                  className="flex items-center gap-1.5 mb-[6px] px-0.5"
                  style={{ height: "16px" }}
                >
                  <span
                    className="text-[11px] font-medium truncate"
                    style={{
                      color: isHovered ? "#0d99ff" : "#999",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {artboard.label}
                  </span>
                </div>

                {/* ─ Frame body ─ */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    backgroundColor: "#111",
                    borderRadius: "4px",
                    minHeight: `${artboard.height}px`,
                    border: isHovered ? "1.5px solid #0d99ff" : "1px solid #333",
                    boxShadow: isHovered
                      ? "0 0 0 1px #0d99ff"
                      : "0 4px 24px rgba(0,0,0,0.4)",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  data-no-drag
                >
                  {/* Selection handles (Figma blue squares at corners) */}
                  {isHovered && (
                    <>
                      <div style={handleStyle("top", "left")} />
                      <div style={handleStyle("top", "right")} />
                      <div style={handleStyle("bottom", "left")} />
                      <div style={handleStyle("bottom", "right")} />
                      {/* Edge midpoints */}
                      <div style={midHandleStyle("top")} />
                      <div style={midHandleStyle("bottom")} />
                      <div style={midHandleStyle("left")} />
                      <div style={midHandleStyle("right")} />
                    </>
                  )}

                  {/* Artboard content */}
                  <ArtboardContent contentId={artboard.id} compact={true} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Bottom-Right: Zoom Controls ═══ */}
      <div
        className="absolute bottom-4 right-4 z-40 flex items-center gap-1 rounded-md p-1"
        style={{ backgroundColor: "#2c2c2c", border: "1px solid #3a3a3a" }}
      >
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.15))}
          className="p-1.5 rounded cursor-pointer hover:bg-[#3a3a3a] transition-colors"
        >
          <ZoomOut className="h-3.5 w-3.5" style={{ color: "#999" }} />
        </button>

        {/* Zoom slider */}
        <div className="w-20 h-[3px] rounded-full mx-1 relative" style={{ backgroundColor: "#444" }}>
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ width: `${Math.min((zoom / 3) * 100, 100)}%`, backgroundColor: "#0d99ff" }}
          />
          <input
            type="range"
            min="15"
            max="300"
            value={Math.round(zoom * 100)}
            onChange={(e) => setZoom(Number(e.target.value) / 100)}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>

        <button
          onClick={() => setZoom((z) => Math.min(z + 0.15, 3))}
          className="p-1.5 rounded cursor-pointer hover:bg-[#3a3a3a] transition-colors"
        >
          <ZoomIn className="h-3.5 w-3.5" style={{ color: "#999" }} />
        </button>

        <div className="w-px h-4 mx-0.5" style={{ backgroundColor: "#3a3a3a" }} />

        <button
          onClick={fitAll}
          className="p-1.5 rounded cursor-pointer hover:bg-[#3a3a3a] transition-colors"
        >
          <Maximize2 className="h-3.5 w-3.5" style={{ color: "#999" }} />
        </button>

        <div
          className="px-2 py-0.5 rounded text-[10px] ml-1"
          style={{ backgroundColor: "#383838", color: "#aaa", fontFamily: "var(--font-mono)" }}
        >
          {zp}%
        </div>
      </div>
    </div>
  );
}

/* ─── Figma selection handle styles ─── */
function handleStyle(vPos: "top" | "bottom", hPos: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [vPos]: "-4px",
    [hPos]: "-4px",
    width: "7px",
    height: "7px",
    backgroundColor: "#fff",
    border: "1.5px solid #0d99ff",
    borderRadius: "0px",
    zIndex: 20,
  };
}

function midHandleStyle(edge: "top" | "bottom" | "left" | "right"): React.CSSProperties {
  const isVertical = edge === "left" || edge === "right";
  return {
    position: "absolute",
    ...(edge === "top" && { top: "-3px", left: "50%", transform: "translateX(-50%)" }),
    ...(edge === "bottom" && { bottom: "-3px", left: "50%", transform: "translateX(-50%)" }),
    ...(edge === "left" && { left: "-3px", top: "50%", transform: "translateY(-50%)" }),
    ...(edge === "right" && { right: "-3px", top: "50%", transform: "translateY(-50%)" }),
    width: isVertical ? "5px" : "9px",
    height: isVertical ? "9px" : "5px",
    backgroundColor: "#fff",
    border: "1.5px solid #0d99ff",
    borderRadius: "0px",
    zIndex: 20,
  };
}
