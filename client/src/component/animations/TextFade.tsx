import { animate, stagger, useInView } from "motion/react"
import { useEffect, ReactNode, useRef } from "react"

interface TextProps {
  children:  ReactNode | ReactNode[];
}

export default function TextFade({children}:TextProps) {

  // Set up a state where we reference type HTMLDivElement
  // because we set this as our ref for the div in return
  // to be able to see all the children HTML elements in the div
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  // useEffect so that on page load we first make sure we get the fonts from google,
  // then does the animations after a few other checks.
  useEffect(() => {
    document.fonts.ready.then(() => {
      // Check if the containerRef is not null. Since the component
      // mounts onto the DOM before useEffect is called.
      if (!containerRef.current || !isInView) return

      // Make the container visible once fonts are loaded
      containerRef.current.style.visibility = "visible"

      // Select all DOM elements by referencing the HTML Elements in the Div
      const elementsH1 = containerRef.current.querySelectorAll("h1 span");
      const elementsP = containerRef.current.querySelectorAll("p span");

      const sectionHeader = containerRef.current.querySelectorAll("h2 span");

      // If there are no elements then return
      if (elementsH1.length > 0) {
        // Then animate the fade in an stager each element.
        animate(
          elementsH1,
          { opacity: [0, 1], y: [10, 0] },
          {
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.5,
            bounce: 0.25,
            delay: stagger(0.07),
          }
        )
      } 

      if (elementsP.length > 0) {
        // So that elementsP goes at the same time as elements
        animate(
          elementsP,
          { opacity: [0, 1], y: [10, 0] },
          {
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.5,
            bounce: 0.25,
            delay: stagger(0.03),
          }
        )
      }
      
      if (sectionHeader.length > 0) {
        animate(
          sectionHeader,
          { opacity: [0, 1], y: [10, 0] },
          {
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.5,
            bounce: 0.25,
            delay: stagger(0.07),
          }
        )
      }
  })
  },[isInView]);

  return(
    <div ref={containerRef}>
      {children}
    </div>
  )
}
