import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// import '../../../public/css/voucher.css';
const VoucherPage = () => {
    const navigate = useNavigate();
    const [selectedVouchers, setSelectedVouchers] = useState([]);
    const [vouchers, setVouchers] = useState({ voucher_1: [], voucher_2: [] });
    const [pageVoucher1, setPageVoucher1] = useState(1);
    const [pageVoucher2, setPageVoucher2] = useState(1);
    const [user, setUser] = useState(null);
    const vouchersPerPage = 3;

    const handleVoucherSelect = (voucherId) => {
        if (selectedVouchers.includes(voucherId)) {
            setSelectedVouchers(selectedVouchers.filter((id) => id !== voucherId));
        } else if (selectedVouchers.length < 2) {
            setSelectedVouchers([...selectedVouchers, voucherId]);
        } else {
            alert('Bạn chỉ được chọn tối đa 2 voucher!');
        }
    };

    const applyVouchers = () => {
        const selectedVoucherData = [...vouchers.voucher_1, ...vouchers.voucher_2].filter(
            (v) => selectedVouchers.includes(v.id_mgg)
        );
        if (selectedVoucherData.length > 0) {
            const voucherData = {
                vouchers: selectedVoucherData,
                appliedAt: new Date().getTime(),
            };
            sessionStorage.setItem('selectedVouchers', JSON.stringify(voucherData));
            alert('Voucher đã được áp dụng thành công!');
            navigate('/cart');
        }
    };

    useEffect(() => {
        // Xóa voucher đã áp dụng khi load lại
        sessionStorage.removeItem('selectedVouchers');

        // Kiểm tra thông tin user từ sessionStorage
        const userData = sessionStorage.getItem('user');
        setUser(userData ? JSON.parse(userData) : null);

        // Fetch voucher từ API
        fetch('https://laravel.ducps34770.id.vn/api/godatviet/voucher')
            .then((response) => response.json())
            .then((data) => setVouchers(data))
            .catch((error) => console.error('Error fetching vouchers:', error));
    }, []);

    const displayVouchers = (vouchers, page) => {
        const startIndex = (page - 1) * vouchersPerPage;
        const endIndex = startIndex + vouchersPerPage;
        return vouchers.slice(startIndex, endIndex);
    };

    const handlePageChange = (voucherType, newPage) => {
        if (voucherType === 'voucher_1') setPageVoucher1(newPage);
        else setPageVoucher2(newPage);
    };

    return (
        <div className="container mt-5">
            <div className="voucher-row">
                <div className="col-md-6 voucher-normal">
                    <h2 className="text-center mb-5">Voucher của bạn</h2>
                    {displayVouchers(vouchers.voucher_1, pageVoucher1).map((voucher) => (
                        <div
                            key={voucher.id_mgg}
                            className={`voucher-card ${selectedVouchers.includes(voucher.id_mgg) ? 'selected' : ''}`}
                            onClick={() => handleVoucherSelect(voucher.id_mgg)}
                        >
                            <div className="voucher-logo">Phòng khách</div>
                            <div className="voucher-info">
                                <h5>Giảm {voucher.so_tien_giam}</h5>
                                <p>Mã Voucher: {voucher.ma_giam_gia}</p>
                                <p>Giới hạn sử dụng: {voucher.gioi_han_su_dung}</p>
                                <p>Hiệu lực: {voucher.ngay_bat_dau} - {voucher.ngay_het_han}</p>
                            </div>
                            <div className="voucher-apply">
                                <input
                                    type="checkbox"
                                    checked={selectedVouchers.includes(voucher.id_mgg)}
                                    readOnly
                                />
                            </div>
                        </div>
                    ))}
                    <Pagination
                        totalItems={vouchers.voucher_1.length}
                        itemsPerPage={vouchersPerPage}
                        currentPage={pageVoucher1}
                        onPageChange={(newPage) => handlePageChange('voucher_1', newPage)}
                    />
                </div>

                <div className="col-md-6 voucher-thanh-vien">
                    <h2 className="text-center mb-5">Voucher dành cho thành viên</h2>
                    {user ? (
                        displayVouchers(vouchers.voucher_2, pageVoucher2).map((voucher) => (
                            <div
                                key={voucher.id_mgg}
                                className={`voucher-card ${selectedVouchers.includes(voucher.id_mgg) ? 'selected' : ''}`}
                                onClick={() => handleVoucherSelect(voucher.id_mgg)}
                            >
                                <div className="voucher-logo voucher-logo-member">Phòng khách</div>
                                <div className="voucher-info">
                                    <h5>Giảm {voucher.so_tien_giam}</h5>
                                    <p>Mã Voucher: {voucher.ma_giam_gia}</p>
                                    <p>Giới hạn sử dụng: {voucher.gioi_han_su_dung}</p>
                                    <p>Hiệu lực: {voucher.ngay_bat_dau} - {voucher.ngay_het_han}</p>
                                </div>
                                <div className="voucher-apply">
                                    <input
                                        type="checkbox"
                                        checked={selectedVouchers.includes(voucher.id_mgg)}
                                        readOnly
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-danger">Bạn cần đăng nhập để sử dụng voucher thành viên.</p>
                    )}
                    {user && (
                        <Pagination
                            totalItems={vouchers.voucher_2.length}
                            itemsPerPage={vouchersPerPage}
                            currentPage={pageVoucher2}
                            onPageChange={(newPage) => handlePageChange('voucher_2', newPage)}
                        />
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-center mt-4 apply-voucher-btn-container">
                <button
                    className="btn btn-success apply-voucher-btn"
                    style={{ display: selectedVouchers.length > 0 ? 'block' : 'none' }}
                    onClick={applyVouchers}
                >
                    Áp dụng voucher
                </button>
            </div>
        </div>
    );
};


// Component Pagination
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
      <div className="section properties">
          <div className="container">
              <div className="row">
                  <div className="col-lg-12">
                      <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <a href="#" onClick={() => onPageChange(currentPage - 1)}>
                                  <i className="fa fa-angle-left" />
                              </a>
                          </li>
                          {Array.from({ length: totalPages }, (_, i) => (
                              <li
                                  key={i + 1}
                                  className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                              >
                                  <a href="#" onClick={() => onPageChange(i + 1)}>
                                      {i + 1}
                                  </a>
                              </li>
                          ))}
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <a href="#" onClick={() => onPageChange(currentPage + 1)}>
                                  <i className="fa fa-angle-right" />
                              </a>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  );
};

// Thêm propTypes để kiểm tra các prop
Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default VoucherPage;
