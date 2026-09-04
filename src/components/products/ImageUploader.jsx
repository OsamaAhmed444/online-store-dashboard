import React, { useState } from "react";
import {
  ImagePlus,
  Upload,
  Sparkles,
} from "lucide-react";

function ImageUploader({ images = [] }) {
    const [selectedImages, setSelectedImages] = useState([]);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    const imagesWithPreview = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...imagesWithPreview]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  return (
    <div>

      {/* Images */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {/* Existing Image */}
        <div>
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7"
              alt="Product"
              className="w-full h-[180px] object-cover"
            />
          </div>

          <button
            type="button"
            className="mt-2 text-red-500 hover:text-red-700"
          >
            × Remove
          </button>
        </div>


        {/* Selected Images */}
        {selectedImages.map((image, index) => (
          <div key={index}>

            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={image.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-[180px] object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="mt-2 text-red-500 hover:text-red-700"
            >
              × Remove
            </button>

          </div>
        ))}

      </div>


      {/* Upload */}
      <label className="border-2 border-dashed border-slate-300 rounded-2xl h-[180px] flex flex-col justify-center items-center cursor-pointer hover:bg-slate-50">

        <span className="text-4xl mb-3">
          🖼️
        </span>

        <span className="font-medium text-slate-700">
          Click to upload images
        </span>

        <span className="text-sm text-slate-400 mt-2">
          PNG, JPG, WEBP
        </span>

        <input
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleImagesChange}
        />

      </label>
      <div className="mt-6 border border-orange-100 bg-orange-50/40 rounded-3xl p-5">

        <div className="flex gap-2 items-center text-orange-500">

          <Sparkles size={18} />

          <span className="font-semibold">
            Senior UX
          </span>

        </div>

        <p className="text-sm text-gray-400 mt-2">
          Edit without losing the existing product story,
          while still adding fresh media.
        </p>

      </div>

    </div>

  );
}

export default ImageUploader;