import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logout } from "../Features/User/UserSlice";
import axios from "axios"; // Import axios để gửi yêu cầu API
// import '../../public/css/header.css';
function Header() {
  const [message, setMessage] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State cho tìm kiếm
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    setMessage("Đăng xuất thành công!");
    setTimeout(() => {
      setMessage("");
      navigate("/");
    }, 2000);
  };

  const handleResize = () => {
    if (window.innerWidth >= 767) {
      setMenuVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const shouldShowSearch = () => {
    const hiddenPaths = ["/login", "/article", "/voucher", "/profile","/order"];
    return !hiddenPaths.includes(location.pathname);
  };

  const handleSearch = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    if (searchQuery) {
      try {
        const response = await axios.get(
          "https://laravel.ducps34770.id.vn/api/godatviet/shop",
          {
            params: {
              search: searchQuery,
            },
          }
        );
        // Chuyển hướng đến trang tìm kiếm và truyền kết quả tìm kiếm
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`, {
          state: { products: response.data.data },
        });
        setSearchQuery(""); // Xóa trường tìm kiếm sau khi tìm
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <header className="header-area header-sticky">
      <div className="container new">
        <nav className="main-nav">
          <Link to="/" className="logo">
            <h1>GỖ ĐẤT VIỆT</h1>
          </Link>
          <a
            className="menu-trigger"
            onClick={() => setMenuVisible(!menuVisible)}
          >
            <span>Menu</span>
          </a>

          <ul
            className="nav"
            style={{
              display:
                window.innerWidth < 767 && !menuVisible ? "none" : "flex",
            }}
          >
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/properties">Sản phẩm</Link>
            </li>
            <li>
              <Link to="/article">Bài viết</Link>
            </li>
            <li>
              <Link to="/contact">Phản hồi</Link>
            </li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle">
                <i
                  className="fa-regular fa-user"
                  style={{ fontSize: 30, marginTop: 4 }}
                />
              </a>
              <div className="dropdown-menu">
                {!user ? (
                  <>
                    <Link to="/login">Đăng nhập</Link>
                    <Link to="/register">Đăng ký</Link>
                    <Link to="/tracuu">Tra cứu đơn hàng</Link>
                  </>
                ) : (
                  <>
                    <a>Xin chào, {user.name}</a>
                    <Link to="/profile">Thông tin</Link>
                    <a href="#" onClick={handleLogout}>
                      Đăng xuất
                    </a>
                    <Link to="/wishlist">Sản phẩm yêu thích</Link>
                    <Link to="/order">
                  Xem đơn hàng của tôi
                </Link>
                  </>
                )}
              </div>
            </li>
            {shouldShowSearch() && (
              <li>
                <form
                  className="d-flex search-form"
                  role="search"
                  onSubmit={handleSearch}
                >
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Tìm kiếm sản phẩm..."
                    aria-label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật giá trị tìm kiếm
                  />
                  <button className="btn btn-outline-success" type="submit">
                    <i className="fa fa-search" />
                  </button>
                </form>
              </li>
            )}
            <li>
              <Link to="/cart">
                <i className="fa-solid fa-cart-shopping" /> Giỏ hàng
              </Link>
            </li>
          </ul>
          {message && <div className="alert alert-info alert-center">{message}</div>}

        </nav>
      </div>
    </header>
  );
}

export default Header;
