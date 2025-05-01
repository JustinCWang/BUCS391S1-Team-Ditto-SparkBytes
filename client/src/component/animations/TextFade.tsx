import { animate, stagger, useInView } from "motion/react"
import { useEffect, ReactNode, useRef } from "react"

// Define the shape of the text fade
interface TextProps {
  children: ReactNode | ReactNode[];
}

/**
 * This component applies a fade-in and slide-up animation to text elements
 * 
 * To work correctly, the inner text should already be split into <span> elements
 * (e.g., for word or character-level animation). Animation is triggered once,
 * and uses staggered delays for a natural sequential effect.
 */
export default function TextFade({ children }: TextProps) {
  // Reference to the container DOM element
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track if the container is in view (at least 40% visible)
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  useEffect(() => {
    // Wait for fonts to fully load to prevent animation misalignment
    document.fonts.ready.then(() => {
      if (!containerRef.current || !isInView) return;

      // Make the container visible so animations are seen
      containerRef.current.style.visibility = "visible";

      // Select individual <span> elements inside each target tag
      const elementsH1 = containerRef.current.querySelectorAll("h1 span") as NodeListOf<HTMLElement>;
      const elementsP = containerRef.current.querySelectorAll("p span") as NodeListOf<HTMLElement>;
      const sectionHeader = containerRef.current.querySelectorAll("h2 span") as NodeListOf<HTMLElement>;

      /**
       * Animates the group of elements by fading in and sliding up,
       * with a staggered delay between each one.
       */
      const animateGroup = (
        elements: NodeListOf<HTMLElement>,
        delay: number
      ) => {
        if (elements.length === 0) return;

        animate(
          elements,
          { opacity: [0, 1], y: [10, 0] },
          {
            duration: 0.6,
            ease: "easeOut",
            delay: stagger(delay),
          }
        );
      };

      // Animate each group of elements with different stagger timings
      animateGroup(elementsH1, 0.07);
      animateGroup(elementsP, 0.03);
      animateGroup(sectionHeader, 0.07);
    });
  }, [isInView]);

  // Wraps the content and keeps it hidden until it's ready to animate
  return (
    <div ref={containerRef} style={{ visibility: "hidden", willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}

