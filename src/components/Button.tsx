import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className: string;
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
};

function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`${props.className} flex bg-gray-200 hover:bg-gray-300 active:bg-gray-400/50 text-black text-center justify-center rounded-lg px-3.5 py-1 transition-all`}
      ref={props.ref}
      style={props.style}
    >
      {props.children}
    </button>
  );
}

export default Button;
