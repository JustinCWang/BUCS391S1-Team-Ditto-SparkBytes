import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  useMotionValueEvent,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
}

export default function AnimatedCounter({ target, suffix = "+" }: AnimatedCounterProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true });

  const count = useMotionValue(0);
  const formatted = useTransform(count, (v) => Math.floor(v).toLocaleString());
  const [display, setDisplay] = useState("0");

  useMotionValueEvent(formatted, "change", (v) => {
    setDisplay(v);
  });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, {
        duration: 1.8,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, target, count]);

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



