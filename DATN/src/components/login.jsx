
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../Features/User/UserSlice';
// import '../../public/css/login.css';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  try {
    const response = await axios.post('https://laravel.ducps34770.id.vn/api/godatviet/login_check', {
      email,
      password,
    });

    if (response.status === 200 && response.data.redirect) {
      const { token, redirect, type_token, user } = response.data;

      // Kiểm tra nếu thuộc tính user tồn tại
      if (user) {
        dispatch(setUser(user));
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('authToken', token);
      } else {
        console.warn('Thông tin user không tồn tại trong phản hồi API');
      }

      setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => {
          // navigate('/');
          window.location.href = redirect; 
         }, 2000);
    } else {
      setError(response.data.message || 'Đăng nhập không thành công');
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 'Có lỗi xảy ra khi kết nối đến máy chủ';
    setError(errorMessage);
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="middle login-mgt">
      <div className="container">
        <div className="row align-items-start justify-content-between">
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mgl">
            <form className="form" onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-header">Đăng nhập</div>
                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger" aria-live="assertive">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="alert alert-success" aria-live="assertive">
                      {success}
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="email">Email của bạn</label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      placeholder="Nhập email của bạn"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primarylogin text-white"
                      disabled={loading}
                    >
                      {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                  </div>
                  <div>
                    <Link to="/resetpass" className="text-primary">
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div>
                    Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;



