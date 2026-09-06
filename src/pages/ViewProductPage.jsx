
import React, { useEffect, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Edit3, Package, Star, Tag } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../api/products'
import EmptyState from '../components/common/EmptyState'
import { LoadingScreen } from '../components/common/Spinner'

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '')
const imageUrl = (image) => typeof image === 'string' ? image : firstDefined(image?.url, image?.secure_url)
const formatCurrency = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function ViewProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getProductById(id).then((response) => {
      if (active) setProduct(response.data?.product || response.data?.data || response.data)
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || 'Unable to load product details.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <LoadingScreen text="Loading product details..." />
  if (error || !product) return <EmptyState title={error || 'Product not found'} />

  const images = Array.isArray(product.images) ? product.images.map(imageUrl).filter(Boolean) : []
  const stock = Number(firstDefined(product.stock, product.quantity, 0))
  const moveImage = (direction) => setActiveImage((current) => (current + direction + images.length) % images.length)

  return <div className="product-detail-page">
    <div className="product-detail-toolbar">
      <button type="button" className="back-products-button" onClick={() => navigate('/dashboard/products')}><ArrowLeft size={17} /> Back to products</button>
      <button type="button" className="product-detail-edit" onClick={() => navigate(`/dashboard/products/${id}/edit`)}><Edit3 size={16} /> Edit product</button>
    </div>
    <section className="product-detail-card">
      <div className="product-detail-gallery">
        <div className="product-detail-main-image">
          {images[activeImage] ? <img src={images[activeImage]} alt={product.name} /> : <Package size={56} />}
          {product.featured && <span className="product-featured"><Star size={13} /> Featured</span>}
          {images.length > 1 && <>
            <button type="button" className="product-detail-nav-arrow left" onClick={() => moveImage(-1)} aria-label="Previous image"><ChevronLeft size={20} /></button>
            <button type="button" className="product-detail-nav-arrow right" onClick={() => moveImage(1)} aria-label="Next image"><ChevronRight size={20} /></button>
          </>}
        </div>
        {images.length > 1 && <div className="product-detail-thumbnails">{images.map((image, index) => <button type="button" className={index === activeImage ? 'active' : ''} key={image} onClick={() => setActiveImage(index)}><img src={image} alt={`${product.name} ${index + 1}`} /></button>)}</div>}
        {images.length > 1 && <div className="product-detail-indicators">{images.map((image, index) => <button type="button" className={index === activeImage ? 'active' : ''} key={`dot-${image}`} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`} />)}</div>}
      </div>
      <div className="product-detail-copy">
        <p className="eyebrow">PRODUCT DETAILS</p>
        <h1>{product.name || product.title}</h1>
        <p className="product-detail-category">{product.category || 'Uncategorized'}{product.subcategory ? ` · ${product.subcategory}` : ''}{product.brand ? ` · ${product.brand}` : ''}</p>

        <section className="product-detail-info-card">
          <h4>Overview</h4>
          <p className="product-detail-description">{product.description || product.shortDescription || 'No description provided.'}</p>
        </section>

        <section className="product-detail-info-card product-detail-pricing">
          <div>
            <h4>Price</h4>
            <strong className="product-detail-price">{formatCurrency(product.price)}</strong>
          </div>
          <div>
            <h4>Discount</h4>
            <strong className={product.discountPrice > 0 ? 'product-detail-discount' : 'product-detail-discount muted'}>{product.discountPrice > 0 ? formatCurrency(product.discountPrice) : 'No discount'}</strong>
          </div>
          <div>
            <h4>Stock</h4>
            <span className={`product-detail-stock ${stock > 0 ? 'in-stock' : 'out-stock'}`}>{stock > 0 ? `${stock} in stock` : 'Out of stock'}</span>
          </div>
        </section>

        <section className="product-detail-info-card">
          <h4>Product Information</h4>
          <dl className="product-detail-meta">
            <div><dt>SKU</dt><dd>{product.sku || '—'}</dd></div>
            <div><dt>Brand</dt><dd>{product.brand || '—'}</dd></div>
            <div><dt>Category</dt><dd>{product.category || '—'}</dd></div>
            <div><dt>Subcategory</dt><dd>{product.subcategory || '—'}</dd></div>
            <div><dt>Active</dt><dd>{product.isActive === false ? 'No' : 'Yes'}</dd></div>
          </dl>
        </section>

        {Array.isArray(product.tags) && product.tags.length > 0 && <section className="product-detail-info-card">
          <h4><Tag size={14} /> Tags</h4>
          <div className="product-detail-tags">{product.tags.map((tag) => <span key={typeof tag === 'string' ? tag : tag.name}>{typeof tag === 'string' ? tag : tag.name}</span>)}</div>
        </section>}
      </div>
    </section>
  </div>
}



