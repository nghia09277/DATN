import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Article = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu bài viết
    axios.get("https://laravel.ducps34770.id.vn/api/godatviet/article")
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error("Error fetching articles:", error);
      });
  }, []);

  return (
    <div className="container mex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="category">
          <h2>BÀI VIẾT MỚI NHẤT</h2>
          <ul>
            {articles.map((article) => (
              <li key={article.id_bv}>
                <Link to={`/chitietbaiviet/${article.id_bv}`} className="like">
                  {article.tieu_de}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <h1>Truyền thông</h1>
        <div className="post-grid">
          {articles.map((article) => (
            <Link to={`/chitietbaiviet/${article.id_bv}`} key={article.id_bv}>
              <div className="post">
             
                <img  src={article.hinh_bv} alt={article.tieu_de} />
                <div className="post-info">
                  <h3>
                    <Link to={`/chitietbaiviet/${article.id_bv}`}>
                      {article.tieu_de}
                    </Link>
                  </h3>
                  <p>{article.tac_gia}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Article;