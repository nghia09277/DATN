import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [],
    sort: '',
    search: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState({
    sort: false,
    category: false,
    price: false
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://laravel.ducps34770.id.vn/api/godatviet/shop', {
        params: {
          id_loaisp: filters.category.join(','), // Chuyển đổi mảng thành chuỗi
          action: filters.sort,
          search: filters.search
        }
      });
      setProducts(response.data.data); // Giả sử dữ liệu sản phẩm nằm trong `data`
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFilterChange = (e, filterType) => {
    const value = e.target.value;
    if (filterType === 'category') {
      setFilters(prev => ({
        ...prev,
        category: prev.category.includes(value)
          ? prev.category.filter(item => item !== value)
          : [...prev.category, value]
      }));
    } else if (filterType === 'priceRange') {
      setFilters(prev => ({
        ...prev,
        priceRange: prev.priceRange.includes(value)
          ? prev.priceRange.filter(item => item !== value)
          : [...prev.priceRange, value]
      }));
    } else if (filterType === 'sort') {
      setFilters(prev => ({
        ...prev,
        sort: value
      }));
    } else if (filterType === 'search') {
      setFilters(prev => ({
        ...prev,
        search: value
      }));
    }
  };

  const toggleDropdown = (dropdown) => {
    setDropdownOpen(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  return (
    <div className="section properties">
      <div className="container">
        <section className="filters">
          <div className="moni">
            <h1>Các sản phẩm</h1>
            <div className="filter-group dropdown">
              <h6 onClick={() => toggleDropdown('sort')}>Sắp xếp</h6>
              {dropdownOpen.sort && (
                <ul className="dropdown-content">
                  <li>
                    <input type="radio" name="sort" value="hot" onChange={(e) => handleFilterChange(e, 'sort')} /> Bán chạy nhất
                  </li>
                  <li>
                    <input type="radio" name="sort" value="asc" onChange={(e) => handleFilterChange(e, 'sort')} /> Giá: Tăng dần
                  </li>
                  <li>
                    <input type="radio" name="sort" value="desc" onChange={(e) => handleFilterChange(e, 'sort')} /> Giá: Giảm dần
                  </li>
                  <li>
                    <input type="radio" name="sort" value="new" onChange={(e) => handleFilterChange(e, 'sort')} /> Mới nhất
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div className="menu">
            <div className="filter-group dropdown">
              <h6 onClick={() => toggleDropdown('category')}>Danh Mục</h6>
              {dropdownOpen.category && (
                <ul className="dropdown-content">
                  <li>
                    <input type="checkbox" value="1" onChange={(e) => handleFilterChange(e, 'category')} /> Bàn Sofa
                  </li>
                  <li>
                    <input type="checkbox" value="2" onChange={(e) => handleFilterChange(e, 'category')} /> Bàn Ăn
                  </li>
                  <li>
                    <input type="checkbox" value="3" onChange={(e) => handleFilterChange(e, 'category')} /> Ghế Sofa
                  </li>
                </ul>
              )}
            </div>
            <div className="filter-group dropdown">
              <h6 onClick={() => toggleDropdown('price')}>Giá sản phẩm </h6> {dropdownOpen.price && (
                <ul className="dropdown-content">
                  <li>
                    <input type="checkbox" value="under500000" onChange={(e) => handleFilterChange(e, 'priceRange')} /> Dưới 500,000₫
                  </li>
                  <li>
                    <input type="checkbox" value="500000-1000000" onChange={(e) => handleFilterChange(e, 'priceRange')} /> 500,000₫ - 1,000,000₫
                  </li>
                  <li>
                    <input type="checkbox" value="1000000-1500000" onChange={(e) => handleFilterChange(e, 'priceRange')} /> 1,000,000₫ - 1,500,000₫
                  </li>
                  <li>
                    <input type="checkbox" value="2000000-5000000" onChange={(e) => handleFilterChange(e, 'priceRange')} /> 2,000,000₫ - 5,000,000₫
                  </li>
                  <li>
                    <input type="checkbox" value="above5000000" onChange={(e) => handleFilterChange(e, 'priceRange')} /> Trên 5,000,000₫
                  </li>
                </ul>
              )}
            </div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              onChange={(e) => handleFilterChange(e, 'search')}
            />
          </div>
        </section>
        <div className="index-row-care">
          {products.map(product => (
            <div className="col-lg-4 col-md-6" key={product.id}>
              <div className="index-item">
                <a href={`property-details.html?id=${product.id}`}>
                  <img className="index" src={product.image} alt={product.name} />
                </a>
                <span className="index-category">{product.category}</span> <br />
                <h4>
                  <a className="index" href={`property-details.html?id=${product.id}`}>
                    {product.name}
                  </a>
                </h4>
                <h6 className="index-price">{product.price}đ</h6> <br />
                <ul className="index-ul">
                  <span style={{ color: "#f35525" }} className="index-span">
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <span className="index-sold">Đã bán: ({product.sold})</span>
                  </span> <br />
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-lg-12">
            <ul className="pagination">
              <li>
                <a href="#">
                  <i className="fa fa-angle-left" />
                </a>
              </li>
              <li>
                <a href="#" className="active">1</a>
              </li>
              <li>
                <a href="#">2</a>
              </li>
              <li>
                <a href="#">3</a>
              </li>
              <li>
                <a href="#">
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

export default Shop;