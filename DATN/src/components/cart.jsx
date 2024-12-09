import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";


const Cart = () => {

const [cartItems, setCartItems] = useState([]);

const [selectedVouchers, setSelectedVouchers] = useState({ vouchers: [] });


// Tính tổng giá trị của giỏ hàng

const originalTotal = cartItems.reduce(

(sum, item) => sum + item.giaSale * item.quantity,

0

);


// Tính tổng phần trăm giảm giá từ các voucher

// Tính tổng phần trăm hoặc số tiền giảm từ các voucher

// Tính tổng giảm giá từ các voucher

const totalDiscountAmount = Array.isArray(selectedVouchers.vouchers)

? selectedVouchers.vouchers.reduce((sum, voucher) => {

if (voucher.so_tien_giam.includes("%")) {

// Tính giảm giá theo phần trăm

const percent = parseFloat(voucher.so_tien_giam.replace("%", ""));

return sum + (originalTotal * percent) / 100;

} else {

// Tính giảm giá cố định

return sum + parseFloat(voucher.so_tien_giam);

}

}, 0)

: 0;


// Tổng cộng sau khi áp dụng giảm giá

const tongtien = originalTotal - totalDiscountAmount;


useEffect(() => {

const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];

setCartItems(storedCart);


// Lấy danh sách voucher đã chọn từ sessionStorage

const storedVouchers =

JSON.parse(sessionStorage.getItem("selectedVouchers")) || {

vouchers: [],

};

setSelectedVouchers(storedVouchers);

}, []);


useEffect(() => {

sessionStorage.setItem("tongtien", tongtien);

}, [tongtien]);


const handleQuantityChange = (id, delta) => {

setCartItems((prevItems) => {

const updatedItems = prevItems.map((item) =>

item.id_sp === id

? { ...item, quantity: Math.max(1, item.quantity + delta) }

: item

);

sessionStorage.setItem("cart", JSON.stringify(updatedItems));

return updatedItems;

});

};


const handleDeleteItem = (id) => {

const updatedItems = cartItems.filter((item) => item.id_sp !== id);

setCartItems(updatedItems);

sessionStorage.setItem("cart", JSON.stringify(updatedItems));

};


return (

<section className="container mt-5">

<h2 className="cart-mb-4">

Có <span className="fw-bold">{cartItems.length} sản phẩm</span> trong giỏ hàng

</h2>


<div className="row">

<div className="col-lg-8 col-md-12">

{cartItems.map((item) => (

<div

key={item.id_sp}

className="cart-item d-flex align-items-center border-bottom py-3"

>

<div

className="product-info d-flex align-items-center"

style={{ flex: 2 }}

>

<img

src={item.hinh}

className="img-fluid"

style={{ width: 100 }}

alt="Sản phẩm"

/>

<div className="ms-3">

<h5>{item.ten_sp}</h5>

<p className="text-muted">

<del>{item.gia_sp.toLocaleString()}đ</del>{" "}

<span

className="fw-bold mt-5"

style={{ color: "#e74c3c" }}

>

{item.giaSale.toLocaleString()}đ

</span>

</p>

</div>

</div>

<div

className="quantity-control d-flex mx-5"

style={{ flex: 1 }}

>

<button

className="btn btn-outline-secondary btn-minus"

onClick={() => handleQuantityChange(item.id_sp, -1)}

>

<i className="fa fa-minus" />

</button>

<input

type="text"

className="form-control quantity-input text-center mx-2"

value={item.quantity}

readOnly

/>

<button

className="btn btn-outline-secondary btn-plus"

onClick={() => handleQuantityChange(item.id_sp, 1)}

>

<i className="fa fa-plus" />

</button>

</div>

<div

className="product-total fw-bold"

style={{ flex: 1, color: "#333" }}

>

<span className="total-label">Thành tiền:</span>{" "}

<span>

{(item.giaSale * item.quantity).toLocaleString()}đ

</span>

</div>

<button

className="btn btn-danger delete-btn"

onClick={() => handleDeleteItem(item.id_sp)}

>

<i className="fa fa-trash" />

</button>

</div>

))}

</div>


{cartItems.length > 0 && (

<div className="col-lg-4 col-md-12 cart-total-voucher">

<div className="border p-3 bg-light">

<h4>Áp dụng mã giảm giá</h4>

<form id="voucher-form" className="d-flex justify-content-between mb-3">

<input

type="text"

className="form-control me-2 mt-3"

id="voucher-input"

value={

selectedVouchers.vouchers.length > 0

? "Áp dụng voucher thành công!" // Hiển thị "Áp dụng thành công" khi có voucher

: "Muốn giảm giá? Hãy chọn voucher" // Hiển thị khi không có voucher

}

readOnly

placeholder="Nhập mã voucher"

/>


</form>

<Link to="/VoucherPage" className="btn btn-success w-100 mt-3">

Chọn từ kho voucher

</Link>


<ul className="list-unstyled mt-3">

<li className="d-flex justify-content-between">

<span>Tổng phụ:</span>

<span id="subtotal">{originalTotal.toLocaleString()}đ</span>

</li>

<li className="d-flex justify-content-between">

<span>Giảm giá:</span>

<span id="discount">

{totalDiscountAmount.toLocaleString()} VND

</span>

</li>


<li className="d-flex justify-content-between fw-bold">

<span>Tổng cộng:</span>

<span id="total" style={{ fontSize: "1.2em" }}>

{tongtien.toLocaleString()}đ</span>

</li>

</ul>

<Link to="/checkout" className="btn btn-success w-100 mt-3">

Thanh toán

</Link>

{cartItems.length > 0 && (

<Link to="/order" className="btn btn-info w-100 mt-3">

Xem đơn hàng của tôi

</Link>

)}

</div>

</div>

)}

</div>

</section>

);

};


export default Cart;