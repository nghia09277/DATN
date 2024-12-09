import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';


const TraCuu = () => {

    const [orderCode, setOrderCode] = useState('');

    const [orders, setOrders] = useState([]);

    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    // Hàm tìm kiếm đơn hàng

    const handleSearch = async (e) => {

        e.preventDefault();

        if (orderCode.trim()) {

            setLoading(true);

            setError('');

            try {

                const response = await fetch(`https://laravel.ducps34770.id.vn/api/godatviet/search_order?order_code=${orderCode}`);

                if (!response.ok) throw new Error('Không tìm thấy đơn hàng với mã này.');


                const data = await response.json();

                setOrders([data.order]); // Giả sử API trả về một đơn hàng

            } catch (err) {

                setError(err.message);

                setOrders([]);

            } finally {

                setLoading(false);

            }

        } else {

            setError('Vui lòng nhập mã đơn hàng để tìm kiếm.');

        }

    };


    const statusMap = {

        0: 'Đang duyệt',

        1: 'Chờ hàng',

        2: 'Đang giao',

        3: 'Đã giao',

        4: 'Đã hủy',
    };


    return (

        <div className="container my-5">

            <h2 className="text-center mb-4" style={{ marginTop: '200px' }}>Tra cứu đơn hàng</h2>


            {/* Form tìm kiếm */}

            <div className="mb-4 text-center">

                <form className="search-form" role="search" onSubmit={handleSearch}>

                    <input

                        className="form-control me-2"

                        type="search"

                        placeholder="Tra cứu mã đơn hàng của bạn..."

                        aria-label="Search"

                        value={orderCode}

                        onChange={(e) => setOrderCode(e.target.value)}

                        style={{ width: '300px', display: 'inline-block', borderRadius: '25px' }}

                    />

                    <button

                        className="btn btn-outline-light"

                        type="submit"

                        style={{ backgroundColor: '#f35525', borderRadius: '25px', display: 'inline-block' }}

                    >

                        <i className="fa fa-search" />

                    </button>

                </form>

                {error && <div className="alert alert-danger mt-3">{error}</div>}

            </div>


            {/* Bảng danh sách đơn hàng */}

            {loading && <div>Loading...</div>}

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

                                    <td data-label="Mã đơn">{order.maDon}</td>

                                    <td data-label="Tên người nhận" >{order.tenNguoiNhan}</td>

                                    <td data-label="Số điện thoại">{order.soDienThoai}</td>

                                    <td data-label="Email">{order.email}</td>

                                    <td data-label="Địa chỉ">{order.diaChi}</td>

                                    <td data-label="Ngày mua">{new Date(order.ngayMua).toLocaleDateString()}</td>

                                    <td data-label="Trạng thái">{statusMap[order.trangThai] || 'Không xác định'}</td>

                                    <td>

                                        <button

                                            className="btn btn-primary"

                                            onClick={() =>

                                                navigate(`/tracuu-details/${order.id_dh}`, {


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


export default TraCuu;