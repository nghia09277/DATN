document.addEventListener('DOMContentLoaded', function() {
  // Hàm để kiểm tra và hiển thị thông tin thanh toán thẻ tín dụng
  function toggleCreditCardInfo() {
      var creditCardInfo = document.getElementById('creditCardInfo');
      var creditCard = document.getElementById('creditCard');

      if (creditCard && creditCard.checked) {
          creditCardInfo.style.display = 'block';
      } else if (creditCardInfo) {
          creditCardInfo.style.display = 'none';
      }
  }

  // Kiểm tra phương thức thanh toán khi trang được tải
  toggleCreditCardInfo();

  // Thay đổi sự kiện khi phương thức thanh toán thay đổi
  var paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
  paymentMethods.forEach(function(method) {
      method.addEventListener('change', toggleCreditCardInfo);
  });
});
