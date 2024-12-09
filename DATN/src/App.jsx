import React, { useState, useEffect } from "react";
import {
  HashRouter  as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./components/index";
import Properties from "./components/properties";
import Propertydetails from "./components/property-details";
import Article from "./components/article";
import Chitietbaiviet from "./components/chitietbaiviet";
import Cart from "./components/cart";
import Checkout from "./components/checkout";
import Login from "./components/login";
import Contact from "./components/contact";
import store from "./store";
import PropTypes from "prop-types";
import "../public/css/BlobLoader.css";
import Search from "./components/search";
import Register from "./components/register";
import Profile from "./components/Profile";
import VoucherPage from "./components/Voucher/voucher";
import Order from "./components/order";
import OrderDetails from "./components/order-details";
import Wishlist from "./components/wishlist";
import TraCuu from "./components/TraCuu";
import TraCuuDetails from "./components/TraCuuDetails";

const LoadingSpinner = () => (
  <div className="loader-overlay">
    <div className="loader"></div>
  </div>
);

const AnimatedRoutes = ({ setIsLoading }) => {
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true); // Hiển thị loader khi bắt đầu chuyển trang
    const timeout = setTimeout(() => setIsLoading(false), 1500); // Tắt loader sau 1 giây
    return () => clearTimeout(timeout); // Hủy timeout khi unmount
  }, [location, setIsLoading]);

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={1000}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/Propertydetails/:id" element={<Propertydetails />} />
          <Route path="/article" element={<Article />} />
          <Route path="/chitietbaiviet" element={<Chitietbaiviet />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/VoucherPage" element={<VoucherPage />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order-details/:orderId" element={<OrderDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/tracuu" element={<TraCuu />} />
          <Route path="/tracuu-details/:orderId" element={<TraCuuDetails />} />
          <Route path="/chitietbaiviet/:id_bv" element={<Chitietbaiviet />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

AnimatedRoutes.propTypes = {
  setIsLoading: PropTypes.func.isRequired, // Định nghĩa prop
};
const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Provider store={store}>
      <Router>
        <Header />
        {isLoading && <LoadingSpinner />}
        <AnimatedRoutes setIsLoading={setIsLoading} />
        <Footer />
      </Router>
    </Provider>
  );
};

export default App;
