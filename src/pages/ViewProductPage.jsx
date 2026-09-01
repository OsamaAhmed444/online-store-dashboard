
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/product";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";

function ViewProductPage() {

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 const {id} = useParams()
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        console.log("PRODUCT ID:", id);

        const response = await getProductById(id);

        console.log("FULL RESPONSE:", response);
        console.log("RESPONSE DATA:", response.data);

        setProduct(response.data.product);
      } catch (err) {
        console.error("API ERROR:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    // مهم: ما نعملش request لو مفيش id
    if (id) {
      fetchProduct();
    } else {
      setLoading(false);
      setError("Product ID not found");
    }
  }, [id]);

  if (loading) {
    return (
    <Spinner/>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <EmptyState/>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        Product not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-100 min-h-screen">

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-100 to-white rounded-3xl p-8 mb-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2  mb-6 cursor-pointer"
        >
          ← Back
        </button>

        <div className="flex items-center gap-4">
          <div className="text-3xl">
            👁
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {product.name}
            </h1>

            <p className="">
              Product details overview
            </p>
          </div>
        </div>
      </div>

      {/* Product */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT - IMAGE */}
        <div className="col-span-7">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            {product.images.map((img,index)=>{
            return  <div key={index}>
                 <img
              src={img.url}
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
            </div>

            })}

            {/* <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-[450px] object-cover"
            /> */}

          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-5 space-y-5">

          {/* Overview */}
          <div className="bg-white rounded-3xl p-7 shadow-sm">

            <p className="text-blue-500 text-sm mb-3">
              OVERVIEW
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {product.name}
            </h2>

            <p className="text-slate-600 leading-7">
              {product.description}
            </p>

          </div>

          {/* Price + Discount */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-slate-500 mb-3">
                PRICE
              </p>

              <p className="text-2xl font-bold">
                ${product.price}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-slate-500 mb-3">
                DISCOUNT
              </p>

              <p className="text-2xl font-bold">
                ${product.discount || 0}
              </p>
            </div>

          </div>

          {/* Stock + SKU */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-slate-500 mb-3">
                STOCK
              </p>

              <p className="text-2xl font-bold">
                {product.stock}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-slate-500 mb-3">
                SKU
              </p>

              <p className="text-2xl font-bold">
                {product.sku}
              </p>
            </div>

            

          </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              
              <p className="text-sm text-slate-500 mb-3">
                tags
              </p>
              <p className="text-2xl font-bold">
                #{product.tags[0]}
              </p>
            </div>

             

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              
              <p className="text-sm text-slate-500 mb-3">
                Category Information
              </p>
              <p className="text-2xl font-bold">
                {product.category}.{product.subcategory}.{product.brand}
              </p>
            </div>


            
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              
              <p className="text-sm text-slate-500 mb-3">
                Highlights
              </p>
              <p className="text-md ">
                {product.shortDescription}
                </p>
            </div>

            


        </div>
      </div>
    </div>
  );
}

export default ViewProductPage;

