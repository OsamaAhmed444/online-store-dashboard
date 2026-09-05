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
import EditProductPage from './pages/EditProductPage'
import OrdersListPage from './pages/OrdersListPage'
import OrderDetailPage from './pages/OrderDetailPage'
import UsersListPage from './pages/UsersListPage'

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
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="products/:id/Quickedit" element={<QuickEditProductPage />} />
          <Route path="orders" element={<OrdersListPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="users" element={<UsersListPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}




 