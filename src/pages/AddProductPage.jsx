import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api/product";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { ImagePlus, Upload, Sparkles } from "lucide-react";
import ImageUploader from "../components/products/ImageUploader";

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
  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   setFormData({
  //     ...formData,
  //     [name]: type === "checkbox" ? checked : value,
  //   });
  // };

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
      <div className="border rounded-lg p-4 flex items-end justify-between border-[var(--input)]  outline-none ">
        <div className="flex flex-col gap-4">
          {/* Back Button */}
          <div>
            <Button
              type="button"
              className=" cursor-pointer text-white rounded-lg py-1 px-2 outline-none"
              onClick={() => navigate(-1)}
            >
              Back to products
            </Button>
          </div>

          {/* Title */}
          <div className="flex gap-4 items-center ">
            <div className="bg-cyan-100 text-cyan-500 p-3 rounded-2xl">
              <ImagePlus size={25} />
            </div>

            <div className="flex flex-col gap-2">
              <p className="tracking-widest">Create Product</p>

              <h2 className="text-2xl font-bold">
                Launch a polished product entry
              </h2>
            </div>
          </div>

          <p>
            Add products with validation, image previews, multi-upload support,
            and smooth UX.
          </p>
        </div>

        {/* Ready Box */}
        <div className="p-2 border flex flex-col gap-2 rounded-lg border-[var(--input)] outline-none">
          <p className="tracking-widest">Ready</p>

          <p>Create, validate, and save with one click.</p>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="grid grid-cols-12 gap-6 ">
        {/* ================================================= */}
        {/* LEFT - GALLERY */}
        {/* ================================================= */}

      <ImageUploader images={images} setImages={setImages} previewImages={previewImages} setPreviewImages={setPreviewImages} />
        {/* ================================================= */}
        {/* RIGHT - PRODUCT FORM */}
        {/* ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="col-span-12 lg:col-span-7 border border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none rounded-3xl bg-white p-6"
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
              // onChange={handleChange}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="iPhone 16 Pro"
              className="w-full bg-gray-100 border  rounded-2xl p-4 outline-none border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none"
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
              // onChange={handleChange}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              placeholder="Minimum 10 characters"
              className="w-full bg-gray-100 border  rounded-2xl p-4 outline-none border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none"
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
              // onChange={handleChange}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Minimum 20 characters"
              rows="5"
              className="w-full bg-gray-100 border  rounded-2xl p-4 outline-none resize-none border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none"
            />
          </div>

          {/* Price + Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                // onChange={handleChange}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="100"
                className="w-full bg-gray-100 border border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none rounded-2xl p-4 outline-none "
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
                // onChange={handleChange}
                onChange={(e) =>
                  setFormData({ ...formData, discountPrice: e.target.value })
                }
                placeholder="90"
                className="w-full bg-gray-100 border border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none rounded-2xl p-4 outline-none "
              />
            </div>
          </div>

          {/* Stock + SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Stock */}
            <div>
              <label className="block text-sm font-medium mb-2">Stock</label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                // onChange={handleChange}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                placeholder="0"
                className="w-full bg-gray-100 border border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none rounded-2xl p-4 outline-none "
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium mb-2">SKU</label>

              <input
                type="text"
                name="sku"
                value={formData.sku}
                // onChange={handleChange}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                placeholder="SKU-001"
                className="w-full bg-gray-100 border border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none rounded-2xl p-4 outline-none "
              />
            </div>
          </div>

          {/* Category + Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>

              <select
                name="category"
                value={formData.category}
                // onChange={handleChange}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-gray-100 border border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none rounded-2xl p-4 outline-none "
              >
                <option value="">Select Category</option>

                <option value="electronics">Electronics</option>

                <option value="phones">Phones</option>

                <option value="fashion">Fashion</option>

                <option value="home">Home</option>

                <option value="beauty">Beauty</option>

                <option value="sports">Sports</option>
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
                // onChange={handleChange}
                onChange={(e) =>
                  setFormData({ ...formData, subcategory: e.target.value })
                }
                placeholder="Smartphones"
                className="w-full bg-gray-100 border border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none rounded-2xl p-4 outline-none "
              />
            </div>
          </div>

          {/* Brand */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">Brand</label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              // onChange={handleChange}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              placeholder="Apple"
              className="w-full bg-gray-100 border  rounded-2xl p-4 outline-none border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              // onChange={handleChange}
              onChange={(e) =>
                setFormData({ ...formData, featured: e.target.checked })
              }
              className="w-4 h-4"
            /> 

            <label htmlFor="featured" className="text-sm">
              Featured
            </label>


                <input
              type="checkbox"
              id="active"
              name="active"
              checked={true}
              // onChange={handleChange}
            
              className="w-4 h-4"
            />

            <label htmlFor="active" className="text-sm">
              Active
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            {/* Cancel */}
            <Button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 opacity-50 rounded-xl border border-gray-300 transition"
            >
              Cancel
            </Button>

            {/* Submit */}
            <Button
              type="submit"
              className="px-6 py-3 rounded-xl  text-white font-semibold  transition"
            >
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
