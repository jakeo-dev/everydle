import React, { SetStateAction } from "react";

function Toggle(props: {
  state: boolean;
  setState: (value: SetStateAction<boolean>) => void;
  onClick?: () => void;
  disabled?: boolean;
  text: string;
  subtext?: string;
}) {
  return (
    <>
      <button
        onClick={() => {
          props.setState(!props.state);
          if (props.onClick) props.onClick();
        }}
        disabled={props.disabled}
        className="flex items-center mt-2 md:mt-3"
      >
        <div
          className={`${
            props.state && !props.disabled
              ? "on-toggle"
              : props.state && props.disabled
              ? "on-toggle-disabled"
              : !props.state && props.disabled
              ? "off-toggle-disabled"
              : "off-toggle"
          } w-6 h-6 rounded-md transition`}
        />
        <label
          className={`${
            props.disabled
              ? "text-gray-500 cursor-not-allowed"
              : "cursor-pointer"
          } text-sm text-pretty pl-2`}
        >
          {props.text}
        </label>
      </button>
      <label
        className={`${
          props.disabled ? "text-gray-400" : "text-gray-600"
        } block text-[0.65rem] md:text-xs text-pretty text-left pl-8`}
      >
        {props.subtext}
      </label>
    </>
  );
}

export default Toggle;
