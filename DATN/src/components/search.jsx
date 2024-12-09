import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
// import '../../public/css/rearch.css';
const Search = () => {
  const location = useLocation();
  const products = location.state?.products || []; // Nhận sản phẩm từ state

  return (
    <div className="container-search">
      <div className="row pd-page">
        <div className="col-md-12 col-xs-12">
          <div className="heading-page">
            <h1>Tìm kiếm</h1>
            <p className="subtxt">
              Có <span>{products.length} sản phẩm</span> cho tìm kiếm
            </p>
          </div>
          <div className="wrapbox-content-page">
            <div className="content-page" id="search">
              <p className="subtext-result">
                Kết quả tìm kiếm cho{" "}
                <strong>
                  {new URLSearchParams(location.search).get("query")}
                </strong>
                .
              </p>
              
            </div>
          </div>
          
              <div className="index-row-care">
                {products.map((product) => (
                  <div
                    className="col-md-6 col-lg-4 "
                    key={product.id}
                  >
                     <div className="search-index-item">
                      <a href="property-details.html">
                        <Link to={`/Propertydetails/${product.id_sp}`}>
                          <img
                            className="index"
                            src={product.hinh}
                            alt={product.ten_sp}
                          />
                        </Link>
                      </a>
                      <span className="index-category">{product.danhmuc.loai}</span>
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
                ))}
              </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
