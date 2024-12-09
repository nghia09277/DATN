// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Features/User/UserSlice';
// import cartReducer from './Features/Cart/CartSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    // cart: cartReducer,
  },
});

export default store;
