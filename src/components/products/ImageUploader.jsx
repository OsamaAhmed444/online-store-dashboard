// <<<<<<< HEAD
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
// =======
import React, { useRef, useState } from 'react'
import { ImagePlus, Trash2, Upload } from 'lucide-react'

export default function ImageUploader({ previews, onFiles, onRemove, error }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const selectFiles = (fileList) => { if (fileList?.length) onFiles(Array.from(fileList)); if (inputRef.current) inputRef.current.value = '' }
  return <div className="image-uploader"><div className="image-preview-grid">{previews.length === 0 ? <div className="image-preview-empty"><ImagePlus size={34} /><span>Product image preview</span><small>Your selected images will appear here</small></div> : previews.map((preview, index) => <article className="image-preview-card" key={`${preview.file.name}-${preview.file.lastModified}`}><img src={preview.url} alt={`Product image ${index + 1}`} /><div className="image-preview-footer"><span>IMAGE {index + 1}</span><button type="button" onClick={() => onRemove(index)} aria-label={`Remove image ${index + 1}`}><Trash2 size={15} /></button></div></article>)}</div><button type="button" className={`upload-dropzone${dragging ? ' dragging' : ''}`} onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragging(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFiles(event.dataTransfer.files) }}><Upload size={27} /><strong>Upload Images</strong><span>Drag &amp; drop or click to browse</span><input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(event) => selectFiles(event.target.files)} /></button>{error && <p className="create-field-error image-upload-error" role="alert">{error}</p>}</div>
}
// >>>>>>> origin/main
