import React, { useRef, useState } from 'react'
import { ImagePlus, Trash2, Upload } from 'lucide-react'

export default function ImageUploader({ previews, onFiles, onRemove, error }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const selectFiles = (fileList) => { if (fileList?.length) onFiles(Array.from(fileList)); if (inputRef.current) inputRef.current.value = '' }
  return <div className="image-uploader"><div className="image-preview-grid">{previews.length === 0 ? <div className="image-preview-empty"><ImagePlus size={34} /><span>Product image preview</span><small>Your selected images will appear here</small></div> : previews.map((preview, index) => <article className="image-preview-card" key={`${preview.file.name}-${preview.file.lastModified}`}><img src={preview.url} alt={`Product image ${index + 1}`} /><div className="image-preview-footer"><span>IMAGE {index + 1}</span><button type="button" onClick={() => onRemove(index)} aria-label={`Remove image ${index + 1}`}><Trash2 size={15} /></button></div></article>)}</div><button type="button" className={`upload-dropzone${dragging ? ' dragging' : ''}`} onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragging(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFiles(event.dataTransfer.files) }}><Upload size={27} /><strong>Upload Images</strong><span>Drag &amp; drop or click to browse</span><input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(event) => selectFiles(event.target.files)} /></button>{error && <p className="create-field-error image-upload-error" role="alert">{error}</p>}</div>
}
