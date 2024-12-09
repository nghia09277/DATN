import React, { useState } from 'react';
import axios from 'axios';
// import '../../public/css/contac.css';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        'https://laravel.ducps34770.id.vn/api/godatviet/phanhoi',
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        {
          headers: {
            "Content-Type": "application/json", // Đảm bảo đúng header cho JSON
          },
        }
      );

      if (response.status === 201) {
        setSuccess('Phản hồi của bạn đã được gửi thành công!');
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="contact-content">
        <div className="container">
          <div className="contact-row">
            <div className="col-lg-7">
              <form id="contact-form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-12">
                    <fieldset>
                      <label htmlFor="name">Họ và Tên</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Tên của bạn..."
                        autoComplete="on"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <label htmlFor="email">Địa Chỉ Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email của bạn..."
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12"> <fieldset>
                      <label htmlFor="message">Tin Nhắn</label>
                      <textarea
                        name="message"
                        id="message"
                        placeholder="Tin nhắn của bạn..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <button type="submit" className="orange-button" disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                      </button>
                    </fieldset>
                  </div>
                  {success && (
                    <div className="alert alert-success" aria-live="assertive">
                      {success}
                    </div>
                  )}
                  {error && (
                    <div className="alert alert-danger" aria-live="assertive">
                      {error}
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="col-lg-5">
          <h3>Danh mục</h3>
          <div className="section properties">
            <div className="container">
              <section className="contact-filters">
                <div className="contact-menu">
                  <div className="contact-filter-group dropdown">
                    <h6>
                      {" "}
                      <i className="fa-solid fa-cart-shopping" /> Đơn Hàng &amp;
                      Vận Chuyển{" "}
                    </h6>
                    <i className="fa-solid fa-user-chef" />
                  </div>
                  <div className="contact-filter-group dropdown">
                    <h6>Thanh Toán</h6>
                  </div>
                  <div className="contact-filter-group dropdown">
                    <h6>Trả Hàng &amp; Hoàn Tiền</h6>
                  </div>
                  <div className="contact-filter-group dropdown">
                    <h6>Khuyến Mãi &amp; Ưu Đãi</h6>
                  </div>
                </div>
                {/* Thêm các bộ lọc khác như Kích Thước */}
              </section>
            </div>
          </div>
          <h3>Câu hỏi thường gặp</h3>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;