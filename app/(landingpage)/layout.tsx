import React from "react";
import Menu from "../componets/menu";

export default function layout({ children }: { children: React.ReactNode }) {
  return (

    <div className="min-h-screen w-full relative">
      {/* Crystal Maze Pattern */}
      <style>{`
    @keyframes crystal-shimmer {
      0%, 100% { 
        background-position: 0% 0%, 0% 0%, 0% 0%, 50% 50%;
        background-size: 10px 10px, 10px 10px, 200% 200%, 200% 200%;
      }
      50% { 
        background-position: 1px 1px, -1px -1px, 100% 100%, 50% 50%;
        background-size: 12px 12px, 12px 12px, 200% 200%, 180% 180%;
      }
    }
  `}</style>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
        repeating-linear-gradient(
          60deg,
          transparent 0px,
          transparent 1px,
          rgba(255, 255, 255, 0.05) 1px,
          rgba(255, 255, 255, 0.05) 2px
        ),
        repeating-linear-gradient(
          -60deg,
          transparent 0px,
          transparent 1px,
          rgba(255, 255, 255, 0.05) 1px,
          rgba(255, 255, 255, 0.05) 2px
        ),
        linear-gradient(
          60deg,
          rgba(43, 108, 176, 0.4) 0%,
          rgba(72, 126, 176, 0.4) 33%,
          rgba(95, 142, 176, 0.4) 66%,
          rgba(116, 157, 176, 0.4) 100%
        ),
        radial-gradient(
          circle at 50% 50%,
          rgba(255, 255, 255, 0.2) 0%,
          transparent 50%
        )
      `,
          backgroundBlendMode: "overlay, overlay, normal, screen",
          animation: "crystal-shimmer 15s ease-in-out infinite",
        }}
      />
      {children}
    </div>

  );
}
