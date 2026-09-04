import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import ImageUploader from "./ImageUploader";
import { getProductById, updateProduct } from "../../api/product";
import { Plus } from 'lucide-react';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        const data = response.data.product;

        console.log("PRODUCT DATA:", data);
        console.log("PRODUCT IMAGES:", data.images);

        setProduct(data);
        setTags(data.tags || []);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setTagInput("");
      return;
    }
    setTags([...tags, value]);
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const formData = new FormData(e.currentTarget);

      const data = {
        name: formData.get("name"),
        shortDescription: formData.get("shortDescription"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        discountPrice: Number(formData.get("discountPrice")),
        stock: Number(formData.get("stock")),
        sku: formData.get("sku"),
        category: formData.get("category"),
        subcategory: formData.get("subcategory"),
        brand: formData.get("brand"),
        tags: tags,
      };

      await updateProduct(id, data);

      alert("Product updated successfully");

      navigate("/dashboard/products");
    } catch (error) {
      console.error("Update product error:", error);
      alert("Failed to update product");
    } finally {
      setUpdating(false);
    }
  };
  const handleCancel = () => {
    navigate(-1);
  };


  return (
    <form
      onSubmit={handleUpdate}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >

      {/* ================= LEFT ================= */}
      <div className="bg-white rounded-3xl p-7 shadow-sm">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Product Gallery
          </h2>

          <p className="text-slate-500 mt-2">
            Keep existing images, add new ones, or remove selected assets
            before saving.
          </p>
        </div>

        <ImageUploader images={product?.images || []} />
      </div>


      {/* ================= RIGHT ================= */}
      <div className="bg-white rounded-3xl p-7 shadow-sm">

        <h2 className="text-2xl font-bold text-slate-900 mb-7">
          Product Information
        </h2>

        <div className="space-y-5 ">
          <label className="block mb-2 font-medium"> Product Name</label>
          <Input
            name="name"
            placeholder="Enter product name"
            className="h-14 w-full rounded-2xl border  bg-gray-100 px-5 outline-none transition focus:border-orange-400
            dark:border-slate-800  dark:text-black"
          />
          <label className="block mb-2 font-medium"> Short Description</label>
          <Input
            name="shortDescription"
            placeholder="Enter short description"
            className="h-14 w-full rounded-2xl border  bg-gray-100 px-5 outline-none transition focus:border-orange-400
            dark:border-slate-800  dark:text-black"
          />

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter product description"
              className="w-full min-h-[140px] px-5 py-3 rounded-xl ring-1 ring-slate-300 focus:ring-slate-500 outline-none"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Price */}
            <div>
              <label className="block mb-2 font-medium">
                Price
              </label>

              <Input
                type="number"
                name="price"
                placeholder="0"
                className="bg-gray-100 w-[300px] h-[50px] "
              />
            </div>


            {/* Discount Price */}
            <div>
              <label className="block mb-2 font-medium">
                Discount Price
              </label>

              <Input
                type="number"
                name="discountPrice"
                placeholder="0"
                className="bg-gray-100 w-[300px] h-[50px]"
              />
            </div>

          </div>


          <div className="grid gap-5 md:grid-cols-2">

            {/* Stock */}
            <div>
              <label className="block mb-2 font-medium">
                Stock
              </label>

              <Input
                type="number"
                name="stock"
                placeholder="0"
                className="bg-gray-100 w-[300px] h-[50px]"
              />
            </div>


            {/* SKU */}
            <div>
              <label className="block mb-2 font-medium">
                SKU
              </label>

              <Input
                name="sku"
                placeholder="Product SKU"
                className="bg-gray-100 w-[300px] h-[50px]"
              />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="font-medium">
                Category
              </label>

              <select
                id="category"
                name="category"
                className="mt-2 rounded-2xl border border-slate-200 bg-gray-100 w-[310px] h-[53px] px-5 outline-none transition focus:border-orange-400"
              >
                <option value="">Select Category</option>
                <option value="sports">Sports</option>
                <option value="beauty">Beauty</option>
                <option value="home">Home</option>
                <option value="fashion">Fashion</option>
                <option value="phones">Phones</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>

            <Input
              label="Subcategory"
              name="subcategory"
              placeholder="Subcategory"
              className="bg-gray-100 w-[300px] h-[50px] "
            />

          </div>
          <label className="block mb-2 font-medium">
            Brand
          </label>
          <Input
            name="brand"
            className="h-14 w-full rounded-2xl border  bg-gray-100 w-[300px] h-[50px] px-5 outline-none transition focus:border-orange-400
            dark:border-slate-800  dark:text-black"
            placeholder="Brand"
          />

          <div className="rounded-3xl border p-4 dark:border-slate-800 ">
            <label className="block mb-2 font-medium">
              Tags
            </label>

            <div className="flex gap-3">
              <Input
                name="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press +"
                className="h-14 flex-1 w-140 rounded-2xl border border-slate-200 bg-gray-100 px-5 outline-none transition focus:border-orange-400 dark:border-slate-800 dark:text-black"
              />

              <button
                type="button"
                onClick={handleAddTag}
                className="inline-flex h-10 mt-4 ml-3 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm transition hover:bg-orange-600"
              >
                   <Plus />

              </button>
            </div>

            {/* Tags list */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 px-4 py-2 text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-orange-500 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-5
                  py-4 dark:border-slate-800  dark:text-black">
              <input type="checkbox" />
              Featured

            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-5
                  py-4 dark:border-slate-800  dark:text-black">
              <input type="checkbox" />
              Active

            </label>
          </div>

          <div className="flex gap-3 pt-5">

            <Button type="button"
              onClick={handleCancel}
              className="px-6 py-3  rounded-xl border border-gray-300 hover:bg-gray-100 hover:text-black 
               transition"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={updating}
              className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 hover:text-black"
            >
              {updating ? "Updating..." : "Update Product"}
            </Button>

          </div>

        </div>

      </div>


    </form>
  );
}