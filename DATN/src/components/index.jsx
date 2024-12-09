import Slideshow from "./slideshow";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import '../../public/css/index.css';
// import '../../public/css/dropdown.css';
// import '../../public/css/bootstrap.min.css';
// import '../../public/css/fontawesome.css';
const Index = () => {
  const [products, setProducts] = useState({
    sp_sale: [], // Sản phẩm Ưu Đãi
    sp_new: [], // Sản phẩm Mới
    sp_hot: [], // Sản phẩm Bán Chạy (đổi tên từ sp_best thành sp_hot)
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://laravel.ducps34770.id.vn/api/godatviet/home_us"
        );
        console.log("Dữ liệu nhận được từ API:", response.data); // Log dữ liệu để kiểm tra

        if (response.data) {
          setProducts({
            sp_sale: response.data.sp_sale || [],
            sp_new: response.data.sp_new || [],
            sp_hot: response.data.sp_hot || [], // Thay đổi từ sp_best thành sp_hot
          });
        } else {
          console.error("Không tìm thấy dữ liệu sản phẩm.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Slideshow />
      <>
        <div className="index-section best-deal">
          <div className="container">
            <div className="index-row">
              <div className="index-buton">
                <div className="index-col-lg-4">
                  <div className="index-section-heading"></div>
                </div>
                <div className="nav-wrapper">
                  <ul className="nav nav-tabs qin" role="tablist">
                    <li className="index-nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="sofa-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#sofa"
                        type="button"
                        role="tab"
                        aria-controls="sofa"
                        aria-selected="true"
                      >
                        PHÒNG KHÁCH
                      </button>
                    </li>
                    <li className="index-nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="table-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#table"
                        type="button"
                        role="tab"
                        aria-controls="table"
                        aria-selected="false"
                      >
                        PHÒNG ĂN
                      </button>
                    </li>
                    <li className="index-nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="bed-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#bed"
                        type="button"
                        role="tab"
                        aria-controls="bed"
                        aria-selected="false"
                      >
                        PHÒNG NGỦ
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="index-col-lg-12">
                <div className="index-tabs-content">
                  <div className="row">
                  <div className="tab-content" id="myTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="sofa"
                        role="tabpanel"
                        aria-labelledby="sofa-tab"
                      >
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="info-table">
                            <ul style={{padding: "0", }}>
                                <li>
                                  Nội thất hướng đến sự tiếp khách, thư giãn,
                                  hoặc giải trí. Các món đồ chính gồm: Bộ sofa
                                  hoặc ghế gỗ (kết hợp với bàn trà). Kệ tivi, kệ
                                  trang trí. Tủ trưng bày hoặc giá sách.
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <img src="/images/deal-01.jpg" alt="" />
                          </div>
                          <div className="col-lg-3">
                            <h4>Thông Tin Thêm Về Sofa</h4>
                            <p>
                              Đây là một chiếc sofa cao cấp với chất liệu da/nỉ,
                              thiết kế hiện đại và đệm êm ái. Phù hợp cho phòng
                              khách của bạn.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="table"
                        role="tabpanel"
                        aria-labelledby="table-tab"
                      >
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="info-table">
                              <ul style={{padding: "0", }}>
                                 <li>
                                Nội thất tập trung vào việc phục vụ bữa ăn và
                                tương tác gia đình, bạn bè trong không gian ăn
                                uống. Các món đồ chính gồm: Bàn ăn (có thể hình
                                chữ nhật, tròn, hoặc oval). Ghế ăn đồng bộ hoặc
                                phối ghép. Tủ đựng chén bát hoặc quầy buffet.
                              </li>
                              </ul>
                             
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <img src="/images/deal-02.jpg" alt="" />
                          </div>
                          <div className="col-lg-3">
                            <h4>Thông Tin Chi Tiết Về Bàn Ăn</h4>
                            <p>
                              Bàn ăn gỗ tự nhiên, thiết kế tinh tế với chân đế
                              vững chắc. Phù hợp với mọi không gian bếp.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="bed"
                        role="tabpanel"
                        aria-labelledby="bed-tab"
                      >
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="info-table">
                            <ul style={{padding: "0", }}>
                                <li>
                                Phòng ngủ là không gian riêng tư, tập trung vào sự thoải mái và thư giãn và lưu trữ đồ dùng cá nhân.

                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <img src="/images/deal-03.jpg" alt="" />
                          </div>
                          <div className="col-lg-3">
                            <h4>Thông Tin Thêm Về Giường Ngủ</h4>
                            <p>
                              Giường ngủ thiết kế sang trọng với chất liệu gỗ
                              hoặc kim loại, phù hợp với mọi phòng ngủ.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* sản phẩm */}
        <div className="properties section">
          <div className="container">
            <div className="les">
              <div className="index-col-lg-4 offset-lg-4">
                <div className="section-heading index-text-center">
                  <h6>| Sản Phẩm</h6>
                  <h2>
                    Chúng Tôi Cung Cấp Những Sản Phẩm Nội Thất Tốt Nhất Mà Bạn
                    Thích
                  </h2>
                </div>
              </div>
            </div>

            <h2 style={{ marginTop: 40 ,marginBottom: 20 }}>
              SẢN PHẨM <span style={{ color: "#f35525" }}>ƯU ĐÃI</span>
            </h2>

            <div className="index-row-care">
              {products.sp_sale.length > 0 ? (
                products.sp_sale.map((product) => {
                  // Tính toán phần trăm giảm giá
                  const originalPrice = Number(product.gia_sp);
                  const salePrice = Number(product.giaSale);
                  const discountPercentage =
                    originalPrice > 0
                      ? Math.round(
                          ((originalPrice - salePrice) / originalPrice) * 100
                        )
                      : 0;

                  return (
                    <div key={product.id_sp} className="col-md-6 col-lg-4">
                      <div className="index-item">
                        <a href="property-details.html">
                          <Link to={`/Propertydetails/${product.id_sp}`}>
                            <img
                              className="index"
                              src={product.hinh}
                              alt={product.ten_sp}
                            />
                          </Link>
                        </a>
                        <span className="index-category">
                          {product.danhmuc.loai}
                        </span>
                        <h4>
                          <a className="index" href="property-details.html">
                            <Link to={`/Propertydetails/${product.id_sp}`}>
                              {product.ten_sp}
                            </Link>
                          </a>
                        </h4>
                        <h6 className="index-price">
                          {Number(product.giaSale).toLocaleString()}đ{" "}
                          <span className="index-original-price">
                            {Number(product.gia_sp).toLocaleString()}đ
                          </span>
                        </h6>
                        {/* Hiển thị phần trăm giảm giá */}
                        <div
                          className="discount-percentage"
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            backgroundColor: "#f35525",
                            color: "#fff",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                        >
                          -{discountPercentage}%
                        </div>
                        <ul className="index-ul">
                          <span
                            style={{ color: "#f35525" }}
                            className="index-span"
                          >
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <span className="index-sold">
                              Đã bán: {product.luot_mua}
                            </span>
                          </span>
                        </ul>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>Không có sản phẩm ưu đãi nào.</div>
              )}
            </div>

            <div className="underline" />
            <h2 style={{ marginBottom: 20 }}>
              SẢN PHẨM <span style={{ color: "#f35525" }}>MỚI</span>
            </h2>
            <div className="index-row-care">
              {products.sp_new.length > 0 ? (
                products.sp_new.map((product) => (
                  <div key={product.id_sp} className=" col-md-6 col-lg-4 ">
                    <div className="index-item">
                      <a href="property-details.html">
                        <Link to={`/Propertydetails/${product.id_sp}`}>
                          <img
                            className="index"
                            src={product.hinh}
                            alt={product.ten_sp}
                          />
                        </Link>
                      </a>
                      {/* <span className="index-category">{product.danhmuc.loai}</span> */}

                      <h4>
                        <a className="index" href="property-details.html">
                          <Link to={`/Propertydetails/${product.id_sp}`}>
                            {product.ten_sp}
                          </Link>
                        </a>
                      </h4>
                      <h6 className="index-price">
                        {Number(product.giaSale).toLocaleString()}đ{" "}
                        <span className="index-original-price">
                          {Number(product.gia_sp).toLocaleString()}đ
                        </span>
                      </h6>
                      <ul className="index-ul">
                        <span
                          style={{ color: "#f35525" }}
                          className="index-span"
                        >
                          <i className="fas fa-star" />
                          <i className="fas fa-star" />
                          <i className="fas fa-star" />
                          <i className="fas fa-star" />
                          <i className="fas fa-star" />
                          <span className="index-sold">
                            Đã bán: {product.luot_mua}
                          </span>
                        </span>
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div>Không có sản phẩm ưu đãi nào.</div>
              )}
            </div>
            <div className="underline" />
            <h2 style={{ marginBottom: 20 }}>
              SẢN PHẨM <span style={{ color: "#f35525" }}>BÁN CHẠY</span>
            </h2>
            <div className="index-row-care">
              {products.sp_hot.length > 0 ? (
                products.sp_hot.map((product) => (
                  <div key={product.id_sp} className=" col-md-6 col-lg-4 ">
                    <div className="index-item">
                      <a href="property-details.html">
                        <Link to={`/Propertydetails/${product.id_sp}`}>
                          <img
                            className="index"
                            src={product.hinh}
                            alt={product.ten_sp}
                          />
                        </Link>
                      </a>
                      {/* <span className="index-category">{product.danhmuc.loai}</span> */}
                      <span className="index-category">
                        {product.danhmuc.loai}
                      </span>

                      <h4>
                        <a className="index" href="property-details.html">
                          <Link to={`/Propertydetails/${product.id_sp}`}>
                            {product.ten_sp}
                          </Link>
                        </a>
                      </h4>
                      <h6 className="index-price">
                        {Number(product.giaSale).toLocaleString()}đ{" "}
                        <span className="index-original-price">
                          {Number(product.gia_sp).toLocaleString()}đ
                        </span>
                      </h6>
                      <ul className="index-ul">
                        <span
                          style={{ color: "#f35525" }}
                          className="index-span"
                        >
                          <i className="fas fa-star" />
                          <i className="fas fa-star" />
                          <i className="fas fa-star" />
                          <i className="fas fa-star" />
                          <i className="fas fa-star" />
                          <span className="index-sold">
                            Đã bán: {product.luot_mua}
                          </span>
                        </span>
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div>Không có sản phẩm ưu đãi nào.</div>
              )}
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Index;
