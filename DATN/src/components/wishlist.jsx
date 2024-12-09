import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";


const Wishlist = () => {

const [products, setProducts] = useState([]);

const [loading, setLoading] = useState(true);

const [error, setError] = useState(null);

const [currentPage, setCurrentPage] = useState(1);

const productsPerPage = 6;

// const products = location.state?.products || [];

// Lấy dữ liệu sản phẩm từ localStorage

useEffect(() => {

const fetchWishlist = () => {

const savedWishlist = JSON.parse(localStorage.getItem("wishlist"));

if (savedWishlist && Array.isArray(savedWishlist)) {

setProducts(savedWishlist); // Cập nhật sản phẩm từ localStorage

setLoading(false); // Đặt trạng thái loading là false khi hoàn thành

} else {

setError("No products found in wishlist.");

setLoading(false); // Đặt trạng thái loading là false nếu không có dữ liệu

}

};


fetchWishlist(); // Gọi hàm fetchWishlist khi component được mount

}, []);


// Phân trang

const paginatedProducts = () => {

const startIndex = (currentPage - 1) * productsPerPage;

return products.slice(startIndex, startIndex + productsPerPage);

};


const totalPages = Math.ceil(products.length / productsPerPage);


const handlePageChange = (page) => {

setCurrentPage(page);

};


if (loading) return <div>Loading...</div>;

if (error) return <div>Error: {error}</div>;


const handleAddToWishlist = ( products) => {

if (!products) {

console.error("Không có sản phẩm để thêm vào Yêu thích.");

return;

}


// Lấy wishlist từ localStorage

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];


// Kiểm tra xem sản phẩm đã có trong wishlist chưa

const exists = wishlist.some((item) => item.id_sp === products.id_sp);


if (exists) {

// Nếu sản phẩm đã có, xóa nó khỏi wishlist

wishlist = wishlist.filter((item) => item.id_sp !== products.id_sp);

localStorage.setItem("wishlist", JSON.stringify(wishlist));

alert("Sản phẩm đã được xóa khỏi danh sách yêu thích!");

window.location.reload();

} else {

// Nếu sản phẩm chưa có, thêm vào wishlist

wishlist.push({

id_sp: products.id_sp,

ten_sp: products.ten_sp,

gia_sp: products.gia_sp,

giaSale: products.giaSale,

hinh: products.hinh,

luot_mua: products.luot_mua, // Thêm trường luot_mua vào wishlist

loai: products.danhmuc.loai, // Thêm danh mục vào wishlist

});

localStorage.setItem("wishlist", JSON.stringify(wishlist));

alert("Sản phẩm đã được thêm vào danh sách yêu thích!");

window.location.reload();

}

};



const getHeartColor = (id_sp) => {

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const existsInWishlist = wishlist.some(item => item.id_sp === id_sp);

return existsInWishlist ? '#f35525' : 'silver'; // Trả về màu đỏ khi có trong wishlist, bạc khi không

};


return (

<div className="section properties">

<div className="container">

<h5 className="wiss">Các sản phẩm yêu thích của bạn: {products.length}</h5>

<div className="index-row-care">

{paginatedProducts().map((product) => (

<div key={product.id_sp} className="col-md-6 col-lg-4">

<div className="index-item">

<Link to={`/Propertydetails/${product.id_sp}`}>

<img className="index" src={product.hinh} alt={product.ten_sp} />

</Link>

<span className="index-category">

{product.loai || "Danh mục không xác định"}{" "}

</span>

<h4>

<Link className="index" to={`/Propertydetails/${product.id_sp}`}>

{product.ten_sp}

</Link>

</h4>

<h6 className="index-price">

{Number(product.giaSale).toLocaleString()}đ{" "}

<span className="index-original-price">

{Number(product.gia_sp).toLocaleString()}đ

</span>

</h6>


<i

className="fas fa-heart"

onClick={() => handleAddToWishlist(product)}

style={{

cursor: "pointer",

color: getHeartColor(product.id_sp),

padding: "5px",

float: "right", // Đẩy thẻ i sang phải

}}

></i>

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

{index + 1}

</button>

))}

</ul>

</div>

</div>

</div>

</div>

);

};


export default Wishlist;