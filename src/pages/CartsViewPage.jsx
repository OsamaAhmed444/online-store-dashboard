import React, { useEffect, useMemo, useState } from 'react'
import { DollarSign, Eye, Package, Search, ShoppingCart, Users } from 'lucide-react'
import { getCarts } from '../api/orders'
import Modal from '../components/common/Modal'

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '')
const asArray = (value) => (Array.isArray(value) ? value : [])

const getCartsFromResponse = (response) => {
  const payload = response?.data
  if (Array.isArray(payload)) return payload
  if (asArray(payload?.carts).length) return payload.carts
  if (asArray(payload?.data?.carts).length) return payload.data.carts
  return asArray(payload?.data)
}

const imageUrl = (image) => (typeof image === 'string' ? image : firstDefined(image?.url, image?.secure_url))

const normalizeCart = (cart) => {
  const rawItems = asArray(firstDefined(cart?.items, cart?.products, cart?.cartItems))
  const items = rawItems.map((item) => ({
    id: firstDefined(item?.product?._id, item?.product?.id, item?.productId, item?._id, item?.id),
    name: firstDefined(item?.product?.name, item?.name, item?.title, 'Unnamed product'),
    quantity: Number(firstDefined(item?.quantity, item?.qty, 1)),
    price: Number(firstDefined(item?.price, item?.product?.price, 0)),
    image: imageUrl(firstDefined(item?.product?.thumbnail, item?.product?.image, item?.product?.images?.[0], item?.image)),
  }))
  const computedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    id: firstDefined(cart?._id, cart?.id, cart?.cartId),
    customer: firstDefined(cart?.user?.username, cart?.user?.name, cart?.customerName, 'Guest'),
    email: firstDefined(cart?.user?.email, ''),
    items,
    total: Number(firstDefined(cart?.totalPrice, cart?.total, cart?.subtotal, computedTotal)),
    status: String(firstDefined(cart?.status, cart?.isCheckedOut ? 'checked-out' : '', 'active')).toLowerCase(),
    updatedAt: firstDefined(cart?.updatedAt, cart?.createdAt),
  }
}

const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function CartsViewPage() {
  const [carts, setCarts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCart, setActiveCart] = useState(null)

  const fetchCarts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getCarts()
      setCarts(getCartsFromResponse(response).map(normalizeCart).filter((cart) => cart.id))
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load carts.')
      setCarts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCarts()
  }, [])

  const filteredCarts = useMemo(() => {
    const value = query.trim().toLowerCase()
    return value
      ? carts.filter((cart) => `${cart.customer} ${cart.email} ${cart.id}`.toLowerCase().includes(value))
      : carts
  }, [carts, query])

  const stats = [
    { label: 'Total Carts', value: carts.length, icon: ShoppingCart, tone: '#f47716' },
    { label: 'Active Carts', value: carts.filter((cart) => cart.status === 'active').length, icon: Package, tone: '#208ae0' },
    { label: 'Cart Value', value: formatCurrency(carts.reduce((sum, cart) => sum + cart.total, 0)), icon: DollarSign, tone: '#20c96b' },
    { label: 'Customers', value: new Set(carts.map((cart) => cart.customer)).size, icon: Users, tone: '#8f30f3' },
  ]

  return (
    <div className="carts-page">
      <section className="carts-header">
        <div>
          <p className="eyebrow">CART MANAGEMENT</p>
          <h1>Manage Carts</h1>
        </div>
        <label className="carts-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search carts..."
            aria-label="Search carts"
          />
        </label>
      </section>

      {loading ? (
        <div className="carts-state">Loading carts...</div>
      ) : error ? (
        <div className="carts-state carts-error">
          <p>{error}</p>
          <button type="button" onClick={fetchCarts}>Try Again</button>
        </div>
      ) : (
        <>
          <section className="cart-stats-grid" aria-label="Cart statistics">
            {stats.map(({ label, value, icon: Icon, tone }) => (
              <article className="cart-stat-card" key={label}>
                <span style={{ background: tone }}><Icon size={22} /></span>
                <div>
                  <p>{label}</p>
                  <strong>{value}</strong>
                </div>
              </article>
            ))}
          </section>

          {filteredCarts.length ? (
            <div className="carts-table-panel">
              <div className="carts-table-scroll">
                <table className="carts-table">
                  <thead>
                    <tr>
                      <th>Cart ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCarts.map((cart) => (
                      <tr key={cart.id}>
                        <td className="cart-id-cell">#{String(cart.id).slice(-8).toUpperCase()}</td>
                        <td className="cart-customer-cell">
                          <strong>{cart.customer}</strong>
                          {cart.email && <span>{cart.email}</span>}
                        </td>
                        <td>{cart.items.reduce((sum, item) => sum + item.quantity, 0)} items</td>
                        <td>{formatCurrency(cart.total)}</td>
                        <td>
                          <span className={`cart-status-pill ${cart.status}`}>
                            {cart.status.charAt(0).toUpperCase() + cart.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="cart-view-action"
                            onClick={() => setActiveCart(cart)}
                            aria-label={`View cart ${cart.id}`}
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="carts-state carts-empty">
              {query ? 'No carts match your search.' : 'No carts found.'}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={Boolean(activeCart)}
        onClose={() => setActiveCart(null)}
        title={activeCart ? `Cart #${String(activeCart.id).slice(-8).toUpperCase()}` : ''}
      >
        {activeCart && (
          <>
            <p className="settings-card-desc" style={{ margin: '-14px 0 18px' }}>
              {activeCart.customer}{activeCart.email ? ` · ${activeCart.email}` : ''}
            </p>
            <div className="cart-items-list">
              {activeCart.items.length ? activeCart.items.map((item, index) => (
                <div className="cart-item-row" key={`${item.id || 'item'}-${index}`}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="cart-item-row-fallback"><Package size={22} /></div>
                  )}
                  <div className="cart-item-copy">
                    <strong>{item.name}</strong>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <span className="cart-item-price">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              )) : (
                <p style={{ color: '#858b96', fontSize: '13px' }}>No items in this cart.</p>
              )}
            </div>
            <div className="cart-modal-total">
              <span>Total</span>
              <span>{formatCurrency(activeCart.total)}</span>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
