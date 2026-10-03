"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    setIsVisible(true);

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'img' || target.closest('.hover-trigger-image')) {
        setIsHoveringImage(true);
      } else if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHoveringLink(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'img' || target.closest('.hover-trigger-image')) {
        setIsHoveringImage(false);
      } else if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHoveringLink(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-[#C8A97E] rounded-full pointer-events-none z-[100] mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHoveringImage ? 4 : isHoveringLink ? 2 : 1,
          opacity: isHoveringImage ? 0 : 1
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      />
      
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center w-20 h-20 bg-white text-primary rounded-full pointer-events-none z-[100] text-xs font-semibold tracking-widest uppercase"
        animate={{
          x: mousePosition.x - 40,
          y: mousePosition.y - 40,
          scale: isHoveringImage ? 1 : 0,
          opacity: isHoveringImage ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      >
        View
      </motion.div>
    </>
  );
}
