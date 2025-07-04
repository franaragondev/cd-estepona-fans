"use client";

import { ReactNode } from "react";
import { Parallax } from "react-scroll-parallax";
import Image from "next/image";

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
  const calculatedMinHeight = `calc(${minHeight} + 350px)`;

  return (
    <section
      id={sectionName}
      className="relative overflow-hidden"
      style={{ minHeight }}
    >
      <Parallax speed={speed}>
        <div
          className="relative w-full h-full"
          style={{ minHeight: calculatedMinHeight }}
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0.6, zIndex: 10 }}
        />
      </Parallax>

      <div className="absolute inset-0 flex items-center justify-center z-20 px-4 text-white text-center">
        <div className="max-w-md md:max-w-4xl">{children}</div>
      </div>
    </section>
  );
}
