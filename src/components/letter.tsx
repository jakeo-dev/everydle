export default function Callout(props: {
  letter: string;
  className?: string;
  size?: number;
}) {
  let sizeClass: string;
  switch (props.size) {
    case 1:
      sizeClass = "w-3 h-3 text-xs rounded-none border-[1.5px]";
      break;
    case 2:
      sizeClass = "w-5 h-5 text-base rounded border-[1.5px]";
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
      sizeClass = "w-8 h-8 text-xl rounded-sm border-2";
  }

  return (
    <div
      className={`${
        props.letter == "" ? "border-gray-400/50" : "border-gray-500/50"
      } ${sizeClass} ${
        props.className
      } font-semibold flex justify-center items-center`}
    >
      <span>{props.letter}</span>
    </div>
  );
}
