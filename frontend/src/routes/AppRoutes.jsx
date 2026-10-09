import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';

// Home is in the main bundle for a fast first paint; every other page is code-split.
// The <Suspense> boundary for these lives in Layout, around <Outlet />.
const Shop = lazy(() => import('../pages/Shop'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Account = lazy(() => import('../pages/Account'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Cart = lazy(() => import('../pages/Cart'));
const Deals = lazy(() => import('../pages/Deals'));
const NewArrivals = lazy(() => import('../pages/NewArrivals'));
const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        {/* One reusable Shop page for every category */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<Shop />} />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Login required */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Account />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
