function Letter(props: {
  letter: string;
  size: number;
  guessed: boolean;
  phantom: boolean;
  typeInKeyboard: boolean;
  className?: string;
}) {
  let sizeClass: string;
  switch (props.size) {
    case 1:
      sizeClass = "w-3 h-3 text-[10px] rounded-xs border-[1.5px]";
      break;
    case 2:
      sizeClass = "w-5 h-5 text-base rounded border-[1.75px]";
      break;
    case 3:
      sizeClass = "w-6 h-6 text-lg rounded-sm border-2";
      break;
    case 4:
      sizeClass = "w-8 h-8 text-xl rounded-sm border-2";
      break;
    case 5:
      sizeClass = "w-10 h-10 text-2xl rounded-sm border-2";
      break;
    default:
      sizeClass = "w-6 h-6 text-lg rounded-sm border-2";
  }

  return (
    <div
      className={`${
        props.phantom && props.typeInKeyboard
          ? "border-transparent"
          : props.letter === "" || props.phantom
          ? "border-gray-400/50"
          : props.guessed
          ? "border-transparent"
          : "border-gray-500/50"
      } ${sizeClass} ${
        props.className
      } font-semibold flex justify-center items-center select-none`}
    >
      <span className={props.phantom ? "text-gray-500" : ""}>
        {props.letter}
      </span>
    </div>
  );
}

export default Letter;
