// src/Features/User/UserSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Hàm kiểm tra trạng thái người dùng từ sessionStorage
const loadUserFromSessionStorage = () => {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: loadUserFromSessionStorage(), // Kiểm tra và khôi phục người dùng từ sessionStorage khi ứng dụng tải lại
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      // Lưu thông tin người dùng vào sessionStorage
      sessionStorage.setItem('user', JSON.stringify(action.payload));
      sessionStorage.setItem('isLoggedIn', 'true');
    },
    logout: (state) => {
      state.user = null;
      // Xóa thông tin người dùng khỏi sessionStorage
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userId');
    },
  },
});

// Các action creators
export const { setUser, logout } = userSlice.actions;

// Chọn người dùng từ state
export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
