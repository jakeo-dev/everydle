function Alert(props: {
  text: string;
  color: "neutral" | "red" | "green";
  length: "short" | "long";
}) {
  return (
    <div
      role="alert"
      className={`relative bottom-[15px] mx-auto h-auto max-w-fit min-w-50 ${props.length === "long" ? "animate-[alert-fade-out_8s_ease-in_forwards]" : "animate-[alert-fade-out_3s_ease-in_forwards]"} rounded-md bg-green-500 px-3 py-1.5 text-white motion-reduce:animate-none`}
      style={{
        backgroundColor:
          props.color === "red"
            ? "#fb2c36"
            : props.color === "green"
              ? "#00a63e"
              : "#525252",
      }}
    >
      {props.text}
    </div>
  );
}

export default Alert;
