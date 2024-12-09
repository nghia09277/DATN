import React, { useEffect, useState } from "react";
// import '../../public/css/checkout.css';
export default function ThanhToan() {
  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState("cod");
  const [thongTinNguoiDung, setThongTinNguoiDung] = useState(null);
  const [matHangTrongGio, setMatHangTrongGio] = useState(() => {
    return JSON.parse(sessionStorage.getItem("cart")) || [];
  });
  const [voucherDaChon, setVoucherDaChon] = useState(null);

  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem("user"));
    if (storedUserData) {
      setThongTinNguoiDung(storedUserData);
    }

    const storedVoucher = JSON.parse(sessionStorage.getItem("selectedVouchers"));
    if (storedVoucher) {
      setVoucherDaChon(storedVoucher);
    }
  }, []);

  const handlePhuongThucThanhToanChange = (event) => {
    setPhuongThucThanhToan(event.target.value);
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const tongTienGoc = matHangTrongGio.reduce((sum, item) => {
    return sum + item.giaSale * item.quantity;
  }, 0);

  const tongTienSauKhiGiam = () => {
    if (voucherDaChon && voucherDaChon.vouchers) {
      let totalDiscountPercent = 0; // Giảm giá %
      let totalDiscountFixed = 0;  // Giảm giá cố định (VND)
  
      voucherDaChon.vouchers.forEach((voucher) => {
        if (voucher.so_tien_giam.includes("%")) {
          totalDiscountPercent += parseFloat(voucher.so_tien_giam.replace("%", ""));
        } else {
          totalDiscountFixed += parseFloat(voucher.so_tien_giam);
        }
      });
  
      const discountAmountPercent = (totalDiscountPercent / 100) * tongTienGoc;
      const totalDiscount = discountAmountPercent + totalDiscountFixed;
  
      const tongTienSauGiam = tongTienGoc - totalDiscount;
  
      return {
        totalAfterDiscount: Math.max(0, tongTienSauGiam),
        totalDiscount,
      };
    }
  
    return {
      totalAfterDiscount: tongTienGoc,
      totalDiscount: 0,
    };
  };



  const updateVoucherUsage = async () => {
    if (!voucherDaChon || !voucherDaChon.vouchers) return;
  
    const updatedVouchers = voucherDaChon.vouchers.map((voucher) => ({
      id_mgg: voucher.id_mgg,
      used_count: 1, // Mặc định giảm 1 lần sử dụng cho mỗi voucher
    }));
  
    try {
      const response = await fetch("https://laravel.ducps34770.id.vn/api/godatviet/voucher/update_usage", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vouchers: updatedVouchers }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        console.error("Lỗi khi cập nhật voucher:", data.message);
      }
    } catch (error) {
      console.error("Lỗi trong khi gọi API cập nhật voucher:", error);
    }
  };


  const handleThanhToan = async () => {
    const note = document.getElementById("note").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    // Kiểm tra thông tin người dùng
    if (!name || !email || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Vui lòng nhập một email hợp lệ.");
      return;
    }
    const searchParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
    const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
    // Gán ID người dùng là 0 nếu chưa đăng nhập
    const userData = {
      id: thongTinNguoiDung ? thongTinNguoiDung.id : 0,
      name,
      email,
      phone,
      address,
    };

    const { totalAfterDiscount } = tongTienSauKhiGiam();

    const payload = {
      ...userData,
      note,
      payment_method: phuongThucThanhToan,
      cart_items: matHangTrongGio,
      tongtien: totalAfterDiscount,
      vnp_ResponseCode,
      vnp_TransactionStatus,
    };
    console.log("Payload:", payload);

    try {
      const response = await fetch(
        "https://laravel.ducps34770.id.vn/api/godatviet/complete_checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Phản hồi không mong đợi:", text);
        throw new Error("Phản hồi không phải là JSON");
      }

      if (response.ok) {
        alert(data.message);
        // Xóa giỏ hàng khỏi sessionStorage
        await updateVoucherUsage();
  
        sessionStorage.removeItem("cart");
        sessionStorage.removeItem("selectedVouchers");

        // Chuyển hướng người dùng sau khi thanh toán thành công
        const redirectUrl = data.redirect || "/order"; // Chuyển hướng đến trang đơn hàng
        window.location.href = redirectUrl;
      } else {
        alert(data.message); // Xử lý thông báo lỗi
      }
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };
  const handleVnPayPayment = async () => {
    const { totalAfterDiscount } = tongTienSauKhiGiam();
    try {
      const response = await fetch(
        "https://laravel.ducps34770.id.vn/api/godatviet/vnpay_payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Pass necessary data such as total amount and order details
            amount: totalAfterDiscount, // Example: Total amount after discount
            order_info: "Thanh toán đơn hàng qua VNPAY",
            // Add additional required fields here
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.code === "00") {
        // Redirect to VNPAY URL
        window.location.href = data.data;
      } else {
        alert(data.message || "Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error during VNPAY payment:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <>
      <section className="featured">
        <div className="container">
          <div className="row">
            {/* Form thanh toán */}
            <h2 className="section-heading" style={{ "margin-top":"200px" }}>Thông Tin Đặt Hàng</h2>
            <div className="col-lg-8check">
              <form>
                {/* Thông tin khách hàng */}
                <div className="card mb-4check">
                  <div className="card-header">
                    <h5>Thông Tin Giao Hàng</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6check">
                        <div className="mb-3check">
                          <label htmlFor="name" className="form-label">
                            Tên đầy đủ
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Nhập tên người nhận"
                            defaultValue={
                              thongTinNguoiDung ? thongTinNguoiDung.name : ""
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6check">
                        <div className="mb-3check">
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Nhập email của bạn"
                            defaultValue={thongTinNguoiDung?.email || ""}

                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3check">
                      <label htmlFor="address" className="form-label">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        placeholder="Nhập địa chỉ nhận hàng"
                        defaultValue={
                          thongTinNguoiDung ? thongTinNguoiDung.address : ""
                        }
                        required
                      />
                    </div>
                    <div className="mb-3check">
                      <label htmlFor="phone" className="form-label">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        placeholder="Nhập số điện thoại nhận hàng"
                        defaultValue={
                          thongTinNguoiDung ? thongTinNguoiDung.phone : ""
                        }
                        required
                      />
                    </div>
                    {/* Trường ghi chú */}
                    <div className="mb-3check">
                      <label htmlFor="note" className="form-label">
                        Ghi chú
                      </label>
                      <textarea
                        className="form-control"
                        id="note"
                        rows={3}
                        placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt (nếu có)"
                      />
                    </div>
                  </div>
                </div>
                {/* Phương thức thanh toán */}
                <div className="card mb-4check">
                  <div className="card-header">
                    <h5>Phương Thức Thanh Toán</h5>
                  </div>
                  <div className="card-body">
                    <div className="form-check">
                      <input
                        className="form-check-input
                        "
                        type="radio"
                        name="paymentMethod"
                        id="cod"
                        value="cod"
                        checked={phuongThucThanhToan === "cod"}
                        onChange={handlePhuongThucThanhToanChange}
                      />
                      <label className="form-check-label" htmlFor="cod">
                        Thanh toán khi nhận hàng
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="vnpay"
                        value="vnpay"
                        checked={phuongThucThanhToan === "vnpay"}
                        onChange={handlePhuongThucThanhToanChange}
                      />
                      <label className="form-check-label" htmlFor="vnpay">
                        Thanh toán qua VNPAY
                      </label>
                    </div>

                    {/* Nút Thanh Toán Bằng VNPAY chỉ hiển thị khi chọn VNPAY */}
                    {phuongThucThanhToan === "vnpay" && (
                      <button
                        type="button"
                        className="btn  w-100 mt-3"
                        onClick={handleVnPayPayment}
                      >
                        Thanh Toán Bằng VNPAY
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="col-lg-4check">
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Thông tin đơn hàng</h5>
                </div>
                <div className="card-body p-4check">
                  <ul className="list-group mb-4check">
                    {/* Mục lặp sản phẩm */}
                    {matHangTrongGio.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item border-0 d-flex align-items-center justify-content-between p-3"
                      >
                        <div className="d-flex align-items-center">
                          <div className="position-relative me-3">
                            <img
                              src={item.hinh} // Thay `item.image` bằng đường dẫn ảnh nếu có trong `item`
                              alt={item.ten_sp}
                              className="img-thumbnail"
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                              }}
                            />
                            <span
                              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary"
                              style={{ fontSize: "0.8rem", top: "-10px" }}
                            >
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <h6 className="mb-1">{item.ten_sp}</h6>
                            <p className="mb-0 text-muted">
                              Đơn giá: {item.giaSale.toLocaleString()} VND
                            </p>
                          </div>
                        </div>
                        <span className="fw-bold">
                          {(item.giaSale * item.quantity).toLocaleString()} VND
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mb-3 d-flex justify-content-between">
                    <span className="text-muted">Tạm tính:</span>
                    <span className="fw-bold">
                      {tongTienGoc.toLocaleString()} VND
                    </span>
                  </div>
                  <hr />
                  <div className="mb-3 d-flex justify-content-between">
                    <span className="text-muted">Phí vận chuyển</span>
                    <span className="fw-bold">0 VND</span>
                  </div>
                  <div className="mb-3 d-flex justify-content-between">
                        <span className="text-muted">Giảm giá</span>
                        <span className="fw-bold text-primary-emphasis">
                          {tongTienSauKhiGiam().totalDiscount.toLocaleString()} VND
                        </span>
                      </div>
                      <div className="mb-4 d-flex justify-content-between">
                        <span className="text-muted">Tổng cộng</span>
                        <span className="fw-bold" style={{ color: "chocolate" }}>
                          {tongTienSauKhiGiam().totalAfterDiscount.toLocaleString()} VND
                        </span>
                      </div>
                  <button
                    type="button"
                    className="btn btn-primarycheck w-100"
                    style={{ padding: 12 }}
                    onClick={handleThanhToan}
                  >
                    Thanh Toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
