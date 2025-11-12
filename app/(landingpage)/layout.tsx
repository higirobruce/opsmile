import React from "react";
import Menu from "../componets/menu";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen w-full relative bg-cover bg-center"
      style={{ backgroundImage: `url('/surgery.jpg')` }}
    >
      {/* Overlay for dimming/effects */}
      <div
        className="absolute inset-0 z-0 bg-black opacity-50"
      />
      <div className="relative z-10 flex min-h-screen w-full">
        {/* Left side for login form */}
        <div className="flex items-center justify-center">
          {children}
        </div>
        {/* Right side for background image (already set on parent) */}
        {/* <div className="w-1/2"></div> */}
      </div>
    </div>
  );
}