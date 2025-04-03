import Image from 'next/image';

// Define an interface to specify the types of props that the AboutMe component will accept
interface AboutMeProps {
  name: string;        // The name of the group member
  bio: string;         // The bio of the group member
  imageUrl: string;    // The URL of the group member's image
  linkedIn: string;
}

// Define a functional React component named AboutMe that accepts props of type AboutMeProps
const AboutMe: React.FC<AboutMeProps> = ({ name, bio, imageUrl, linkedIn }) => {
  return (
    <a target="_blank" href={linkedIn}>
      <div className="border-2 border-text-primary rounded-lg px-4 py-8 shadow-lg">
        {/** Container for the actual image and text */}
        <div className="flex flex-col text-center">
          <Image 
            src={imageUrl}
            alt={`${name}'s profile`}
            width={160}
            height={160}
            className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
          />
          {/** Container for the text and also has a text box so that if there is overflow the cards won't be so different in height */}
          <div className="text-text-primary ">
          <h2 className="text-2xl lg:text-3xl font-montserrat font-bold my-6">{name}</h2>
            <div className="font-inter text-text-primary text-sm lg:text-base max-w-xs mx-auto overflow-y-auto"
              style={{ maxHeight: '100px' }} // Or adjust based on how much space you want
            >
              {bio}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default AboutMe;