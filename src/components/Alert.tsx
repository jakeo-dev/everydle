function Alert(props: {
  text: string;
  color: string;
}) {
  return (
    <div
      role="alert"
      className="mx-auto min-w-50 max-w-fit h-auto text-white relative bottom-[15px] rounded-md py-1 px-2 animate-[alert-fade-out_3s_ease-in_forwards] motion-reduce:animate-none"
      style={{backgroundColor: props.color}}
    >
      {props.text}
    </div>
  );
}

export default Alert;
