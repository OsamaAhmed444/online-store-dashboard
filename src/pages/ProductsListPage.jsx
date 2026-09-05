import React, { useEffect, useMemo, useState } from 'react'
import { Boxes, Check, Edit3, Package, Plus, Search, SlidersHorizontal, Star, Trash2, TrendingUp, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { deleteProduct, getProducts, updateProduct } from '../api/products'
import ConfirmDialog from '../components/common/ConfirmDialog'

const PAGE_SIZE = 8

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '')

const productsFromResponse = (response) => {
  const payload = response?.data
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.products)) return payload.products
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const normalizeProduct = (product) => ({
  ...product,
  id: firstDefined(product?._id, product?.id, product?.productId),
  name: firstDefined(product?.name, product?.title, 'Unnamed product'),
  description: firstDefined(product?.shortDescription, product?.description, ''),
  price: Number(firstDefined(product?.price, product?.discountPrice, 0)),
  stock: Number(firstDefined(product?.stock, product?.quantity, product?.inventory, 0)),
  category: firstDefined(product?.category, 'Uncategorized'),
  subcategory: firstDefined(product?.subcategory, ''),
  featured: Boolean(firstDefined(product?.featured, product?.isFeatured, false)),
  images: Array.isArray(product?.images) ? product.images : [],
})

const imageUrl = (image) => typeof image === 'string' ? image : firstDefined(image?.url, image?.secure_url, image?.path)
const formatCurrency = (value) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function ProductImage({ product }) {
  const [failed, setFailed] = useState(false)
  const source = imageUrl(product.images[0])
  if (!source || failed) return <div className="product-image-placeholder"><Package size={36} /></div>
  return <img className="product-image" src={source} alt={product.name} onError={() => setFailed(true)} />
}

function ProductEditModal({ product, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({ name: product.name, price: product.price, stock: product.stock, category: product.category, featured: product.featured })
  const updateField = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))
  return <div className="products-modal-backdrop"><section className="products-modal" role="dialog" aria-modal="true" aria-labelledby="edit-product-title"><div className="products-modal-heading"><div><p className="eyebrow">PRODUCT MANAGEMENT</p><h2 id="edit-product-title">Edit Product</h2></div><button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button></div><form className="product-edit-form" onSubmit={(event) => { event.preventDefault(); onSubmit(form) }}><label>Product name<input name="name" value={form.name} onChange={updateField} required /></label><label>Category<input name="category" value={form.category} onChange={updateField} /></label><label>Price<input name="price" type="number" min="0" value={form.price} onChange={updateField} required /></label><label>Stock<input name="stock" type="number" min="0" value={form.stock} onChange={updateField} required /></label><label className="product-featured-field"><input name="featured" type="checkbox" checked={form.featured} onChange={updateField} /> Featured product</label><div className="products-modal-actions"><button className="products-modal-cancel" type="button" onClick={onClose}>Cancel</button><button className="products-modal-submit" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button></div></form></section></div>
}

