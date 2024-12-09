import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
// import '../../public/css/detail.css';
const Propertydetails = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState(""); 
  const handleImageClick = (image) => {setMainImage(image); };
  const [commentContent, setCommentContent] = useState("");
  const [rating, setRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [updatedCommentContent, setUpdatedCommentContent] = useState("");
  const [updatedRating, setUpdatedRating] = useState(0);
  const [commentImage, setCommentImage] = useState(null);
  const handleCommentEdit = (comment) => {
    setIsEditing(true);
    setCurrentCommentId(comment.id_bl);
    setUpdatedCommentContent(comment.noiDung);
    setUpdatedRating(comment.danhgia); 
  };



  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `https://laravel.ducps34770.id.vn/api/godatviet/detail/${id}`
        );
        if (response.data.detail) {
          setProduct(response.data.detail);
          setRelatedProducts(response.data.sp_relate || []);
          setMainImage(response.data.detail.hinh);
          setComments(response.data.binhluans || []);
        } else {
          console.error("Không có dữ liệu sản phẩm chi tiết");
        }
      } catch (error) {
        console.error(
          "Error fetching product details:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchProductDetails();
  }, [id]);
  const handleBuyNow = () => {
    if (!product) {
      console.error("Không có sản phẩm để mua ngay.");
      return;
    }
  
    // Tạo một đối tượng sản phẩm để lưu vào giỏ hàng
    const cartItem = {
      id_sp: product.id_sp,
      ten_sp: product.ten_sp,
      gia_sp: product.gia_sp,
      giaSale: product.giaSale,
      hinh: product.hinh,
      quantity: quantity,
      thanhtien: product.giaSale * quantity,
    };
  
    // Lưu sản phẩm vào session storage
    sessionStorage.setItem("cart", JSON.stringify([cartItem]));
  
    // Chuyển hướng đến trang checkout
    window.location.href = "/checkout"; // Thay đổi đường dẫn này nếu cần
  };
  function checkLogin() {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      alert("Bạn cần đăng nhập để thực hiện chức năng này!");
      window.location.href = "/Login";
      return false;
    }
    return true;
  }
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!checkLogin()) return; // Kiểm tra đăng nhập

    const formData = new FormData();
    formData.append("noiDung", commentContent);
    formData.append("danhgia", rating);
    formData.append("id_sp", product.id_sp);
    if (commentImage) {
      formData.append("hinh_bl", commentImage);
    }

    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.post(
        "https://laravel.ducps34770.id.vn/api/godatviet/them_binhluan",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Đặt Content-Type là multipart/form-data
          },
        }
      );

      // Thêm bình luận mới vào danh sách bình luận
      setComments((prevComments) => [
        response.data.binhluan,
        ...prevComments,
      ]);
      setCommentContent(""); // Đặt lại nội dung bình luận
      setRating(0); // Đặt lại đánh giá
      setCommentImage(null); // Đặt lại hình ảnh
    } catch (error) {
      console.error(
        "Lỗi khi thêm bình luận:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleCommentDelete = async (id_bl) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.post(
        `https://laravel.ducps34770.id.vn/api/godatviet/xoa_bl/${id_bl}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Xóa bình luận khỏi danh sách bình luận
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id_bl !== id_bl)
      );
      alert(response.data.message); // Hiển thị thông báo thành công
    } catch (error) {
      console.error(
        "Lỗi khi xóa bình luận:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleCommentUpdate = async (id_bl, updatedContent, updatedRating) => {
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.post(
        `https://laravel.ducps34770.id.vn/api/godatviet/capnhat_binhluan/${id_bl}`,
        {
          noiDung: updatedContent,
          danhgia: updatedRating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Cập nhật bình luận trong danh sách bình luận
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id_bl === id_bl ? response.data.binhluan : comment
        )
      );
      alert(response.data.message); // Hiển thị thông báo thành công
      setIsEditing(false); // Đặt lại trạng thái chỉnh sửa
      setUpdatedCommentContent(""); // Xóa nội dung đã cập nhật
      setUpdatedRating(0); // Đặt lại đánh giá
      setCurrentCommentId(null); // Đặt lại ID bình luận hiện tại
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật bình luận:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const calculateAverageRating = () => {
    if (comments.length === 0) return 0;
    const totalRating = comments.reduce(
      (acc, comment) => acc + parseInt(comment.danhgia),
      0
    );
    return (totalRating / comments.length).toFixed(1); // Làm tròn 1 chữ số
  };
  const averageRating = calculateAverageRating();

  const addToCart = () => {
    if (!product) {
      console.error("Không có sản phẩm để thêm vào giỏ hàng.");
      return;
    }
    let cart = JSON.parse(sessionStorage.getItem("cart"));
    if (!Array.isArray(cart)) {
      cart = [];
    }
    const productIndex = cart.findIndex((item) => item.id_sp === product.id_sp);
    if (productIndex !== -1) {
      cart[productIndex].quantity += quantity;
      cart[productIndex].thanhtien += product.giaSale * quantity;
    } else {
      cart.push({
        id_sp: product.id_sp,
        ten_sp: product.ten_sp,
        gia_sp: product.gia_sp,
        giaSale: product.giaSale,
        hinh: product.hinh,
        quantity: quantity,
        thanhtien: product.giaSale * quantity,
      });
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  };
  const handleAddToWishlist = (product) => {
    if (!checkLogin()) return; // Kiểm tra đăng nhập

    if (!product) {
      console.error("Không có sản phẩm để thêm vào Yêu thích.");
      return;
    }

    // Lấy wishlist từ localStorage
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Kiểm tra xem sản phẩm đã có trong wishlist chưa
    const exists = wishlist.some((item) => item.id_sp === product.id_sp);

    if (exists) {
      // Nếu sản phẩm đã có, xóa nó khỏi wishlist
      wishlist = wishlist.filter((item) => item.id_sp !== product.id_sp);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      alert("Sản phẩm đã được xóa khỏi danh sách yêu thích!");
      window.location.reload();
    } else {
      // Nếu sản phẩm chưa có, thêm vào wishlist
      wishlist.push({
        id_sp: product.id_sp,
        ten_sp: product.ten_sp,
        gia_sp: product.gia_sp,
        giaSale: product.giaSale,
        hinh: product.hinh,
        luot_mua: product.luot_mua, // Thêm trường luot_mua vào wishlist
        loai: product.danhmuc.loai, // Thêm danh mục vào wishlist
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
  if (!product) return <p>Loading...</p>;

  return (
    <>
      <>
        <div className="detail-single-property section">
          <div className="container">
            <div className="row proper">
              <div className="col-lg-8">
                <div className="detail-main-image">
                  <span className="category">{product.danhmuc.loai}</span>
                  <img id="mainImage" src={mainImage} alt={product.ten_sp} />
                </div>
                <div className="detail-main-imagex row">
                  <div className="col-lg-2">
                    <div className="detail-main-images">
                      <img
                        src={product.hinh_1}
                        onClick={() => handleImageClick(product.hinh_1)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="detail-main-images">
                      <img
                        src={product.hinh_2}
                        onClick={() => handleImageClick(product.hinh_2)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" mas">
                <div className="detail-info-table">
                  <ul className="detail-ul">
                    <li>
                      <h4>{product.ten_sp}</h4>
                      <span style={{ color: "#f35525" }}>
                        {/* Hiển thị sao trung bình */}
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`fas fa-star ${
                              index < averageRating ? "filled" : ""
                            }`}
                            style={{
                              color: index < averageRating ? "#f35525" : "#ccc",
                            }}
                          />
                        ))}
                        <span className="sold-detail">
                          Số lượng: ({product.luotXem})
                        </span>
                      </span>
                    </li>
                    <li>
                      <h6 className="detail-price">
                        {new Intl.NumberFormat().format(product.giaSale)}đ{" "}
                        <span className="detail-original-price">
                          {new Intl.NumberFormat().format(product.gia_sp)}đ
                        </span>
                        <i
                        className={`fas fa-heart`}
                        onClick={() => handleAddToWishlist(product)}
                        style={{
                          cursor: "pointer",
                          color: getHeartColor(product.id_sp), 
                          padding: "5px",
                          float: "right",
                        }}
                      ></i>
                      </h6>
                    </li>
                    <li>
                      <h6>Màu sắc: {product.mau_sac}</h6>
                      <div
                        className="color-sample"
                        style={{ backgroundColor: product.mau_sac }}
                      />
                    </li>
                    <li>
                      <h4>
                        Thông tin
                        <br />
                        <span className="chu">
                          <strong>Kích thước:</strong>
                          <br />
                          {product.kich_thuoc}
                          <br />
                          <strong>Chất liệu:</strong>
                          <br />
                          {product.thong_tin}
                        </span>
                      </h4>
                    </li>
                    <li>
                      <div className="detail-quantity-wrapper">
                        <button
                          className="btn btn-decrement"
                          onClick={handleDecrement}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control text-center quantity-input"
                          value={quantity}
                          readOnly
                          min={1}
                        />
                        <button
                          className="btn btn-increment"
                          onClick={handleIncrement}
                        >
                          +
                        </button>
                      </div>
                    </li>
                    <li>
                      <div className="detail-icon-button">
                        <a href="#" onClick={handleBuyNow} >Mua ngay</a>
                        <a
                          href="#"
                          className="add-to-cart"
                          onClick={() => addToCart(product.id_sp)}
                        >
                          THÊM VÀO GIỎ
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>


              {/* MÔ TẢ */}
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Mô tả{" "}
                      <i
                        className="fa-solid fa-caret-down"
                        style={{ color: "#1e1e1e", marginLeft: 12 }}
                      />
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="info-container">
                        <div className="info-left">
                          <p>{product.moTa}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Đánh giá ({comments.length})
                      <i
                        className="fa-solid fa-caret-down"
                        style={{ color: "#1e1e1e", marginLeft: 12 }}
                      />
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse cost"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    {comments.map((comment) => (
                      <ul key={comment.id_bl}>
                        <div className="accordion-body">
                          <div className="review">
                            <strong>- {comment.ten_nd}</strong>
                            <h5>-{product.ten_sp}</h5>
                            <span style={{ color: "#f35525" }}>
                              {/* Hiển thị sao dựa trên giá trị đánh giá */}
                              {[...Array(5)].map((_, index) => (
                                <i
                                  key={index}
                                  className={`fas fa-star ${
                                    index < comment.danhgia ? "filled" : ""
                                  }`}
                                  style={{
                                    color:
                                      index < comment.danhgia
                                        ? "#f35525"
                                        : "#ccc",
                                  }}
                                />
                              ))}
                              {comment.danhgia} {/* Hiển thị số sao */}
                            </span>
                            - Chất lượng sản phẩm
                            <br />
                            <p>{comment.noiDung}</p>
                            {comment.hinh_bl && ( // Kiểm tra nếu có hình ảnh
                              <img
                                src={comment.hinh_bl}
                                alt="Hình ảnh bình luận"
                                style={{ width: "20%" }}
                              />
                            )}
                            <div className="comment-actions lest">
                              <button
                                className="lesx"
                                onClick={() => handleCommentEdit(comment)}
                              >
                                Sửa
                              </button>
                              <button
                                className="lesx"
                                onClick={() =>
                                  handleCommentDelete(comment.id_bl)
                                }
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </ul>
                    ))}
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      Viết đánh giá của bạn{" "}
                      <i
                        className="fa-solid fa-caret-down"
                        style={{ color: "#1e1e1e", marginLeft: 12 }}
                      />
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <form
                        onSubmit={
                          isEditing
                            ? (e) => {
                                e.preventDefault();
                                handleCommentUpdate(
                                  currentCommentId,
                                  updatedCommentContent,
                                  updatedRating
                                );
                              }
                            : handleCommentSubmit
                        }
                      >
                        <div className="mb-3">
                          <label htmlFor="rating" className="form-label">
                            Đánh giá của bạn (từ 1 đến 5 sao)
                          </label>
                          <select
                            className="form-select"
                            id="rating"
                            value={isEditing ? updatedRating : rating}
                            onChange={(e) =>
                              isEditing
                                ? setUpdatedRating(parseInt(e.target.value))
                                : setRating(parseInt(e.target.value))
                            }
                            required
                          >
                            <option value="">Chọn số sao</option>
                            <option value={1}>1 sao</option>
                            <option value={2}>2 sao</option>
                            <option value={3}>3 sao</option>
                            <option value={4}>4 sao</option>
                            <option value={5}>5 sao</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="comment" className="form-label">
                            Nhận xét của bạn
                          </label>
                          <textarea
                            className="form-control"
                            id="comment"
                            rows={3}
                            value={
                              isEditing ? updatedCommentContent : commentContent
                            }
                            onChange={(e) =>
                              isEditing
                                ? setUpdatedCommentContent(e.target.value)
                                : setCommentContent(e.target.value)
                            }
                            placeholder="Nhập nhận xét của bạn"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="commentImage" className="form-label">
                            Tải lên hình ảnh (tùy chọn)
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            id="commentImage"
                            accept="image/*"
                            onChange={(e) => setCommentImage(e.target.files[0])} // Lưu hình ảnh vào state
                          />
                        </div>
                        <button type="submit" className="btn btn-primary">
                          {isEditing ? "Cập nhật " : "Gửi bình luận"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="properties section">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 offset-lg-4 mit">
                <div className="section-heading text-center">
                  <h6>| Sản Phẩm</h6>
                  <h2> Sản phẩm liên quan</h2>
                </div>
              </div>
            </div>

            <div className="index-row-care">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id_sp} className="col-md-6 col-lg-4">
                    <div className="index-item">
                      <Link to={`/Propertydetails/${relatedProduct.id_sp}`}>
                        <img
                          className="index"
                          src={relatedProduct.hinh}
                          alt={relatedProduct.ten_sp}
                        />
                      </Link>
                      <span className="index-category">
                        {relatedProduct.danhmuc.loai}
                      </span>
                      <h4>
                        <Link
                          to={`/Propertydetails/${relatedProduct.id_sp}`}
                          className="index"
                        >
                          {relatedProduct.ten_sp}
                        </Link>
                      </h4>
                      <h6 className="index-price">
                        {Number(relatedProduct.giaSale).toLocaleString()}đ{" "}
                        <span className="index-original-price">
                          {Number(relatedProduct.gia_sp).toLocaleString()}đ
                        </span>
                      </h6>
                      <ul className="index-ul">
                        <span
                          style={{ color: "#f35525" }}
                          className="index-span"
                        >
                          {[...Array(5)].map((_, index) => (
                            <i
                              key={index}
                              className={`fas fa-star ${
                                index < 5 ? "filled" : ""
                              }`}
                              style={{
                                color: index < 5 ? "#f35525" : "#ccc",
                              }}
                            />
                          ))}
                          <span className="index-sold">
                            Đã bán: {relatedProduct.luot_mua}
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

export default Propertydetails;
