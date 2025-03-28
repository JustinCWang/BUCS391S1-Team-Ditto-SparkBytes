import Link from "next/link"
import SecondaryButton from "./secondaryButton"
import MainButton from "./primaryButton"

function FirstNav () {
  return(
    <nav className="w-full px-4 py-4 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-sm sm:text-3xl font-poppins font-semibold text-text-primary">
          Spark!Bytes
        </Link>
        <div className="flex items-center justify-center gap-2 lg:gap-4">
          <Link href="/about" className="text-text-primary font-poppins font-semibold hidden md:block">
            About
          </Link>
          <SecondaryButton linkTo='/login' text='Log In' styling='text-xs lg:text-base'/>
          <MainButton linkTo='/signup' text='Sign Up' styling='text-xs lg:text-base'/>
        </div>
      </div>
    </nav>
  )
}

export default FirstNav;