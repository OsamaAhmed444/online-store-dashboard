import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import ProtectedRoute from './routes/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import LoginPage from './pages/LoginPage'
import DashboardHome from './pages/DashboardHome'
import ProductsListPage from './pages/ProductsListPage'
import AddProductPage from './pages/AddProductPage'
import ViewProductPage from './pages/ViewProductPage'
import QuickEditProductPage from './pages/QuickEditProductPage'
import OrdersListPage from './pages/OrdersListPage'
import OrderDetailPage from './pages/OrderDetailPage'
import UsersListPage from './pages/UsersListPage'
import CartsViewPage from './pages/CartsViewPage'
import SettingsPage from './pages/SettingsPage'
import Modal from './components/common/Modal'

function QuickEditModalHost() {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const open = (event) => {
      const item = event.detail
      setProduct(item)
    }
    window.addEventListener('quick-edit-product', open)
    return () => window.removeEventListener('quick-edit-product', open)
  }, [])

  return <Modal isOpen={Boolean(product)} onClose={() => setProduct(null)} title="Edit Product" className="full-product-edit-modal"><AddProductPage productId={product?.id} onClose={() => { setProduct(null); window.dispatchEvent(new Event('products-refresh')) }} /></Modal>
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/:id/view" element={<ViewProductPage />} />
          <Route path="products/:id/edit" element={<AddProductPage />} />
          <Route path="products/:id/quickedit" element={<QuickEditProductPage />} />
          <Route path="orders" element={<OrdersListPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="users" element={<UsersListPage />} />
          <Route path="carts" element={<CartsViewPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
      <QuickEditModalHost />
    </>
  )
}




 