
export default function Input({ type, name, id, className, label, value, placeholder, onChange, error, ...props }) {
  const bestStyles = "px-6 py-2 ring-1 rounded-lg outline-none bg-[#FFF7ED] focus:ring-[#F97316] disabled:cursor-not-allowed transition-all duration-300";

  return (
    <div className="flex flex-col justify-start items-start gap-3 w-full">

      <label htmlFor={id ? id : name} className="text-[#F97316] font-medium ">{label}</label>
      <input type={type} name={name} id={id ? id : name} className={`${bestStyles} ${className ? className : ""} ${error ? "ring-red-600" : "ring-[#FFEDD5]"}`} value={value} placeholder={placeholder} onChange={onChange} {...props} />
      <div className={`px-4 py-2 rounded-lg bg-white flex justify-center gap-2 absolute z-50 right-4 top-3 ring-1 ring-[#F97316] ${error ? "flex" : "hidden"}`}>{error}</div>

    </div>
  )
}
