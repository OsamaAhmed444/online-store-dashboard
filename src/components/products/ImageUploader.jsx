import React from 'react'
import { ImagePlus, Upload, Sparkles } from "lucide-react";
export default function ImageUploader({images,setImages,previewImages,setPreviewImages}) {
  return (
      <div className="col-span-12 lg:col-span-5 border rounded-3xl bg-white p-6 border-[var(--input)] outline-none">
          {/* Gallery Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-cyan-100 text-cyan-500 p-3 rounded-2xl">
              <ImagePlus size={25} />
            </div>

            <div>
              <h2 className="text-xl font-bold">Gallery</h2>

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
                <div key={index} className="border rounded-3xl overflow-hidden border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none">
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
            <div className="border border-[var(--input)]  focus:border-[var(--input-focus)] focus:outline-none rounded-3xl overflow-hidden w-full max-w-sm">
              <img
                src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600"
                alt="Product"
                className="w-full h-64 object-cover"
              />

              <div className="px-4 py-3">
                <p className="text-xs tracking-[4px] text-gray-400">IMAGE 1</p>
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
              className="border-2 border-dashed border-[var(--input)] bg-cyan-50/40 rounded-3xl h-40 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-cyan-50 transition"
            >
              <Upload size={28} className="text-cyan-400 mb-3" />

              <p className="font-semibold text-gray-700">Upload images</p>

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

  // إضافة الصور الجديدة للصور القديمة
  setImages((prev) => [...prev, ...files]);

  // إنشاء previews للصور الجديدة
  const newPreviews = files.map((file) =>
    URL.createObjectURL(file)
  );

  setPreviewImages((prev) => [...prev, ...newPreviews]);

  // عشان تقدري تختاري نفس الصورة مرة تانية
  e.target.value = "";
                // const files = Array.from(e.target.files);

                // setImages(files);

                // const previews = files.map((file) => URL.createObjectURL(file));

                // setPreviewImages(previews);
              }}
            />
          </div>

          {/* UX Box */}
          <div className="mt-6 border opacity-40 border-emerald-100 bg-emerald-50/40 rounded-3xl p-5">
            <div className="flex gap-2 items-center text-emerald-500">
              <Sparkles size={18} />

              <span className="font-semibold">Senior UX</span>
            </div>

            <p className="text-sm text-gray-400 mt-2">
              Optimized product creation experience with responsive design and
              instant preview.
            </p>
          </div>
        </div>

  )
}
