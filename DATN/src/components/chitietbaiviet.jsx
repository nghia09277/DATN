import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import '../../public/css/chitietbaiviet.css';
const Chitietbaiviet = () => {
  const { id_bv } = useParams(); // Lấy id_bv từ URL
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu chi tiết bài viết
    axios.get(`https://laravel.ducps34770.id.vn/api/godatviet/article_ct/${id_bv}`)
      .then(response => {
        setArticle(response.data.article_ct);
        setRelatedArticles(response.data.article_arr);
      })
      .catch(error => {
        console.error("Error fetching article detail:", error);
      });
  }, [id_bv]);

  if (!article) {
    return <div>Loading...</div>; // Hoặc có thể hiển thị một thông báo thích hợp
  }

  return (
    <div className="container max">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="category">
          <h2>BÀI VIẾT MỚI NHẤT</h2>
          <ul>
            {relatedArticles.map((relatedArticle) => (
              <li key={relatedArticle.id_bv}>
                <a href={`/chitietbaiviet/${relatedArticle.id_bv}`}>
                  {relatedArticle.tieu_de}
                </a>
                <br />
                <span className="meta">{relatedArticle.tac_gia}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <img src={article.hinh_bv}alt={article.tieu_de} />
        <h1>{article.tieu_de}</h1>
        <div className="meta">Media - Đăng ngày {article.ngay_dang}</div>
        <p>{article.noi_dung}</p>
        {/* Thêm nội dung khác nếu cần */}
      </div>
    </div>
  );
};

export default Chitietbaiviet;