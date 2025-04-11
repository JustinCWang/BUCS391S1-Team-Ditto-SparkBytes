interface TextToSpanProps {
  text: string
  splitBySpace: boolean
}

// Takes in the different span checks where if you want to break it up by space or if you don't
export default function TextToSpan({text, splitBySpace}:TextToSpanProps) {
  return(
    <>
      {splitBySpace === true ? 
        <> 
          {text.split(" ").map((word, index) => (
            <span
              key={index}
              className="inline-block text-inherit"
            >
              {text.split(" ").length === index + 1 ? word: word + "\u00A0"}
            </span>
          ))}
        </> : 
        <> 
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block text-inherit"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </>
    }
    </>
  );
}