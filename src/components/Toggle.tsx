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
        className="mt-2 flex items-center md:mt-3"
        aria-labelledby={`${props.text.replace(/\s+/g, "").toLowerCase()}Label`}
        aria-pressed={props.state}
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
          } h-6 w-6 rounded-md transition`}
          aria-hidden
        />
        <span
          className={`${
            props.disabled
              ? "cursor-not-allowed text-gray-500"
              : "cursor-pointer"
          } pl-2 text-sm text-pretty`}
          id={`${props.text.replace(/\s+/g, "").toLowerCase()}Label`}
        >
          {props.text}
        </span>
      </button>
      <label
        className={`${
          props.disabled ? "text-gray-400" : "text-gray-600"
        } block pl-8 text-left text-[0.65rem] text-pretty md:text-xs`}
      >
        {props.subtext}
      </label>
    </>
  );
}

export default Toggle;
