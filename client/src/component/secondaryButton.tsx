import Link from "next/link";

interface SecondaryButtonProps {
  text: string;
  linkTo: string;
  styling?: string;
}

function SecondaryButton ({ text, linkTo, styling = "" }: SecondaryButtonProps) {
  return (
    <Link 
      className={`
        bg-white
        dark:bg-transparent
        text-brand-primary 
        cursor-pointer
        font-poppins font-black 
        py-1.5 px-5 
        rounded-md border border-brand-primary
        duration-300 ease-in hover:bg-brand-primary 
        dark:hover:text-white hover:text-white 
        flex items-center justify-center ${styling}`}
      href={linkTo}
    >
      {text}
    </Link>
  )
}

export default SecondaryButton;