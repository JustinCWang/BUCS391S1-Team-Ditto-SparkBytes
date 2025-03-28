'use client'
import FirstNav from "@/component/firstNav";
import FooterSection from "@/component/footer";
import AboutMe from "@/component/aboutMe";

// Define the About component
const About = () => {
  return (
    <main className="flex flex-col min-h-screen">
      <FirstNav />
      <section className="my-20 mx-4">
        <div>
          <h2 className="text-text-primary text-4xl lg:text-6xl font-montserrat font-bold mb-8 text-center">Meet the Team!</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-center items-center max-w-6xl mx-auto">
          
          <AboutMe 
            linkedIn="https://www.linkedin.com/in/jcwang27/"
            name="Justin Wang" 
            bio="BU community members browse and find events with available food" 
            imageUrl="https://media.licdn.com/dms/image/v2/D4D03AQEhOhCgj4GV0w/profile-displayphoto-shrink_400_400/B4DZSay.eZGkAg-/0/1737763842528?e=1748476800&v=beta&t=0zLCLhJ3vun1IbuDwb7yfW1rUl1CVsMVhJ7tCsIbr14"
          />
          
          <AboutMe 
            linkedIn="https://www.linkedin.com/in/thaodanghoang/"
            name="Thao Hoang" 
            bio="BU community members browse and find events with available food" 
            imageUrl="https://media.licdn.com/dms/image/v2/D4E03AQEpoI4OE6OXUA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1723077015556?e=1748476800&v=beta&t=8XxS_px1uzL4zrad7EYDgMP2cxlc0BO_rn1xAfgcEEk"
          />
          
          <AboutMe 
            linkedIn="https://www.linkedin.com/in/jiafei-fan-1a17b7335/"
            name="Jiafei Fan" 
            bio="BU community members browse and find events with available food" 
            imageUrl="https://media.licdn.com/dms/image/v2/D4E03AQFQfTSH-lu2KQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730228306674?e=1748476800&v=beta&t=dnIXD_HGa5vIYSdLLZYTegpU7zaTEuK5J8O4HBRs7dc"
          />
          
          <AboutMe 
            linkedIn="https://www.linkedin.com/in/j0rdanyin/"
            name="Jordan Yin" 
            bio="BU community members browse and find events with available food" 
            imageUrl="https://media.licdn.com/dms/image/v2/D4E03AQGn_QD1IpNFpA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1714795021781?e=1748476800&v=beta&t=gRzGmOnQgtBGSerDARbHOqICjOWeNefN7NE9Sjd469Q"
          />
        </div>
      </section>
      <FooterSection />
    </main>
  );
};

export default About;