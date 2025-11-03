import React, { useEffect, useRef, useState } from "react";
import { useLayout } from "../../context/LayoutContext";
import ClockWidget from "../dashboard/ClockWidget";
import WeatherWidget from "../dashboard/WeatherWidget";
import SpotifyWidget from "../dashboard/SpotifyWidget";

// Persistent right sidebar content. Assumes its parent positions and sizes the aside area.
export default function RightSidebar() {
  const { editMode } = useLayout();
  const draggingRef = useRef(false);
  // Per-widget heights (px) with simple persistence
  const [clockH, setClockH] = useState(() => {
    try {
      return Number(localStorage.getItem("tae.rightSidebar.h.clock") || 140);
    } catch {
      return 140;
    }
  });
  const [weatherH, setWeatherH] = useState(() => {
    try {
      return Number(localStorage.getItem("tae.rightSidebar.h.weather") || 180);
    } catch {
      return 180;
    }
  });
  const [spotifyH, setSpotifyH] = useState(() => {
    try {
      return Number(localStorage.getItem("tae.rightSidebar.h.spotify") || 320);
    } catch {
      return 320;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("tae.rightSidebar.h.clock", String(clockH));
      localStorage.setItem("tae.rightSidebar.h.weather", String(weatherH));
      localStorage.setItem("tae.rightSidebar.h.spotify", String(spotifyH));
    } catch {}
  }, [clockH, weatherH, spotifyH]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!draggingRef.current) return;
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const widthPx = Math.max(240, Math.min(vw - e.clientX, 640));
      const evt = new CustomEvent("tae:rightSidebar:resize", { detail: { widthPx } });
      window.dispatchEvent(evt);
    };
    const onMouseUp = () => {
      draggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div className="h-full p-2 lg:p-3 relative">
      <div className="h-full rounded-xl bg-black/25 backdrop-blur-xl border border-white/10 p-3 flex flex-col space-y-4 overflow-auto">
        {/* Clock */}
        <div className="relative w-full">
          {editMode && (
            <div className="absolute top-1 right-1 z-10 flex gap-1">
              <button
                className="px-2 py-0.5 text-[10px] rounded border bg-slate-800/80 border-slate-600 hover:bg-slate-700"
                title="Decrease height (-5px)"
                onClick={() => setClockH((h) => Math.max(80, h - 5))}
              >
                -5px
              </button>
              <button
                className="px-2 py-0.5 text-[10px] rounded border bg-slate-800/80 border-slate-600 hover:bg-slate-700"
                title="Increase height (+5px)"
                onClick={() => setClockH((h) => Math.min(600, h + 5))}
              >
                +5px
              </button>
            </div>
          )}
          <div className="w-full overflow-hidden">
            <div
              className="origin-top-left"
              style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "calc(100% / 0.85)" }}
            >
              <ClockWidget />
            </div>
          </div>
        </div>
        {/* Weather */}
        <div className="relative w-full">
          {editMode && (
            <div className="absolute top-1 right-1 z-10 flex gap-1">
              <button
                className="px-2 py-0.5 text-[10px] rounded border bg-slate-800/80 border-slate-600 hover:bg-slate-700"
                title="Decrease height (-5px)"
                onClick={() => setWeatherH((h) => Math.max(100, h - 5))}
              >
                -5px
              </button>
              <button
                className="px-2 py-0.5 text-[10px] rounded border bg-slate-800/80 border-slate-600 hover:bg-slate-700"
                title="Increase height (+5px)"
                onClick={() => setWeatherH((h) => Math.min(700, h + 5))}
              >
                +5px
              </button>
            </div>
          )}
          <div className="w-full overflow-hidden">
            <div
              className="origin-top-left"
              style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "calc(100% / 0.85)" }}
            >
              <WeatherWidget />
            </div>
          </div>
        </div>
        {/* Spotify */}
        <div className="relative w-full">
          {editMode && (
            <div className="absolute top-1 right-1 z-10 flex gap-1">
              <button
                className="px-2 py-0.5 text-[10px] rounded border bg-slate-800/80 border-slate-600 hover:bg-slate-700"
                title="Decrease height (-5px)"
                onClick={() => setSpotifyH((h) => Math.max(160, h - 5))}
              >
                -5px
              </button>
              <button
                className="px-2 py-0.5 text-[10px] rounded border bg-slate-800/80 border-slate-600 hover:bg-slate-700"
                title="Increase height (+5px)"
                onClick={() => setSpotifyH((h) => Math.min(1000, h + 5))}
              >
                +5px
              </button>
            </div>
          )}
          <div className="w-full overflow-hidden">
            <div
              className="origin-top-left"
              style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "calc(100% / 0.85)" }}
            >
              <SpotifyWidget />
            </div>
          </div>
        </div>
      </div>
      {/* Left-edge drag handle appears in Edit Layout & Size mode */}
      {editMode && (
        <div
          title="Drag to resize sidebar width"
          onMouseDown={(e) => {
            draggingRef.current = true;
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
            e.preventDefault();
          }}
          className="absolute left-[-4px] top-0 h-full w-2 cursor-col-resize bg-transparent"
          style={{
            // subtle visual affordance
            boxShadow: "inset -1px 0 0 0 rgba(255,255,255,0.06)",
          }}
        />
      )}
    </div>
  );
}
