import { animate, stagger, useInView } from "motion/react"
import { useEffect, ReactNode, useRef } from "react"

interface TextProps {
  children: ReactNode | ReactNode[];
}

export default function TextFade({ children }: TextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  // Minimal mobile check
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!containerRef.current || !isInView) return;

      containerRef.current.style.visibility = "visible";

      // Cast NodeLists to HTMLElement
      const elementsH1 = containerRef.current.querySelectorAll("h1 span") as NodeListOf<HTMLElement>;
      const elementsP = containerRef.current.querySelectorAll("p span") as NodeListOf<HTMLElement>;
      const sectionHeader = containerRef.current.querySelectorAll("h2 span") as NodeListOf<HTMLElement>;

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

      animateGroup(elementsH1, 0.07);
      animateGroup(elementsP, 0.03);
      animateGroup(sectionHeader, 0.07);
    });
  }, [isInView]);

  return (
    <div ref={containerRef} style={{ visibility: "hidden", willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}

