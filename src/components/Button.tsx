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
      className={`${props.className} flex cursor-pointer justify-center rounded-lg bg-neutral-400/30 px-3.5 py-1 text-center text-black transition-all active:bg-neutral-400/50 md:hover:bg-neutral-400/40 md:active:bg-neutral-400/50 dark:bg-neutral-600/30 dark:text-white dark:active:bg-neutral-600/50 dark:md:hover:bg-neutral-600/40 dark:md:active:bg-neutral-600/50`}
      ref={props.ref}
      style={props.style}
    >
      {props.children}
    </button>
  );
}

export default Button;
