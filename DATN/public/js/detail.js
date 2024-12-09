  // Lấy tất cả các ảnh trong main-imagex
  const thumbnails = document.querySelectorAll('.main-imagex .main-images img');

  // Lấy ảnh chính
  const mainImage = document.getElementById('mainImage');

  // Thêm sự kiện click vào mỗi ảnh thumbnail
  thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
          // Cập nhật src của ảnh chính khi click vào ảnh thumbnail
          mainImage.src = thumbnail.src;
      });
  });


  //tăng số lượng sản phẩm
  document.querySelector('.btn-decrement').addEventListener('click', function() {
    const input = document.querySelector('.quantity-input');
    let value = parseInt(input.value);
    if (value > 1) {
        input.value = value - 1;
    }
});

document.querySelector('.btn-increment').addEventListener('click', function() {
    const input = document.querySelector('.quantity-input');
    let value = parseInt(input.value);
    input.value = value + 1;
});