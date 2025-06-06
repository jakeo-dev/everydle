import { getSizeClass } from "@/utility";

function Letter(props: {
  letter: string;
  size: number;
  guessed: boolean;
  phantom: boolean;
  typeInKeyboard: boolean;
  compactMode: boolean;
  guessedWordsLength: number;
  className?: string;
}) {
  return (
    <div
      className={`${
        props.phantom &&
        props.typeInKeyboard &&
        !props.compactMode &&
        props.guessedWordsLength > 0
          ? "border-transparent"
          : props.letter === "" || props.phantom
          ? "border-gray-400/50"
          : props.guessed
          ? "border-transparent"
          : "border-gray-500/50"
      } ${getSizeClass(props.size)} ${
        props.className
      } font-semibold flex justify-center items-center select-none`}
    >
      <span
        className={`${props.phantom ? "text-green-700/60" : ""} -mb-[0.09rem]`}
      >
        {props.letter}
      </span>
    </div>
  );
}

export default Letter;
