import React from "react";

function Spinner(props) {
  const size = props.size || "md";
  const text = props.text || "";

  let spinnerSize = "w-8 h-8 border-4";

  if (size === "sm") {
    spinnerSize = "w-5 h-5 border-2";
  }

  if (size === "lg") {
    spinnerSize = "w-12 h-12 border-4";
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={spinnerSize + " border-gray-300 border-t-blue-600 rounded-full animate-spin"}
      ></div>

      {text !== "" ? <p className="text-sm text-gray-600">{text}</p> : null}
    </div>
  );
}

export default Spinner;