import React from "react";
import Menu from "../componets/menu";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative bg-white">
      {/* Cool Blue Glow Left */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
            radial-gradient(
              circle at top left,
              rgba(90, 120, 180, 0.5),
              transparent 70%
            )
          `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Menu />

        {children}
      </div>
      {/* Your Content/Components */}
    </div>
  );
}