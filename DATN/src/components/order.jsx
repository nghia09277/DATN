import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../../public/css/order.css';
const Order = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  // Hàm fetch danh sách đơn hàng
  const fetchOrders = async (id) => {
    try {
      setLoading(true);
      setError(null);

      if (id === 0) {
        // Nếu userId = 0, điều hướng đến trang tìm kiếm đơn hàng
        navigate('/tracuu');
        return; // Dừng việc gọi API nếu không có userId hợp lệ
      }

      const headers = id === 0 ? {} : { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` };

      const response = await fetch(`https://laravel.ducps34770.id.vn/api/godatviet/order?user_id=${id}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      }

      const responseData = await response.json();
      setData(responseData); // Lưu dữ liệu trả về
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Khi component được tải
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    const idToFetch = storedUserId ? parseInt(storedUserId, 10) : 0; // Nếu không có userId, mặc định lấy id = 0
    setUserId(idToFetch);
    fetchOrders(idToFetch);
  }, []);

  const statusMap = {
    0: 'Đang duyệt',
    1: 'Chờ hàng',
    2: 'Đang giao',
    3: 'Đã giao',
    4: 'Đã hủy'
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const orders = data?.orders || [];

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4" style={{ marginTop: '200px' }}>Đơn hàng của bạn</h2>
  
      {/* Bảng danh sách đơn hàng */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Tên khách hàng</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Ngày mua</th>
              <th style={{ width: '100px' }}>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id_dh}>
                  <td data-label="Mã đơn hàng">{order.maDon}</td>
                  <td data-label="Tên khách hàng">{order.tenNguoiNhan}</td>
                  <td data-label="Số điện thoại">{order.soDienThoai}</td>
                  <td data-label="Email">{order.email}</td>
                  <td data-label="Địa chỉ">{order.diaChi}</td>
                  <td data-label="Ngày mua">{new Date(order.ngayMua).toLocaleDateString()}</td>
                  <td data-label="Trạng thái">{statusMap[order.trangThai] || 'Không xác định'}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/order-details/${order.id_dh}`, {
                          state: { status: order.trangThai },
                        })
                      }
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
