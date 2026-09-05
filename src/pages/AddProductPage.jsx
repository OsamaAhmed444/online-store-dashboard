import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ImagePlus, Package, Save, Sparkles } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addProduct, getProductById, updateProduct } from '../api/products'
import Button from '../components/common/Button'
import ImageUploader from '../components/products/ImageUploader'

const initialForm = { name: '', shortDescription: '', description: '', price: '', discountPrice: '', stock: '', sku: '', category: '', subcategory: '', brand: '', featured: false, active: true }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Product name is required.'
  if (form.shortDescription.trim().length < 10) errors.shortDescription = 'Use at least 10 characters.'
  if (form.description.trim().length < 20) errors.description = 'Use at least 20 characters.'
  if (form.price === '' || Number(form.price) <= 0) errors.price = 'Price must be greater than zero.'
  if (form.stock === '' || Number(form.stock) < 0) errors.stock = 'Stock cannot be negative.'
  if (!form.category.trim()) errors.category = 'Category is required.'
  return errors
}

export default function AddProductPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const [form, setForm] = useState(initialForm)
  const [tags, setTags] = useState([])
  const [tagDraft, setTagDraft] = useState('')
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(isEditMode)
  const previewsRef = useRef(previews)

  previewsRef.current = previews
  useEffect(() => () => previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url)), [])

  useEffect(() => {
    if (!isEditMode) return
    let mounted = true
    getProductById(id)
      .then((response) => {
        if (!mounted) return
        const product = response.data?.product || response.data?.data || response.data
        if (!product || typeof product !== 'object') throw new Error('Product details were not returned by the API.')
        setForm({
          name: product.name || '', shortDescription: product.shortDescription || '', description: product.description || '',
          price: product.price ?? '', discountPrice: product.discountPrice ?? '', stock: product.stock ?? '', sku: product.sku || '',
          category: product.category || '', subcategory: product.subcategory || '', brand: product.brand || '', featured: Boolean(product.featured), active: product.isActive !== false,
        })
        setTags(Array.isArray(product.tags) ? product.tags : [])
        const existingImages = Array.isArray(product.images) ? product.images.map((image, index) => ({ existing: true, file: { name: `existing-image-${index + 1}` }, url: typeof image === 'string' ? image : image.url })) : []
        setPreviews(existingImages)
      })
      .catch((requestError) => { if (mounted) setApiError(requestError.response?.data?.message || 'Unable to load product details.') })
      .finally(() => { if (mounted) setLoadingProduct(false) })
    return () => { mounted = false }
  }, [id, isEditMode])

  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
    setDirty(true)
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const handleImages = (files) => {
    const accepted = []
    const rejected = []
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) rejected.push(`${file.name}: only image files are allowed.`)
      else if (images.some((existing) => existing.name === file.name && existing.size === file.size)) rejected.push(`${file.name}: already selected.`)
      else accepted.push(file)
    })
    if (accepted.length) {
      setImages((current) => [...current, ...accepted])
      setPreviews((current) => [...current, ...accepted.map((file) => ({ file, url: URL.createObjectURL(file) }))])
      setDirty(true)
    }
    if (rejected.length) setErrors((current) => ({ ...current, images: rejected.join(' ') }))
  }

  const removeImage = (index) => {
    setPreviews((current) => { const removed = current[index]; if (removed && !removed.existing) URL.revokeObjectURL(removed.url); return current.filter((_, itemIndex) => itemIndex !== index) })
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))
    setDirty(true)
  }

  const addTag = () => {
    const tag = tagDraft.trim()
    if (!tag || tags.includes(tag)) return
    setTags((current) => [...current, tag])
    setTagDraft('')
    setDirty(true)
  }

  const handleBack = () => { if (dirty && !window.confirm('Discard this product draft?')) return; navigate('/dashboard/products') }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    setApiError('')
    if (Object.keys(nextErrors).length) return
    setSubmitting(true)
    try {
      const payload = new FormData()
      Object.entries(form).filter(([key]) => key !== 'active').forEach(([key, value]) => payload.append(key, String(value ?? '')))
      if (isEditMode) payload.append('isActive', String(form.active))
      tags.forEach((tag) => payload.append('tags', tag))
      images.forEach((image) => payload.append('images', image))
      if (isEditMode) await updateProduct(id, payload)
      else await addProduct(payload)
      toast.success(isEditMode ? 'Product updated successfully.' : 'Product created successfully.')
      navigate('/dashboard/products')
    } catch (requestError) {
      const responseData = requestError.response?.data
      const responseMessage = responseData?.message || responseData?.error
      const fieldErrors = responseData?.errors
      const readableFieldErrors = fieldErrors && typeof fieldErrors === 'object'
        ? Object.entries(fieldErrors).map(([fieldName, message]) => `${fieldName}: ${Array.isArray(message) ? message.join(', ') : message}`).join(' | ')
        : ''
      setApiError(readableFieldErrors || responseMessage || (requestError.response?.status === 401 || requestError.response?.status === 403 ? 'You are not authorized to create products.' : 'Unable to create product. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => <label className="create-field">{label}<input name={name} type={type} value={form[name]} onChange={updateField} placeholder={placeholder} aria-invalid={Boolean(errors[name])} />{errors[name] && <span className="create-field-error">{errors[name]}</span>}</label>

  if (loadingProduct) return <div className="create-product-page"><div className="products-state">Loading product details...</div></div>

  return <div className="create-product-page"><section className="create-product-header"><button type="button" className="back-products-button" onClick={handleBack}><ArrowLeft size={17} /> Back to products</button><div className="create-header-main"><div className="create-header-icon"><Package size={29} /></div><div><p className="eyebrow">{isEditMode ? 'EDIT PRODUCT' : 'CREATE PRODUCT'}</p><h1>{isEditMode ? <>Update a <em>polished</em> product entry</> : <>Launch a <em>polished</em> product entry</>}</h1><p>{isEditMode ? 'Update product information, inventory and media.' : 'Add products with validation, image previews, multi-upload support, and smooth UX.'}</p></div></div><div className="ready-card"><p className="eyebrow">{isEditMode ? 'EDITING' : 'READY'}</p><span>{isEditMode ? 'Review the details and save your changes.' : 'Create, validate, and save with one click.'}</span></div></section><div className="create-product-columns"><section className="gallery-card"><div className="create-section-heading"><div className="create-section-icon"><ImagePlus size={22} /></div><div><h2>Gallery</h2><p>Upload multiple images and preview instantly.</p></div></div><ImageUploader previews={previews} onFiles={handleImages} onRemove={removeImage} error={errors.images} /><div className="gallery-note"><Sparkles size={17} /><span>Images are sent with the product request after you submit.</span></div></section><form className="product-form-card" onSubmit={handleSubmit} noValidate><div className="form-card-heading"><p className="eyebrow">PRODUCT INFORMATION</p><h2>Product details</h2></div>{apiError && <div className="create-api-error" role="alert">{apiError}</div>}{field('name', 'Product Name', 'text', 'Product name')}<label className="create-field">Short Description<input name="shortDescription" value={form.shortDescription} onChange={updateField} placeholder="Minimum 10 characters" aria-invalid={Boolean(errors.shortDescription)} />{errors.shortDescription && <span className="create-field-error">{errors.shortDescription}</span>}</label><label className="create-field">Description<textarea name="description" value={form.description} onChange={updateField} placeholder="Minimum 20 characters" rows="5" aria-invalid={Boolean(errors.description)} />{errors.description && <span className="create-field-error">{errors.description}</span>}</label><div className="create-form-grid">{field('price', 'Price', 'number', '0.00')}{field('discountPrice', 'Discount Price', 'number', 'Optional')}{field('stock', 'Stock', 'number', '0')}{field('sku', 'SKU', 'text', 'SKU-001')}{field('category', 'Category', 'text', 'Category')}{field('subcategory', 'Subcategory', 'text', 'Subcategory')}{field('brand', 'Brand', 'text', 'Brand')}</div><section className="tags-field"><h3>Tags</h3><div className="tags-entry"><input value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addTag() } }} placeholder="Type a tag and press +" /><button type="button" onClick={addTag} aria-label="Add tag">+</button></div><div className="tag-list">{tags.map((tag) => <span key={tag}>{tag}<button type="button" onClick={() => setTags((current) => current.filter((item) => item !== tag))} aria-label={`Remove ${tag}`}>×</button></span>)}</div><p>Add one or more tags to organize the product.</p></section><div className="product-toggles"><label className="featured-toggle"><input name="featured" type="checkbox" checked={form.featured} onChange={updateField} /><span>Featured</span></label><label className="featured-toggle"><input name="active" type="checkbox" checked={form.active} onChange={updateField} /><span>Active</span></label></div><div className="create-form-actions"><Button type="button" variant="outline" onClick={handleBack}>Cancel</Button><Button type="submit" loading={submitting} disabled={submitting} className="create-submit"><Save size={17} /> {submitting ? (isEditMode ? 'Saving Changes...' : 'Creating Product...') : (isEditMode ? 'Save Changes' : 'Create Product')}</Button></div></form></div></div>
}
