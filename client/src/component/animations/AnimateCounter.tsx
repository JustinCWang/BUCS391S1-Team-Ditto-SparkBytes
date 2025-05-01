import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useMotionValueEvent,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Define the shape of the animated counter component
interface AnimatedCounterProps {
  target: number;
  suffix?: string;
}

/**
 * Animates a number counting up from 0 to a target value when it scrolls into view.
 * Displays an optional suffix (e.g., "+") after the number.
 */
export default function AnimatedCounter({ target, suffix = "+" }: AnimatedCounterProps) {
  // Ref to track when the element enters the viewport
  const ref = useRef<HTMLParagraphElement>(null);
  
  // Detect if the component is in view; trigger only once
  const isInView = useInView(ref, { once: true });
  
  // Motion value that drives the animation
  const count = useMotionValue(0);
  
  // Transformed value formatted as a string with commas
  const formatted = useTransform(count, (v) => Math.floor(v).toLocaleString());
  
  // Local state for the current display value
  const [display, setDisplay] = useState("0");

  // Update the displayed number when the formatted motion value changes
  useMotionValueEvent(formatted, "change", (v) => {
    setDisplay(v);
  });

  // Animate the count value to the target when the element scrolls into view
  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 1.8,
        ease: "easeOut",
      });
      
      // Return cleanup function in case the component unmounts mid-animation
      return controls.stop;
    }
  }, [isInView, target, count]);

  // Render the animated number and optional suffix
  return (
    <motion.p
      ref={ref}
      className="font-montserrat text-brand-primary text-4xl font-bold"
    >
      {display}
      {suffix}
    </motion.p>
  );
}



