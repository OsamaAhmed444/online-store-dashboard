import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/products/ProductForm";
import { Store, Radio } from 'lucide-react'; // استدعاء أيقونة Radio أو Wifi مثلاً

export default function EditProductPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-950 to-slate-800 text-white rounded-3xl p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        {/* الجزء الأيمن (الكلام والزرار والعنوان) */}
        <div className="flex-1">
          <button
            onClick={() => navigate("/dashboard/products")}
            className="mb-6 rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20 transition-colors"
          >
            ← Back to products
          </button>

          {/* العنوان مع الأيقونة */}
          <div className="flex items-center gap-5 my-4">

            {/* مربع الأيقونة بخلفية وإطار */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-center backdrop-blur-sm shrink-0">
              <Store className="text-orange-400" size={32} />
            </div>

            {/* النصوص تحت بعضها بجانب الأيقونة */}
            <div>
              <p className="text-orange-300 tracking-[4px] text-xs font-semibold mb-1">
                EDIT PRODUCT
              </p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Update and refine the product entry
              </h1>
            </div>

          </div>
          <p className="text-slate-300 text-lg">
            Review the current product data, add new images,
            remove existing ones, and save your updates safely.
          </p>
        </div>

        {/* الجزء الأيسر (كرت الـ LIVE زي اللي في الصورة) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 min-w-[240px] backdrop-blur-sm">
          <div className="flex items-center gap-2 text-orange-400 mb-1">
            {/* أيقونة تدل على البث أو الاتصال المباشر */}
            <Radio size={18} className="animate-pulse" />
            <span className="text-xs font-bold tracking-wider">LIVE</span>
          </div>
          <p className="text-slate-300 text-sm">
            Connected to the real product update API.
          </p>
        </div>

      </div>

      <ProductForm />

    </div>
  );
}