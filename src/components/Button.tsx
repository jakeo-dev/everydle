import React, { forwardRef } from "react";

type ButtonProps = {
  children: React.ReactNode;
  className: string;
  onClick: () => void;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <button
      onClick={props.onClick}
      className={`${props.className} flex bg-gray-200 hover:bg-gray-300 active:bg-gray-400/50 text-black text-center justify-center rounded-lg px-3.5 py-1 transition-all`}
      ref={ref}
    >
      {props.children}
    </button>
  );
});

export default Button;
