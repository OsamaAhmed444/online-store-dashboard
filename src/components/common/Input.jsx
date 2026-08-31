import React from "react";

export default function Input({
  type,
  name,
  id,
  className,
  label,
  value,
  placeholder,
  onChange,
  error,
  ...props
}) {
  const bestStyles =
    "px-6 py-2 ring-1 rounded-lg focus:ring-slate-400 disabled:cursor-not-allowed transition-all duration-300";

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <label htmlFor={id ? id : name}>{label}</label>
      <input
        type={type}
        name={name}
        id={id ? id : name}
        className={`${bestStyles} ${className ? className : ""} ${error ? "ring-red-600" : "ring-slate-700"}`}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
      <div
        className={`px-4 py-2 rounded-lg bg-white flex justify-center gap-2 ${error ? "flex" : "hidden"}`}
      >
        {error}
      </div>
    </div>
  );
}
