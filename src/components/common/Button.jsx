import React from 'react'

function Button({ type, onClick, className, disabled, loading, children, ...props }) {
  const bestStyles = "px-4 py-2 text-white rounded-lg bg-slate-700 hover:bg-slate-800 focus:ring-1 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300"
  return (
    <button type={type ? type : "button"} onClick={onClick} className={`${bestStyles} ${className ? className : ""}  `} disabled={disabled || loading} {...props}>{loading ? "Loading..." : children}</button>
  )
}

export default Button;
