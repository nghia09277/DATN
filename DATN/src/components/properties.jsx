import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import '../../public/css/properties.css';
const Properties = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [selectedWoodType, setSelectedWoodType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({sortByPriceAsc: false,sortByPriceDesc: false,sortByMostPurchased: false,});
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
 // Hàm fetchData để lấy dữ liệu sản phẩm từ API
 useEffect(() => {
  const fetchData = async () => {
      try {
          // Gửi yêu cầu GET đến API
          const productResponse = await axios.get("https://laravel.ducps34770.id.vn/api/godatviet/shop");
          setProducts(productResponse.data.data); // Cập nhật danh sách sản phẩm
          setLoading(false); // Đặt trạng thái loading là false khi hoàn thành
      } catch (err) {
          setError(err); // Cập nhật lỗi nếu có
          setLoading(false); // Đặt trạng thái loading là false khi có lỗi
      }
  };

  fetchData(); // Gọi hàm fetchData khi component được mount
}, []);
  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const filteredProducts = () => {
    let filtered = [...products];

    // Lọc theo danh mục đã chọn
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.id_loaisp)
      );
    }

    // Lọc theo khoảng giá
    if (selectedPriceRange.length > 0) {
      filtered = filtered.filter((product) => {
          const price = product.gia_sp; // Lấy giá của sản phẩm
          // Kiểm tra khoảng giá đã chọn
          if (selectedPriceRange.includes("under500k") && price < 500000) return true;
          if (selectedPriceRange.includes("500kTo1M") && price >= 500000 && price < 1000000) return true;
          if (selectedPriceRange.includes("1MTo1.5M") && price >= 1000000 && price < 1500000) return true;
          if (selectedPriceRange.includes("above1.5M") && price >= 1500000) return true; // Thêm khoảng giá trên 1.5 triệu
          return false; // Không trả về sản phẩm nếu không thuộc khoảng giá đã chọn
      });
  }

    // Lọc theo loại gỗ
    if (selectedWoodType.length > 0) {
      filtered = filtered.filter((product) =>
        selectedWoodType.includes(product.loai_go)
      );
    }

    // Sắp xếp theo số lượng mua hoặc giá
    if (filters.sortByMostPurchased) {
      filtered.sort((a, b) => b.luot_mua - a.luot_mua);
    } else if (filters.sortByPriceAsc) {
      filtered.sort((a, b) => a.gia_sp - b.gia_sp);} else if (filters.sortByPriceDesc) {
      filtered.sort((a, b) => b.gia_sp - a.gia_sp);
    }
    return filtered;
  };

  // Tạo danh sách danh mục từ sản phẩm
  const uniqueCategories = Array.from(
    new Set(products.map((product) => product.danhmuc.id_loaisp))
  ).map((id) => ({
    id_loaisp: id,
    loai: products.find((product) => product.danhmuc.id_loaisp === id)?.danhmuc
      .loai,
  }));

  const paginatedProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts().slice(startIndex, startIndex + productsPerPage);
  };

  const totalPages = Math.ceil(filteredProducts().length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="page-heading header-text"></div>
      <div className="section properties">
        <div className="container">
          <section className="filters">
            <div className="moni">
              <h3>Các sản phẩm GỖ ĐẤT VIỆT</h3>
              <div className="filter-group dropdown">
                <h6
                  onClick={() =>
                    document
                      .querySelector(".dropdown-content")
                      .classList.toggle("show")
                  }
                >
                  Bán chạy nhất
                  <i
                        className="fa-solid fa-caret-down"
                        style={{ color: "#1e1e1e", marginLeft: 12 }}
                      />
                </h6>
                <ul className="dropdown-content">
                  <li>
                    <input
                      type="checkbox"
                      name="sortByPriceAsc"
                      checked={filters.sortByPriceAsc}
                      onChange={handleFilterChange}
                    />
                    Giá: Tăng dần
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      name="sortByPriceDesc"
                      checked={filters.sortByPriceDesc}
                      onChange={handleFilterChange}
                    />
                    Giá: Giảm dần
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      name="sortByMostPurchased"
                      checked={filters.sortByMostPurchased}
                      onChange={handleFilterChange}
                    />
                    Mua nhiều nhất
                  </li>
                </ul>
              </div>
            </div>
            <div className="menu">
              <div className="filter-group dropdown">
                <h6
                  onClick={() =>
                    document
                      .querySelector(".dropdown-content").classList.toggle("show")
                  }
                >
                  Danh Mục
                  <i
                        className="fa-solid fa-caret-down"
                        style={{ color: "#1e1e1e", marginLeft: 12 }}
                      />
                </h6>
                <ul className="dropdown-content">
                  {uniqueCategories.map((category) => (
                    <li key={category.id_loaisp}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(
                          category.id_loaisp
                        )}
                        onChange={(e) => {
                          const { checked } = e.target;
                          setSelectedCategories((prev) =>
                            checked
                              ? [...prev, category.id_loaisp]
                              : prev.filter((id) => id !== category.id_loaisp)
                          );
                        }}
                      />
                      {category.loai}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="filter-group dropdown">
                <h6
                  onClick={() =>
                    document
                      .querySelector(".dropdown-content")
                      .classList.toggle("show")
                  }
                >
                  Giá sản phẩm
                  <i
                        className="fa-solid fa-caret-down"
                        style={{ color: "#1e1e1e", marginLeft: 12 }}
                      />
                </h6>
                <ul className="dropdown-content">
                  <li>
                    <input
                      type="checkbox"
                      checked={selectedPriceRange.includes("under500k")}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setSelectedPriceRange((prev) =>
                          checked
                            ? [...prev, "under500k"]
                            : prev.filter((range) => range !== "under500k")
                        );
                      }}
                    />
                    Dưới 500,000₫
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={selectedPriceRange.includes("500kTo1M")}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setSelectedPriceRange((prev) =>
                          checked
                            ? [...prev, "500kTo1M"]
                            : prev.filter((range) => range !== "500kTo1M")
                        );
                      }}
                    />
                    500,000₫ - 1,000,000₫</li>
                  <li>
                    <input
                      type="checkbox"
                      checked={selectedPriceRange.includes("1MTo1.5M")}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setSelectedPriceRange((prev) =>
                          checked
                            ? [...prev, "1MTo1.5M"]
                            : prev.filter((range) => range !== "1MTo1.5M")
                        );
                      }}
                    />
                    1,000,000₫ - 1,500,000₫
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={selectedPriceRange.includes("1.5MTo2M")}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setSelectedPriceRange((prev) =>
                          checked
                            ? [...prev, "1.5MTo2M"]
                            : prev.filter((range) => range !== "1.5MTo2M")
                        );
                      }}
                    />
                    1,500,000₫ - 2,000,000₫
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={selectedPriceRange.includes("2Mto5M")}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setSelectedPriceRange((prev) =>
                          checked
                            ? [...prev, "2Mto5M"]
                            : prev.filter((range) => range !== "2Mto5M")
                        );
                      }}
                    />
                    2,000,000₫ - 5,000,000₫
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={selectedPriceRange.includes("above5M")}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setSelectedPriceRange((prev) =>
                          checked
                            ? [...prev, "above5M"]
                            : prev.filter((range) => range !== "above5M")
                        );
                      }}
                    />
                    Trên 5,000,000₫
                  </li>
                </ul>
              </div>

              {/* Bộ lọc Loại gỗ */}
              <div className="filter-group dropdown">
                <h6
                  onClick={() =>
                    document
                      .querySelector(".dropdown-content")
                      .classList.toggle("show")
                  }
                >
                  Loại gỗ
                  <i
                        className="fa-solid fa-caret-down"style={{ color: "#1e1e1e", marginLeft: 12 }}
                      />
                </h6>
                <ul className="dropdown-content">
                  <li>
                    <input
                      type="checkbox"
                      checked={selectedWoodType.includes("gỗ tự nhiên")}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setSelectedWoodType((prev) =>
                          checked
                            ? [...prev, "gỗ tự nhiên"]
                            : prev.filter((type) => type !== "gỗ tự nhiên")
                        );
                      }}
                    />
                    Gỗ tự nhiên
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={selectedWoodType.includes("gỗ công nghiệp")}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setSelectedWoodType((prev) =>
                          checked
                            ? [...prev, "gỗ công nghiệp"]
                            : prev.filter((type) => type !== "gỗ công nghiệp")
                        );
                      }}
                    />
                    Gỗ công nghiệp
                  </li>
                </ul>
              </div>

              <div className="filter-group dropdown">
                <h6 onClick="toggleDropdown()">Kích thước
                <i
                        className="fa-solid fa-caret-down"
                        style={{ color: "#1e1e1e", marginLeft: 12 }}
                      />
                </h6>
                <ul className="dropdown-content">
                  <li>
                    <input type="checkbox" /> Bàn Sofa - Bàn Cafe - Bàn Trà
                  </li>
                  <li>
                    <input type="checkbox" /> Bàn Ăn
                  </li>
                  <li>
                    <input type="checkbox" /> Bộ Bàn Ăn
                  </li>
                  {/* Thêm các mục khác tương tự */}
                </ul>
              </div>
            </div>
          </section>

          {/* Breadcrumb */}
          <div className="breadcrumb">
            <h4>Bộ lọc đang áp dụng:</h4>
            <ul>
              {selectedCategories.length > 0 && (
                <li>
                  Danh mục:{" "}
                  {selectedCategories
                    .map((id) => {
                      const category = uniqueCategories.find(
                        (cat) => cat.id_loaisp === id
                      );
                      return category ? category.loai : null;
                    })
                    .join(", ")}
                </li>
              )}
              {selectedPriceRange.length > 0 && (
                <li>
                  Giá:{" "}{selectedPriceRange
                    .join(", ")
                    .replace(/under500k/g, "Dưới 500,000₫")
                    .replace(/500kTo1M/g, "500,000₫ - 1,000,000₫")
                    .replace(/1MTo1.5M/g, "1,000,000₫ - 1,500,000₫")
                    .replace(/1.5MTo2M/g, "1,500,000₫ - 2,000,000₫")
                    .replace(/2Mto5M/g, "2,000,000₫ - 5,000,000₫")
                    .replace(/above5M/g, "Trên 5,000,000₫")}
                </li>
              )}
              {selectedWoodType.length > 0 && (
                <li>Loại gỗ: {selectedWoodType.join(", ")}</li>
              )}
            </ul>
          </div>

          <div className="index-row-care">
            {paginatedProducts().map((product) => (
              <div key={product.id_sp} className="col-md-6 col-lg-4">
                <div className="index-item">
                  <Link to={`/Propertydetails/${product.id_sp}`}>
                    <img
                      className="index"
                      src={product.hinh}
                      alt={product.ten_sp}
                    />
                  </Link>
                  <span className="index-category">
                    {product.danhmuc.loai || "Danh mục không xác định"}{" "}
                    {/* Hiển thị tên danh mục */}
                  </span>
                  <h4>
                    <Link
                      className="index"
                      to={`/Propertydetails/${product.id_sp}`}
                    >
                      {product.ten_sp}
                    </Link>
                  </h4>
                  <h6 className="index-price">
                    {Number(product.giaSale).toLocaleString()}đ{" "}
                    <span className="index-original-price">
                      {Number(product.gia_sp).toLocaleString()}đ
                    </span>
                  </h6>
                  <ul className="index-ul">
                    <span style={{ color: "#f35525" }} className="index-span">
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

          <div className="row">
            <div className="col-lg-12">
              <ul className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    disabled={currentPage === index + 1}
                  >
                    {index + 1} </button>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Properties;