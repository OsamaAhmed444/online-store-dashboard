function Button({
  type,
  onClick,
  className,
  disabled,
  loading,
  children,
  ...props
}) {
  const bestStyles =
    "px-6 py-2 text-[#FFF7ED] rounded-lg bg-[#F97316] hover:bg-[#F8923C] focus:ring-1 focus:ring-[#FFEDD5] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 cursor-pointer capitalize";
  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      className={`${bestStyles} ${className ? className : ""}  `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
