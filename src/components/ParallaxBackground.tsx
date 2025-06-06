"use client";

import { ReactNode } from "react";
import { Parallax } from "react-scroll-parallax";

interface ParallaxBackgroundProps {
  backgroundImage: string;
  speed?: number;
  minHeight?: string;
  sectionName?: string;
  children?: ReactNode;
}

export default function ParallaxBackground({
  backgroundImage,
  speed = -10,
  minHeight = "600px",
  sectionName,
  children,
}: ParallaxBackgroundProps) {
  return (
    <section
      id={sectionName}
      className="relative overflow-hidden"
      style={{ minHeight }}
    >
      <Parallax speed={speed}>
        <div
          className="relative w-full h-full min-h-[600px] bg-center bg-cover"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            willChange: "transform",
            transform: "translate3d(0,0,0)",
            minHeight: `calc(${minHeight} + 350px)`,
          }}
        />

        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0.6, zIndex: 10 }}
        />
      </Parallax>

      <div className="absolute inset-0 flex items-center justify-center z-20 px-4 text-white text-center">
        <div className="max-w-md">{children}</div>
      </div>
    </section>
  );
}
