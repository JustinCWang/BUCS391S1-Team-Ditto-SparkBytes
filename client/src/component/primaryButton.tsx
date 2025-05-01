import Link from "next/link";

/**
 * Props for MainButton
 * 
 * @param text - The label to display inside the button
 * @param linkTo - The URL path the button should navigate to
 * @param styling - Optional additional Tailwind classes for custom styling
 */
interface MainButtonProps {
  text: string;
  linkTo: string;
  styling?: string;
}

/**
 * Reusable styled button component for primary actions.
 * Renders as a Next.js <Link> with default brand styling.
 */
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