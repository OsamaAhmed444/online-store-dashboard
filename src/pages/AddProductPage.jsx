import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api/product";

import {
  ImagePlus,
  Upload,
  Sparkles,
} from "lucide-react";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    category: "",
    subcategory: "",
    brand: "",
    featured: false,
  });

  // Handle inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;


    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

  
  try {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("shortDescription", formData.shortDescription);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("discountPrice", formData.discountPrice);
    data.append("stock", formData.stock);
    data.append("sku", formData.sku);
    data.append("category", formData.category);
    data.append("subcategory", formData.subcategory);
    data.append("brand", formData.brand);
    data.append("featured", formData.featured);

    images.forEach((image) => {
      data.append("images", image);
    });

//     console.log("NUMBER OF IMAGES:", images.length);

// images.forEach((image) => {
//   console.log("IMAGE:", image.name, image.type, image.size);
// });

    const response = await addProduct(data);

    console.log("Product added:", response.data);

    navigate(-1);

  } catch (error) {
    console.log("STATUS:", error.response?.status);
    console.log("BACKEND ERROR:", error.response?.data);
  }
  };

  // Cancel
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="m-10 flex flex-col gap-8">

      {/* ================= HEADER ================= */}
      <div className="border rounded-lg p-4 flex items-end justify-between">

        <div className="flex flex-col gap-4">

          {/* Back Button */}
          <div>
            <button
              type="button"
              className="bg-amber-600 cursor-pointer text-white rounded-lg py-1 px-2"
              onClick={() => navigate(-1)}
            >
              Back to products
            </button>
          </div>

          {/* Title */}
          <div className="flex gap-4 items-center">

            <div className="bg-cyan-100 text-cyan-500 p-3 rounded-2xl">
              <ImagePlus size={25} />
            </div>

            <div className="flex flex-col gap-2">
              <p className="tracking-widest">
                Create Product
              </p>

              <h2 className="text-2xl font-bold">
                Launch a polished product entry
              </h2>
            </div>

          </div>

          <p>
            Add products with validation, image previews,
            multi-upload support, and smooth UX.
          </p>

        </div>

        {/* Ready Box */}
        <div className="p-2 border flex flex-col gap-2 rounded-lg">
          <p className="tracking-widest">
            Ready
          </p>

          <p>
            Create, validate, and save with one click.
          </p>
        </div>

      </div>


      {/* ================= MAIN ================= */}
      <div className="grid grid-cols-12 gap-6">


        {/* ================================================= */}
        {/* LEFT - GALLERY */}
        {/* ================================================= */}

        <div className="col-span-12 lg:col-span-5 border rounded-3xl bg-white p-6">

          {/* Gallery Header */}
          <div className="flex items-center gap-3 mb-6">

            <div className="bg-cyan-100 text-cyan-500 p-3 rounded-2xl">
              <ImagePlus size={25} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Gallery
              </h2>

              <p className="text-sm text-gray-500">
                Upload multiple images and preview instantly.
              </p>
            </div>

          </div>


          {/* Image Preview */}
          {/* <div className="border rounded-3xl overflow-hidden w-full max-w-sm"> */}

          {previewImages.length > 0 ? (
  <div className="grid grid-cols-2 gap-4">
    {previewImages.map((image, index) => (
      <div
        key={index}
        className="border rounded-3xl overflow-hidden"
      >
        <img
          src={image}
          alt={`Product ${index + 1}`}
          className="w-full h-64 object-cover"
        />

        <div className="px-4 py-3">
          <p className="text-xs tracking-[4px] text-gray-400">
            IMAGE {index + 1}
          </p>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="border rounded-3xl overflow-hidden w-full max-w-sm">
    <img
      src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600"
      alt="Product"
      className="w-full h-64 object-cover"
    />

    <div className="px-4 py-3">
      <p className="text-xs tracking-[4px] text-gray-400">
        IMAGE 1
      </p>
    </div>
  </div>
)}
{/* 
            <div className="px-4 py-3">
              <p className="text-xs tracking-[4px] text-gray-400">
                IMAGE 1
              </p>
            </div> */}

          {/* </div> */}


          {/* Upload Box */}
          <div className="mt-6">

            <label
              htmlFor="images"
              className="border-2 border-dashed border-cyan-200 bg-cyan-50/40 rounded-3xl h-40 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-cyan-50 transition"
            >

              <Upload
                size={28}
                className="text-cyan-400 mb-3"
              />

              <p className="font-semibold text-gray-700">
                Upload images
              </p>

              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, WEBP • multiple files supported
              </p>

            </label>

            <input
              id="images"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
          onChange={(e) => {
  const files = Array.from(e.target.files);

  setImages(files);

  const previews = files.map((file) =>
    URL.createObjectURL(file)
  );

  setPreviewImages(previews);
}}
            />

          </div>


          {/* UX Box */}
          <div className="mt-6 border border-emerald-100 bg-emerald-50/40 rounded-3xl p-5">

            <div className="flex gap-2 items-center text-emerald-500">

              <Sparkles size={18} />

              <span className="font-semibold">
                Senior UX
              </span>

            </div>

            <p className="text-sm text-gray-400 mt-2">
              Optimized product creation experience with
              responsive design and instant preview.
            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* RIGHT - PRODUCT FORM */}
        {/* ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="col-span-12 lg:col-span-7 border rounded-3xl bg-white p-6"
        >


          {/* Product Name */}
          <div className="mb-5">

            <label className="block text-sm font-medium mb-2">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="iPhone 16 Pro"
              className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 outline-none focus:border-cyan-400"
            />

          </div>


          {/* Short Description */}
          <div className="mb-5">

            <label className="block text-sm font-medium mb-2">
              Short Description
            </label>

            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Minimum 10 characters"
              className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 outline-none focus:border-cyan-400"
            />

          </div>


          {/* Description */}
          <div className="mb-5">

            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Minimum 20 characters"
              rows="5"
              className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 outline-none resize-none focus:border-cyan-400"
            />

          </div>


          {/* Price + Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            {/* Price */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="100"
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 outline-none focus:border-cyan-400"
              />

            </div>


            {/* Discount Price */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Discount Price
              </label>

              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="90"
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 outline-none focus:border-cyan-400"
              />

            </div>

          </div>


          {/* Stock + SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            {/* Stock */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 outline-none focus:border-cyan-400"
              />

            </div>


            {/* SKU */}
            <div>

              <label className="block text-sm font-medium mb-2">
                SKU
              </label>

              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="SKU-001"
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 outline-none focus:border-cyan-400"
              />

            </div>

          </div>


          {/* Category + Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

            {/* Category */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 outline-none focus:border-cyan-400"
              >

                <option value="">
                  Select Category
                </option>

                <option value="electronics">
                  Electronics
                </option>

                <option value="phones">
                  Phones
                </option>

                <option value="fashion">
                  Fashion
                </option>

                <option value="home">
                  Home
                </option>

                <option value="beauty">
                  Beauty
                </option>

                <option value="sports">
                  Sports
                </option>

              </select>

            </div>


            {/* Subcategory */}
            <div>

              <label className="block text-sm font-medium mb-2">
                Subcategory
              </label>

              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                placeholder="Smartphones"
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 outline-none focus:border-cyan-400"
              />

            </div>

          </div>


          {/* Brand */}
          <div className="mb-5">

            <label className="block text-sm font-medium mb-2">
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Apple"
              className="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 outline-none focus:border-cyan-400"
            />

          </div>


          {/* Featured */}
          <div className="flex items-center gap-3 mb-6">

            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4"
            />

            <label
              htmlFor="featured"
              className="text-sm"
            >
              Featured Product
            </label>

          </div>


          {/* Buttons */}
          <div className="flex justify-end gap-3">

            {/* Cancel */}
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>


            {/* Submit */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition"
            >
              Add Product
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}