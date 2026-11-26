import React from "react";

function Button(props: {
  children: React.ReactNode;
  className: string;
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={props.onClick}
      className={`${props.className} flex cursor-pointer justify-center rounded-lg bg-neutral-400/30 px-3.5 py-1 text-center text-black transition-all hover:bg-neutral-400/40 active:hover:bg-neutral-400/50`}
      ref={props.ref}
      style={props.style}
    >
      {props.children}
    </button>
  );
}

export default Button;
