import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'; // Import PropTypes

const CommentForm = ({ productId }) => {
  const [comment, setComment] = useState({
    noidung: '',
    danhgia: 1,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post("https://laravel.ducps34770.id.vn/api/godatviet/users/them", {
        id_sp: productId,
        noidung: comment.noidung,
        danhgia: comment.danhgia,
      }, {
        headers: {
          'Content-Type': 'application/json',
          // Thêm token nếu cần thiết
          // 'Authorization': `Bearer ${token}`,
        },
      });

      setSuccess(response.data.message);
      setComment({ noidung: '', danhgia: 1 }); // Reset form
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Có lỗi xảy ra.');
      } else {
        setError('Có lỗi xảy ra.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="noidung">Nội dung:</label>
          <textarea
            id="noidung"
            name="noidung"
            value={comment.noidung}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="danhgia">Đánh giá:</label>
          <select
            id="danhgia"
            name="danhgia"
            value={comment.danhgia}
            onChange={handleChange}
            required
          >
            <option value={1}>1 sao</option>
            <option value={2}>2 sao</option>
            <option value={3}>3 sao</option>
            <option value={4}>4 sao</option>
            <option value={5}>5 sao</option>
          </select>
        </div>
        <button type="submit">Gửi bình luận</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

// Định nghĩa kiểu cho props
CommentForm.propTypes = {
  productId: PropTypes.number.isRequired, // productId là một số và là bắt buộc
};

export default CommentForm;