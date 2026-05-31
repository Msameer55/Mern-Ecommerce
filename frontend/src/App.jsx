import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import VerifyOtp from "./components/pages/VerifyOtp";
import Profile from "./components/pages/Profile";
import CollectionPage from "./components/Products/CollectionPage";
import Checkout from "./components/Cart/CheckOut";
import ProductDetailPage from "./components/Products/ProductDetailPage";
import OrderDetailPage from "./components/pages/OrderDetailPage";
import OrderConfirmation from "./components/pages/OrderConfirmation";
import AdminLayout from "./components/Layout/AdminLayout";
import AdminHome from "./components/pages/Admin/AdminHome";
import AdminUser from "./components/pages/Admin/AdminUser";
import AdminProducts from "./components/pages/Admin/AdminProduct";
import AddProduct from "./components/pages/Admin/AddProduct";
import EditProduct from "./components/pages/Admin/EditProduct";
import AdminOrders from "./components/pages/Admin/AdminOrders";
import ScrollToTop from "./components/ScrollToTop";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import SubscribeUsers from "./components/pages/Admin/SubscribeUsers";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";
import ResetPassword from "./components/pages/ResetPassword";

const App = () => {

  return (
    <>
      <BrowserRouter>
        <ToastContainer style={{ zIndex: 99999 }} position="top-right" autoClose={3000} />
        <ScrollToTop />
        <Routes>
          {/* User Layout */}
          <Route path="/" element={<UserLayout />}>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Layout  */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<AdminUser />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="subscribe-user" element={<SubscribeUsers />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
