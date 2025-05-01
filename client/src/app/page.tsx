'use client';

// Core components and layout
import FooterSection from '@/component/footer';
import MainButton from '@/component/primaryButton';
import SecondaryButton from '@/component/secondaryButton';
import FirstNav from '@/component/firstNav';

// Animations
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import TextFade from '@/component/animations/TextFade';
import TextToSpan from '@/component/animations/TextToSpan';
import AnimatedCounter from '@/component/animations/AnimateCounter';


/**
 * Main landing layout that renders the full-page structure
 * consisting of header, sections, and footer.
 */
export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <FirstNav />
      <HeaderSection />
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <FooterSection />
    </main>
  );
}

/**
 * Split the website into different sections
 */

/**
 * HeaderSection
 * Renders the hero section with animated text and call-to-action button.
 */
function HeaderSection() {
  return (
    <header
      className="
        relative
        flex flex-col items-center justify-center
        text-center
        px-4
        overflow-hidden
        border-y-1 border-gray-200
        h-[91.5vh]
      "
    >
    
      {/* Blur Circle 1 */}
      <div className="absolute top-0 left-0 w-[200px] lg:w-[600px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>

      {/* Blur Circle 2 */}
      <div className="absolute bottom-0 right-0 w-[200px] lg:w-[600px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      {/* Hero text with split animation */}
      <TextFade>
        <h1 className="text-text-primary font-bold font-montserrat text-5xl lg:text-7xl mb-0 sm:mb-4">
          <TextToSpan text='Free Food.' splitBySpace={true}/>
        </h1>
        <h1 className="text-text-primary font-bold font-montserrat text-5xl lg:text-7xl mb-4">
          <TextToSpan text='No Strings Attached.' splitBySpace={true}/>
        </h1>
        <p className=" text-text-primary font-inter text-xl lg:text-xl max-w-4xl mb-6">
          <TextToSpan text='College is expensive—your next meal doesn&apos;t have to be. Spark Bytes helps BU students find free food on campus in seconds so you never miss out.' splitBySpace={true}/>
        </p>
      </TextFade>
      
      {/* CTA Button */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5,
          bounce: 0.25,
          delay: 0.55,
        }}
        className='mt-4'
      >
        <MainButton linkTo='/signup' text='Sign Up Now!' styling='px-10 py-3 text-3xl'/>
      </motion.div>
    </header>
  );
}

/**
 * SectionOne
 * Explains how Spark Bytes works with a 3-step card layout.
 */
function SectionOne() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      },
    },
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.8,
      },
    }    
  };
  

  return (
    <section className="text-text-primary px-4 py-32 text-center">
      <TextFade>
        <h2 className="text-4xl lg:text-6xl font-bold mb-12 max-w-5xl mx-auto ">
          <TextToSpan text='How Spark Bytes Works' splitBySpace={true}/>
        </h2>
      </TextFade>
      <motion.div
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }} // triggers only when in view
      >
        {[1, 2, 3].map((step) => (
          <motion.div
            key={step}
            variants={cardVariants}
            className="border-2 border-text-primary rounded-lg px-2 py-16 shadow-lg"
          >
            <div className="w-15 h-15 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-brand-primary font-montserrat font-bold text-2xl">{step}</span>
            </div>
            <h3 className="font-montserrat text-3xl font-bold mb-2">
              {step === 1 && "Post Events"}
              {step === 2 && "Browse & Find"}
              {step === 3 && "Reduce Waste"}
            </h3>
            <p className="font-inter">
              {step === 1 &&
                "BU community members can share upcoming events with free food."}
              {step === 2 &&
                "Easily discover events and free food spots around campus."}
              {step === 3 &&
                "Enjoy free meals while helping reduce food waste on campus."}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/**
 * SectionTwo
 * Highlights Spark Bytes' sustainability mission and includes CTA buttons.
 */
function SectionTwo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
        bounce: 0.25,
        delay: 0.55,
      },
    },
  };
  

  return (
    <section className="px-4 py-32 transition-colors duration-300">
      {/* Container for the items */}
      <div className="max-w-5xl mx-auto text-center">
        <TextFade>
          <h2 className="text-text-primary text-4xl lg:text-6xl font-montserrat font-bold mb-8">
            <TextToSpan text='Our Mission' splitBySpace={true}/>
          </h2>
          <p className="text-text-primary font-inter text-xl lg:text-2xl mb-8">
            <TextToSpan text='Spark Bytes aims to create a more sustainable campus by reducing food
            waste from events while helping students access free meals.' splitBySpace={true}/>
          </p>
        </TextFade>

        {/* Buttons: Meet Team & Sign Up */}
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 max-w-xl mx-auto"
        >
          <SecondaryButton text="Meet the team!" linkTo="/about" />
          <MainButton linkTo="/signup" text="Sign Up Now!" styling="px-10 py-3 text-xl" />
        </motion.div>
      </div>
    </section>
  );
}

/**
 * SectionThree
 * Displays animated statistics showcasing the impact of Spark Bytes.
 */
function SectionThree() {
  return (
    <section className="px-4 py-32 text-center">

      <TextFade>
        <h2 className="text-text-primary text-4xl lg:text-6xl font-montserrat font-bold mb-16 max-w-5xl mx-auto">
          <TextToSpan text='BU Spark!Bytes Impact' splitBySpace={true}/>
        </h2>
      </TextFade>

      {/* Background for the container */}
      <div className="w-full border-2 border-text-primary rounded-lg shadow-lg px-2 py-16 max-w-6xl mx-auto">
      
      {/* The actual container for the text */}
      <div className="grid md:grid-cols-3 gap-8">
          {/* Text cards for the grid */}
          <div className='text-center p-8'>
            <AnimatedCounter target={500} suffix='+'/>
            <p className="font-inter text-xl text-text-primary">Events Shared</p>
          </div>
          <div className='text-center p-8'>
            <AnimatedCounter target={100} suffix='+'/>
            <p className="font-inter text-xl text-text-primary">BU Students</p>
          </div>
          <div className='text-center p-8'>
            <AnimatedCounter target={500} suffix='IB'/>
            <p className="font-inter text-xl text-text-primary">Food Waste Prevented</p>
          </div>
        </div>
      </div>
    </section>
  );
}