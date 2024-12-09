import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    first_email: "",
    last_email: "@gmail.com",
    password: "",
    rePassword: "",
    address: "",
    image: null,
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái đang gửi form

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Kiểm tra nếu trường "first_email" có dấu "@" trong giá trị nhập vào
    if (name === "first_email" && value.includes("@")) {
      const emailPrefix = value.split("@")[0]; // Lấy phần trước dấu "@"
      setFormData((prevData) => ({
        ...prevData,
        first_email: emailPrefix, // Cập nhật lại phần đầu email
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu
    if (formData.password !== formData.rePassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    

    setIsSubmitting(true); // Bắt đầu gửi form

    const form = new FormData();
    form.append("name", formData.name);
    form.append("phone", formData.phone);
    form.append("first_email", formData.first_email);
    form.append("last_email", formData.last_email);
    form.append("password", formData.password);
    form.append("password_confirmation", formData.rePassword);
    form.append("address", formData.address);
    form.append("image", formData.image);

    try {
      const response = await axios.post(
        "https://laravel.ducps34770.id.vn/api/godatviet/register_check",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message) {
        setSuccessMessage(response.data.message); // Hiển thị thông báo thành công
        setError("");
        setFormData({
          name: "",
          phone: "",
          first_email: "",
          last_email: "@gmail.com",
          password: "",
          rePassword: "",
          address: "",
          image: null,
        });
      }
    } catch (err) {
      if (err.response && err.response.data.errors) {
        const errorMessages = err.response.data.errors;
        let errorString = "";
        for (const [, value] of Object.entries(errorMessages)) {
          errorString += `${value[0]}\n`; // Lỗi từ backend
        }

        setError(errorString); // Hiển thị tất cả lỗi
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại!");
      }
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false); // Kết thúc gửi form
    }
  };

  return (
    <section className="middle login-mgt">
      <div className="container">
        <div className="row align-items-start justify-content-between">
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mgl">
            <form
              className="form"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="card">
                <div className="card-header">Đăng ký</div>
                <div className="card-body">
                  {/* Hiển thị thông báo lỗi */}
                  {error && <div className="alert alert-danger">{error}</div>}
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )}

                  <div className="form-group col-md-12">
                    <label>Tên của bạn</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Vd: nguyyenvana"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <label>Số điện thoại</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      placeholder="Vd: 01234567***"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label>Email *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="first_email"
                        placeholder="Nhập tên email"
                        required
                        value={formData.first_email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>@gmail.com</label>
                      <input
                        type="text"
                        className="form-control"
                        name="last_email"
                        value={formData.last_email}
                        readOnly
                      />
                    </div>
                  </div>
                  {/* Thông báo cho người dùng nếu phần đuôi email bị loại bỏ */}
                  {formData.first_email.includes("@") && (
                    <div className="alert alert-info">
                      Phần đuôi email đã tự động bị loại bỏ. Chỉ cần nhập tên email trước dấu @.
                    </div>
                  )}
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label>Mật khẩu *</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Password*"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Nhập lại mật khẩu *</label>
                      <input
                        type="password"
                        className="form-control"
                        name="rePassword"
                        placeholder="Confirm Password*"
                        required
                        value={formData.rePassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group col-md-12">
                    <label>Địa chỉ</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      placeholder="Nhập địa chỉ của bạn"
                      required
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <label>Ảnh đại diện</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primarylogin full-width text-center"
                      disabled={isSubmitting} // Vô hiệu hóa nút khi đang gửi form
                    >
                      {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                  </div>
                  <div>
                    Bạn đã có tài khoản?<Link to="/login">Đăng nhập</Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
