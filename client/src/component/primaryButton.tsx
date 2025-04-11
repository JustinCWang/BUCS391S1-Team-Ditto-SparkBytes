import Link from "next/link";

interface MainButtonProps {
  text: string;
  linkTo: string;
  styling?: string;
}

function MainButton ({ text, linkTo, styling = "" }: MainButtonProps) {
  return (
    <Link 
      className={`
        bg-brand-primary 
        text-white font-poppins font-black
        cursor-pointer
        py-1.5 px-5 
        rounded-md 
        duration-300 ease-in hover:bg-hover-primary 
        flex items-center justify-center ${styling}`}
      href={linkTo}
    >
      {text}
    </Link>
  )
}

export default MainButton;