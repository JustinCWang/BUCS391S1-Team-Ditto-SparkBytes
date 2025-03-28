'use client';

import FooterSection from '@/component/footer';
import MainButton from '@/component/primaryButton';
import SecondaryButton from '@/component/secondaryButton';
import FirstNav from '@/component/firstNav';
import '@ant-design/v5-patch-for-react-19';

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

function HeaderSection() {
  return (
    <header
      className="
        relative
        flex flex-col items-center justify-center
        text-center
        px-4 pt-32 pb-52
        overflow-hidden
        border-y-1 border-gray-200
      "
    >
    
      {/* Blur Circle 1 */}
      <div className="absolute top-0 left-0 w-[200px] lg:w-[600px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>

      {/* Blur Circle 2 */}
      <div className="absolute bottom-0 right-0 w-[200px] lg:w-[600px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <h1 className="text-text-primary font-bold font-montserrat text-5xl lg:text-7xl mb-4">
        Free Food.
      </h1>
      <h1 className="text-text-primary font-bold font-montserrat text-5xl lg:text-7xl mb-4">
        No Strings Attached.
      </h1>
      <p className=" text-text-primary font-inter text-xl lg:text-xl max-w-4xl mb-6">
        College is expensive—your next meal doesn&apos;t have to be. Spark Bytes helps BU students
        find free food on campus in seconds so you never miss out.
      </p>
      <div className='mt-4'>
        <MainButton linkTo='/signup' text='Sign Up Now!' styling='px-10 py-3 text-3xl'/>
      </div>
    </header>
  );
}

function SectionOne() {
  return (
    <section className="text-text-primary px-4 py-32 text-center">
      <h2 className="text-4xl lg:text-6xl font-bold mb-12 max-w-5xl mx-auto ">How Spark Bytes Works</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto ">
        {/* Here you can put a three-step process, for example: "Post Events", "Browse & Find", "Reduce Waste" */}

        <div className="border-2 border-text-primary rounded-lg px-2 py-16 shadow-lg">
          <div className="w-15 h-15 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-brand-primary font-montserrat font-bold text-2xl">1</span>
          </div>
          <h3 className="font-montserrat text-3xl font-bold mb-2">Post Events</h3>
          <p className="font-inter">
            BU community members can share upcoming events with free food.
          </p>
        </div>

        <div className="border-2 border-text-primary rounded-lg px-2 py-16 shadow-lg">
          <div className="w-15 h-15 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-brand-primary font-montserrat font-bold text-2xl">2</span>
          </div>
          <h3 className="font-montserrat text-3xl font-bold mb-2">Browse & Find</h3>
          <p className="font-inter">
            Easily discover events and free food spots around campus.
          </p>
        </div>

        <div className="border-2 border-text-primary rounded-lg px-2 py-16 shadow-lg">
          <div className="w-15 h-15 bg-brand-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-brand-primary font-montserrat font-bold text-2xl">3</span>
          </div>
          <h3 className="font-montserrat text-3xl font-bold mb-2">Reduce Waste</h3>
          <p className="font-inter">
            Enjoy free meals while helping reduce food waste on campus.
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionTwo() {
  return (
    <section className="bg-gray-50 px-4 py-32">
      {/* Container for the items */}
      <div className="max-w-5xl mx-auto text-center">
        {/* Title for this container */}
        <h2 className="text-text-primary text-4xl lg:text-6xl font-montserrat font-bold mb-8">Our Mission</h2>
        {/* Description */}
        <p className="text-text-primary font-inter text-xl lg:text-2xl mb-8">
          Spark Bytes aims to create a more sustainable campus by reducing food
          waste from events while helping students access free meals.
        </p>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 max-w-xl mx-auto'>
          <SecondaryButton text='Meet the team!' linkTo='/about'/>
          <MainButton linkTo='/signup' text='Sign Up Now!' styling='px-10 py-3 text-xl'/>
        </div>
      </div>
    </section>
  );
}

function SectionThree() {
  return (
    <section className="px-4 py-32 text-center">
      {/* Title of the section */}
      <h2 className="text-text-primary text-4xl lg:text-6xl font-montserrat font-bold mb-16 max-w-5xl mx-auto">BU Spark!Bytes Impact</h2>

      {/* Background for the container */}
      <div className="w-full border-2 border-text-primary rounded-lg shadow-lg px-2 py-16 max-w-6xl mx-auto">
      
      {/* The actual container for the text */}
      <div className="grid md:grid-cols-3 gap-8">
          {/* Text cards for the grid */}
          <div className='text-center p-8'>
            <p className="font-montserrat text-brand-primary text-4xl font-bold">500+</p>
            <p className="font-inter text-xl text-text-primary">Events Shared</p>
          </div>
          <div className='text-center p-8'>
            <p className="font-montserrat text-brand-primary text-4xl font-bold">100+</p>
            <p className="font-inter text-xl text-text-primary">BU Students</p>
          </div>
          <div className='text-center p-8'>
            <p className="font-montserrat text-brand-primary text-4xl font-bold">500 lb</p>
            <p className="font-inter text-xl text-text-primary">Food Waste Prevented</p>
          </div>
        </div>
      </div>
    </section>
  );
}