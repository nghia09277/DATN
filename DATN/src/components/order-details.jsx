import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
// import '../../public/css/order-detail.css';
const TraCuuDetails = () => {
  const { orderId } = useParams(); 

  const [orderDetails, setOrderDetails] = useState(null);
  const [statusFromAPI, setStatusFromAPI] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const response = await fetch(`https://laravel.ducps34770.id.vn/api/godatviet/detail_search/${orderId}`);
        if (!response.ok) throw new Error("Failed to fetch order details");
        const data = await response.json();
        console.log('API Response:', data);
        setOrderDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const loadOrderStatus = async () => {
      try {
        const response = await fetch(`https://laravel.ducps34770.id.vn/api/godatviet/order_getStatus/${orderId}`);
        if (!response.ok) throw new Error(`Failed to fetch order status: ${response.statusText}`);
        const data = await response.json();
        console.log('API Response:', data);

        if (data && data.order) {
          const trangThai = data.order.trangThai;
          setStatusFromAPI(trangThai);
          sessionStorage.setItem('orderStatus', trangThai);
          console.log('Saved orderStatus to sessionStorage:', trangThai);
        } else {
          console.error('Invalid data structure', data);
        }
      } catch (err) {
        setError(`Error fetching order status: ${err.message}`);
        console.error('Error fetching order status:', err);
      }
    };

    loadOrderDetails();
    loadOrderStatus();
  }, [orderId]);



  const handleCancelOrder = async () => {
    const token = sessionStorage.getItem('authToken');  // Lấy token từ sessionStorage
  
    if (!token) {
      alert('Bạn cần đăng nhập để thực hiện hành động này');
      return;
    }
  
    try {
      const response = await fetch(`https://laravel.ducps34770.id.vn/api/godatviet/order_cancel/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);  // Hiển thị thông báo thành công
        setStatusFromAPI(4);  // Cập nhật trạng thái đơn hàng là "Hủy"
      } else {
        alert(data.message || 'Có lỗi xảy ra khi hủy đơn hàng');
      }
    } catch (err) {
      alert('Lỗi kết nối: ' + err.message);
    }
  };
  
  

  const getActiveClass = (status, circleIndex) => {
    switch (status) {
      case 0: return circleIndex <= 1 ? "active" : "";
      case 1: return circleIndex <= 2 ? "active" : "";
      case 2: return circleIndex <= 3 ? "active" : "";
      case 3: return circleIndex <= 4 ? "active" : "";
      default: return "";
    }
  };

  const checkIcon = (circleIndex) => {
    if (statusFromAPI === null) return null;
    switch (statusFromAPI) {
      case 0: return circleIndex <= 1 ? <i className="fa-solid fa-check" /> : null;
      case 1: return circleIndex <= 2 ? <i className="fa-solid fa-check" /> : null;
      case 2: return circleIndex <= 3 ? <i className="fa-solid fa-check" /> : null;
      case 3: return circleIndex <= 4 ? <i className="fa-solid fa-check" /> : null;
      default: return null;
    }
  };

  const getProgressWidth = (status) => {
    if (status === null) return 0;
    switch (status) {
      case 0: return 0;
      case 1: return 33;
      case 2: return 68;
      case 3: return 100;
      default: return 0;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!orderDetails) return <div>Order details not found.</div>;

  return (
    <div id="order-details" className="container-fluid mt-5 order-details">
      <h4 className="heading text-center mb-4 chitiet-title">Chi Tiết Đơn Hàng {orderId}</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-order-detail">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Tên Sản Phẩm</th>
              <th scope="col">Ảnh Sản Phẩm</th>
              <th scope="col">Số Lượng</th>
              <th scope="col">Đơn Giá</th>
              <th scope="col">Tổng Giá</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.detail.map((productDetails) => (
              <tr key={productDetails.id_ct}>
                <td data-label="Tên Sản Phẩm">{productDetails.ten_sp}</td>
                <td data-label="Ảnh Sản Phẩm">
                  <img
                    src={productDetails.hinh}
                    alt={productDetails.ten_sp}
                    className="product-image img-fluid"
                    style={{ width: '100px' }}
                  />
                </td>

                <td data-label="Số Lượng">{productDetails.soLuong}</td>
                <td data-label="Đơn Giá">{productDetails.gia_sp.toLocaleString() || "N/A"} VND</td>
                <td  data-label="Tổng Giá">{productDetails.tongTien.toLocaleString() || "N/A"} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-group d-flex justify-content-between mt-3">
          <button type="button" className="btn btn-secondary close-detail-btn">
            <Link to="/order" style={{ color: 'white' }}>Đóng</Link>
          </button>
          <button
            type="button"
            className="btn btn-danger huy-don-btn"
            onClick={() => {
              if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
                handleCancelOrder();
              }
            }}
            style={{ display: statusFromAPI === 4 || statusFromAPI === 3 ? 'none' : 'inline-block' }}
          >
            Hủy đơn hàng
          </button>

        </div>
      <div className="total-payment mt-3">
        <span>Tổng tiền thanh toán: </span>{" "}
        <strong>
          {orderDetails.detail
            .reduce((total, item) => total + item.tongTien, 0)
            .toLocaleString() || "N/A"}{" "}
          VND
        </strong>
      </div>

      <ul className="track list-inline mt-3">
        <li className={`list-inline-item ${getActiveClass(statusFromAPI, 1)}`}>
          <i className={`fa-solid fa-box ${getActiveClass(statusFromAPI, 1)}`} />
        </li>
        <li className={`list-inline-item ${getActiveClass(statusFromAPI, 2)}`}>
          <i className={`fa-solid fa-user-check ${getActiveClass(statusFromAPI, 2)}`} />
        </li>
        <li className={`list-inline-item ${getActiveClass(statusFromAPI, 3)}`}>
          <i className={`fa-solid fa-truck ${getActiveClass(statusFromAPI, 3)}`} />
        </li>
        <li className={`list-inline-item ${getActiveClass(statusFromAPI, 4)}`}>
          <i className={`fa-solid fa-check ${getActiveClass(statusFromAPI, 4)}`} />
        </li>
      </ul>

      <div className="status-bar mt-3">
        <div className="progress">
          <div className="progress-bar" style={{ width: `${getProgressWidth(statusFromAPI)}%` }} />
        </div>
        <div className="status-indicators">
          <div className={`status-circle circle-1 ${getActiveClass(statusFromAPI, 1)}`}>
            {checkIcon(1)}
          </div>
          <div className={`status-circle circle-2 ${getActiveClass(statusFromAPI, 2)}`}>
            {checkIcon(2)}
          </div>
          <div className={`status-circle circle-3 ${getActiveClass(statusFromAPI, 3)}`}>
            {checkIcon(3)}
          </div>
          <div className={`status-circle circle-4 ${getActiveClass(statusFromAPI, 4)}`}>
            {checkIcon(4)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraCuuDetails;
