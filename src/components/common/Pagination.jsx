import React from 'react'

export default function Pagination({setCurrentPage,totalPages,currentPage}) {
  const arrPages=[]

  const length = totalPages

  for(let i=1;i<=length;i++){
    arrPages.push(i)
  }
console.log(arrPages)
  return (
  <div className="flex justify-center items-center gap-2 mt-8">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
    className="px-3 py-2 border rounded-lg disabled:opacity-40 text-[15px] cursor-pointer"
  >
    Previous
  </button>

  {arrPages.map((pageNumber,index)=>{
  return  <button key={index} onClick={()=>setCurrentPage(pageNumber)} className={`cursor-pointer border py-1 px-2 rounded-md opacity-45 border-[var(--border)] outline-none ${  currentPage===pageNumber?"bg-[var(--main)] text-[var(--primary)] opacity-100 ":""}` }>{pageNumber}</button>
  })}

  {/* {Array.from({ length: totalPages }, (_ , index) => (
    <button
      key={index}
      onClick={() => setCurrentPage(index + 1)}
      className={`px-3 py-2 rounded-lg border ${
        currentPage === index + 1
          ? "bg-[var(--main)] text-[var(--primary)]"
          : ""
      }`}
    >
      {index + 1}
    </button>
  ))} */}

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((prev) => prev + 1)}
    className="px-3 py-2 border rounded-lg disabled:opacity-40 text-[15px] cursor-pointer"
  >
    Next
  </button>
</div>
  )
}
