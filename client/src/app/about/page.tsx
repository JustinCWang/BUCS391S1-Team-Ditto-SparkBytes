'use client'
import FirstNav from "@/component/firstNav";
import FooterSection from "@/component/footer";
import AboutMe from "@/component/aboutMe";

/**
 * Displays an introduction to the team behind the project.
 */
const About = () => {
  return (
    <main className="flex flex-col min-h-screen">

      {/* Top navigation */}
      <FirstNav />

      {/* Team Section */}
      <section className="my-20 mx-4">
        <div>
          <h2 className="text-text-primary text-4xl lg:text-6xl font-montserrat font-bold mb-8 text-center">Meet the Team!</h2>
        </div>

        {/* Team member cards in responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-center items-center max-w-6xl mx-auto">
          
          <AboutMe 
            linkedIn="https://www.linkedin.com/in/jcwang27/"
            name="Justin Wang" 
            bio="Scrum Master and Backend Developer" 
            imageUrl="https://media.licdn.com/dms/image/v2/D4D03AQEhOhCgj4GV0w/profile-displayphoto-shrink_400_400/B4DZSay.eZGkAg-/0/1737763842528?e=1748476800&v=beta&t=0zLCLhJ3vun1IbuDwb7yfW1rUl1CVsMVhJ7tCsIbr14"
          />
          
          <AboutMe 
            linkedIn="https://www.linkedin.com/in/thaodanghoang/"
            name="Thao Hoang" 
            bio="Designer and Frontend Developer" 
            imageUrl="https://media.licdn.com/dms/image/v2/D4E03AQEpoI4OE6OXUA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1723077015556?e=1748476800&v=beta&t=8XxS_px1uzL4zrad7EYDgMP2cxlc0BO_rn1xAfgcEEk"
          />
          
          <AboutMe 
            linkedIn="https://www.linkedin.com/in/jiafei-fan-1a17b7335/"
            name="Jiafei Fan" 
            bio="Fullstack Developer and Designer" 
            imageUrl="https://media.licdn.com/dms/image/v2/D5603AQEZm1vLMHdUOg/profile-displayphoto-shrink_800_800/B56ZaRXM4cG4Ac-/0/1746195501394?e=1751500800&v=beta&t=Cn1W3k_TuvuctCIafYEckyP0zi0Jx43iG2Ld8wvPdN8"
          />
          
          <AboutMe 
            linkedIn="https://www.linkedin.com/in/j0rdanyin/"
            name="Jordan Yin" 
            bio="Design head and Fullstack Developer" 
            imageUrl="https://media.licdn.com/dms/image/v2/D4E03AQHOGHBymXR-ow/profile-displayphoto-shrink_800_800/B4EZZaVbQPHkAc-/0/1745272288662?e=1751500800&v=beta&t=eE9pkOkucy6NoDx_eMZuqFOaSWxTMNF-IA_RFLWwe9o"
          />
        </div>
      </section>

      {/* Footer */}
      <FooterSection />
    </main>
  );
};

export default About;