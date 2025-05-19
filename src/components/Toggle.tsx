import React, { SetStateAction } from "react";

type ToggleProps = {
  state: boolean;
  setState: (value: SetStateAction<boolean>) => void;
  text: string;
  subtext?: string;
};

function Toggle(props: ToggleProps) {
  return (
    <>
      <button
        onClick={() => {
          props.setState(!props.state);
        }}
        className="flex items-center mt-2 md:mt-3"
      >
        <div
          className={`${
            props.state
              ? "bg-green-600/60 hover:bg-green-600/50 active:bg-green-600/40"
              : "bg-gray-400/30 hover:bg-gray-400/40 active:hover:bg-gray-400/50"
          } w-6 h-6 rounded-md cursor-pointer transition`}
        ></div>
        <label className="text-sm text-pretty pl-2 cursor-pointer">
          {props.text}
        </label>
      </button>
      <label className="block text-gray-600 text-[0.65rem] md:text-xs text-pretty text-left pl-8">
        {props.subtext}
      </label>
    </>
  );
}

export default Toggle;
