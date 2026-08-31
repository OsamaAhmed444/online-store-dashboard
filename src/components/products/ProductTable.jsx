import React, { useState } from "react";
// Import Swiper React components
import { Navigate, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import Button from "../common/Button";
// import required modules
import { Pagination, Navigation } from "swiper/modules";
import { Eye } from "lucide-react";
import { Pencil } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Star } from "lucide-react";
const arr = [
  { icon: <Eye size={15} />, text: "View" },
  {
    icon: <Pencil size={15} />,
    text: "Edit",
  },
  {
    icon: <SlidersHorizontal size={15} />,
    text: "Quick Edit",
  },
];

export default function ProductTable({ products, setProducts }) {


  const navigate = useNavigate()
  function handleDelete(id) {
    setProducts(products.filter((pro) => pro._id !== id));
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 gap-4">
        {products.map((product) => {
          return (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden relative border-blue-800"
            >
              <button className="absolute top-4 z-10 left-4 bg-amber-500 flex gap-1 items-center justify-center rounded-lg py-1 px-2 cursor-text">
                <Star size={13} />
                <span className="text-[11px]" style={{ color: "var(--text)" }}>
                  Featured
                </span>
              </button>

              {/* <div
                  className="rounded flex gap-1 items-center justify-center absolute top-4 left-4 z-10"
                  style={{ background: "var(--primary)" }}
                >
                  <Star size={15} />
                  <span className="text-sm" style={{ color: "var(--text)" }}>
                    Featured
                  </span>
                </div> */}

              <div className="border  h-64 overflow-hidden group product border-red-600 relative">
                <Button className="absolute z-10  bg-amber-500 rounded-xl absolute z-10 right-4 bottom-4 text-[13px] py-1 px-2">
                  {product.stock > 0
                    ? `${product.stock} in Stock`
                    : "Out Of Stock"}
                </Button>

                <Swiper
                  className="w-full h-full"
                  slidesPerView={1}
                  spaceBetween={10}
                  loop={true}
                  autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true}
                  modules={[Pagination, Navigation, Autoplay]}
                >
                  {product.images?.map((image) => (
                    <SwiperSlide key={image.public_id}>
                      <img
                        src={image.url}
                        alt={product.name}
                        className="w-full h-60 object-cover group-hover:scale-103 transition duration-300"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="min-h-60">
                <div className="ml-8 mb-2 ">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="opacity-50 uppercase text-sm mt-2 mb-2 ">
                    {product.category}.{product.subcategory}.{product.brand}
                  </p>
                  <p className="text-sm mb-2 line-clamp-2 overflow-hidden">
                    {product.shortDescription}
                  </p>
                  <h2 className="font-bold text-2xl">
                    ${product.price}&nbsp;&nbsp;&nbsp;
                    <sub className="text-sm">-${product.discountPrice}off</sub>
                  </h2>
                </div>
                <div className="flex gap-2 ml-8 mb-2 ">
                  {product.tags.map((tag) => {
                    return (
                      <span className="border p-1 rounded-3xl border-[#999] opacity-50 px-2">
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              <hr></hr>

              <div className="mb-2">
                <div className="flex gap-1 py-2">
                  {arr.map((item) => {
                    return (
                      <button
                        className="ml-8 flex gap-1 items-center p-1 px-2 rounded-lg bg-gray-300"
                        onClick={() => {
                          if (item.text === "View") {
                          
                          
                            navigate(`/dashboard/products/${product._id}/view`);
                          }
                          else if(item.text === "Edit"){
                              navigate(`/dashboard/products/${product._id}/edit`);

                          }else{
                              navigate(`/dashboard/products/${product._id}/quickedit`);

                          }
                        }}
                      >
                        <span>{item.icon}</span>
                        <span className="text-[11px]">{item.text}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-gray-300 rounded-lg flex gap-1  py-1 px-2 mr-4 text-[11px] cursor-pointer"
                    onClick={() => handleDelete(product._id)}
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
