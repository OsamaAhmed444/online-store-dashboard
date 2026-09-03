import React from "react";

function EmptyState(props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {props.title}
      </h3>

      {props.message ? (
        <p className="text-sm text-gray-500 mb-4">
          {props.message}
        </p>
      ) : null}

      {props.action ? <div>{props.action}</div> : null}
    </div>
  );
}

export default EmptyState;