function ProductCard({ product, onEdit, onDelete }) {
  return <article className="product-card"><div className="product-card-image"><ProductImage product={product} />{product.featured && <span className="product-featured"><Star size={13} /> Featured</span>}<span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>{product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}</span></div><div className="product-card-body"><h3>{product.name}</h3><p className="product-category">{product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}</p><p className="product-description">{product.description || 'No description provided.'}</p><strong className="product-price">{formatCurrency(product.price)}</strong><div className="product-card-footer"><span className={`product-status ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>{product.stock > 0 ? <Check size={14} /> : <X size={14} />}{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span><div className="product-actions"><button type="button" className="product-edit-action" onClick={() => onEdit(product)} aria-label={`Edit ${product.name}`}><Edit3 size={16} /></button><button type="button" className="product-delete-action" onClick={() => onDelete(product)} aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button></div></div></div></article>
}

export default function ProductsListPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [draftSearch, setDraftSearch] = useState('')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [draftCategory, setDraftCategory] = useState('all')
  const [draftStock, setDraftStock] = useState('all')
  const [draftFeatured, setDraftFeatured] = useState('all')
  const [filters, setFilters] = useState({ category: 'all', stock: 'all', featured: 'all', sort: 'newest' })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [mutationLoading, setMutationLoading] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getProducts()
      setProducts(productsFromResponse(response).map(normalizeProduct))
    } catch (requestError) {
      setError(requestError.response?.status === 401 || requestError.response?.status === 403 ? 'You are not authorized to view products.' : requestError.response?.data?.message || 'Unable to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])
  useEffect(() => { setPage(1) }, [search, filters])

  const categories = useMemo(() => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(), [products])
  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase()
    const result = products.filter((product) => {
      const searchable = `${product.name} ${product.category} ${product.subcategory} ${product.sku || ''}`.toLowerCase()
      if (value && !searchable.includes(value)) return false
      if (filters.category !== 'all' && product.category !== filters.category) return false
      if (filters.stock === 'in' && product.stock <= 0) return false
      if (filters.stock === 'out' && product.stock > 0) return false
      if (filters.featured === 'yes' && !product.featured) return false
      if (filters.featured === 'no' && product.featured) return false
      return true
    })
    return result.sort((a, b) => {
      if (filters.sort === 'price-low') return a.price - b.price
      if (filters.sort === 'price-high') return b.price - a.price
      if (filters.sort === 'name-az') return a.name.localeCompare(b.name)
      if (filters.sort === 'name-za') return b.name.localeCompare(a.name)
      return 0
    })
  }, [products, search, filters])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const applyFilters = () => { setSearch(draftSearch); setFilters({ category: draftCategory, stock: draftStock, featured: draftFeatured, sort: filters.sort }); setShowFilters(false) }
  const clearFilters = () => { setDraftSearch(''); setSearch(''); setDraftCategory('all'); setDraftStock('all'); setDraftFeatured('all'); setFilters({ category: 'all', stock: 'all', featured: 'all', sort: 'newest' }); setShowFilters(false) }
  const removeProduct = async () => { if (!deleteTarget) return; setMutationLoading(true); try { await deleteProduct(deleteTarget.id); setProducts((current) => current.filter((product) => product.id !== deleteTarget.id)); toast.success('Product deleted successfully.'); setDeleteTarget(null) } catch (requestError) { toast.error(requestError.response?.data?.message || 'Unable to delete this product.') } finally { setMutationLoading(false) } }
  const saveProduct = async (form) => { setMutationLoading(true); try { await updateProduct(editTarget.id, { name: form.name, price: Number(form.price), stock: Number(form.stock), category: form.category, featured: form.featured }); toast.success('Product updated successfully.'); setEditTarget(null); await fetchProducts() } catch (requestError) { toast.error(requestError.response?.data?.message || 'Unable to update this product.') } finally { setMutationLoading(false) } }

  return <div className="products-page"><section className="products-header"><div className="products-header-copy"><div className="products-header-icon"><Package size={25} /></div><div><p className="eyebrow">PRODUCT DASHBOARD</p><h1>Products</h1><p>Manage your store products, track inventory and boost your sales.</p></div></div><button className="add-product-button" type="button" onClick={() => navigate('/dashboard/products/add')}><Plus size={20} /> Add Product</button></section>{loading ? <div className="products-state">Loading products...</div> : error ? <div className="products-state products-error"><p>{error}</p><button type="button" onClick={fetchProducts}>Try Again</button></div> : <><section className="product-stats-grid" aria-label="Product statistics"><article><span><Boxes size={21} /></span><div><strong>{products.length}</strong><small>Total</small></div></article><article><span><Star size={21} /></span><div><strong>{products.filter((product) => product.featured).length}</strong><small>Featured</small></div></article><article><span><TrendingUp size={21} /></span><div><strong>{products.filter((product) => product.stock > 0).length}</strong><small>In Stock</small></div></article><article><span><Boxes size={21} /></span><div><strong>{products.filter((product) => product.stock <= 0).length}</strong><small>Out of Stock</small></div></article></section><section className="products-search-panel"><div className="products-search-row"><label className="products-search-input"><Search size={20} /><input value={draftSearch} onChange={(event) => setDraftSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setSearch(draftSearch) }} placeholder="Search products..." aria-label="Search products" /></label><button className="products-filter-button" type="button" onClick={() => setShowFilters((value) => !value)}><SlidersHorizontal size={18} /> Filters</button><button className="products-search-button" type="button" onClick={() => setSearch(draftSearch)}><Search size={18} /> Search</button></div>{showFilters && <div className="products-filters"><label>Category<select value={draftCategory} onChange={(event) => setDraftCategory(event.target.value)}><option value="all">All categories</option>{categories.map((category) => <option value={category} key={category}>{category}</option>)}</select></label><label>Stock<select value={draftStock} onChange={(event) => setDraftStock(event.target.value)}><option value="all">All stock</option><option value="in">In stock</option><option value="out">Out of stock</option></select></label><label>Featured<select value={draftFeatured} onChange={(event) => setDraftFeatured(event.target.value)}><option value="all">All products</option><option value="yes">Featured</option><option value="no">Not featured</option></select></label><label>Sort<select value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}><option value="newest">Default order</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="name-az">Name: A-Z</option><option value="name-za">Name: Z-A</option></select></label><div className="products-filter-actions"><button type="button" onClick={clearFilters}>Clear Filters</button><button type="button" onClick={applyFilters}>Apply Filters</button></div></div>}</section>{visibleProducts.length === 0 ? <div className="products-state"><p>{search || filters.category !== 'all' || filters.stock !== 'all' || filters.featured !== 'all' ? 'No products match your search or filters.' : 'No products found.'}</p>{(search || filters.category !== 'all' || filters.stock !== 'all' || filters.featured !== 'all') && <button type="button" onClick={clearFilters}>Clear Filters</button>}</div> : <><section className="products-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onEdit={setEditTarget} onDelete={setDeleteTarget} />)}</section><div className="products-pagination"><span>Page {page} of {totalPages}</span><div><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button><button type="button" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Next</button></div></div></>}</>}{editTarget && <ProductEditModal product={editTarget} onClose={() => setEditTarget(null)} onSubmit={saveProduct} loading={mutationLoading} />}<ConfirmDialog isOpen={Boolean(deleteTarget)} title="Delete product" message={`Are you sure you want to delete ${deleteTarget?.name || 'this product'}?`} confirmText="Delete" loading={mutationLoading} onCancel={() => setDeleteTarget(null)} onConfirm={removeProduct} /></div>
}
