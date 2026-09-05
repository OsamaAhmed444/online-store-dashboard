const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null)

const asArray = (value) => (Array.isArray(value) ? value : [])

const payloadCollections = (payload, keys) => {
  if (Array.isArray(payload)) return payload

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key]
    if (Array.isArray(payload?.dashboard?.[key])) return payload.dashboard[key]
    if (Array.isArray(payload?.data?.[key])) return payload.data[key]
  }

  return []
}

export const getOrdersFromResponse = (response) => payloadCollections(response?.data, ['orders', 'data'])
export const getUsersFromResponse = (response) => payloadCollections(response?.data, ['users', 'data'])
export const getProductsFromResponse = (response) => payloadCollections(response?.data, ['products', 'data'])

export const normalizeOrder = (order) => ({
  id: firstDefined(order?._id, order?.id, order?.orderId),
  customer: firstDefined(order?.user?.username, order?.user?.name, order?.customer?.name, order?.customerName, 'Customer'),
  date: firstDefined(order?.createdAt, order?.date, order?.orderDate),
  status: String(firstDefined(order?.status, 'pending')).toLowerCase(),
  total: Number(firstDefined(order?.total, order?.totalAmount, order?.grandTotal, order?.amount, 0)),
  items: asArray(firstDefined(order?.items, order?.orderItems, order?.products)),
})

export const normalizeProduct = (product) => ({
  id: firstDefined(product?._id, product?.id, product?.productId),
  name: firstDefined(product?.name, product?.title, 'Unnamed product'),
  price: Number(firstDefined(product?.price, product?.salePrice, 0)),
  totalSold: Number(firstDefined(product?.totalSold, product?.sold, product?.sales, 0)),
  image: firstDefined(product?.thumbnail, product?.image, product?.images?.[0]),
})

export const productFromOrderItem = (item) => {
  const product = item?.product || item?.productId
  return {
    id: firstDefined(product?._id, product?.id, item?._id, item?.productId),
    name: firstDefined(product?.name, product?.title, item?.name, item?.title),
    price: Number(firstDefined(item?.price, product?.price, 0)),
    quantity: Number(firstDefined(item?.quantity, item?.qty, 1)),
    image: firstDefined(product?.thumbnail, product?.image, product?.images?.[0]),
  }
}

export const calculateProductSales = (orders, products) => {
  const sales = new Map()

  orders.forEach((order) => {
    order.items.map(productFromOrderItem).forEach((item) => {
      if (!item.name) return
      const key = item.id || item.name
      const previous = sales.get(key) || { ...item, quantity: 0 }
      sales.set(key, { ...previous, quantity: previous.quantity + item.quantity })
    })
  })

  if (sales.size === 0) {
    products.forEach((product) => {
      if (product.totalSold > 0) sales.set(product.id || product.name, { ...product, quantity: product.totalSold })
    })
  }

  return [...sales.values()].sort((a, b) => b.quantity - a.quantity)
}