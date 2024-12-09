// import '../../public/css/footer.css';


const Footer = () => {
    return (
      <footer className="footer-bg-dark" id="tempaltemo_footer">
      <div className="container footer-app">
        <div className="footer-row">
          <div className="col-md-4 pt-5">
            <h2 className="h2 footer-text-success footer-border-bottom footer-pb-3 footer-border-light footer-logo">
              GỖ ĐẤT VIỆT
            </h2>
            <ul className="list-unstyled text-light footer-link-list">
              <li>
                <i className="fas fa-map-marker-alt fa-fw" />
                123 Đường Gỗ Tự Nhiên, Thành phố ABC, Mã bưu điện 10660
              </li>
              <li>
                <i className="fa fa-phone fa-fw" />
                <a className="text-decoration-none footer " href="tel:010-020-0340">
                  010-020-0340
                </a>
              </li>
              <li>
                <i className="fa fa-envelope fa-fw" />
                <a
                  className="text-decoration-none footer"
                  href="mailto:info@noithatgo.com"
                >
                  info@noithatgo.com
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4 pt-5">
            <h2 className="h2 footer-text-light border-bottom pb-3 border-light">
              Sản phẩm
            </h2>
            <ul className="list-unstyled footer-text-light footer-link-list">
              <li>
                <a className="text-decoration-none footer" href="#">
                  Bàn ghế gỗ cao cấp
                </a>
              </li>
              <li>
                <a className="text-decoration-none footer" href="#">
                  Tủ quần áo gỗ
                </a>
              </li>
              <li>
                <a className="text-decoration-none footer" href="#">
                  Giường ngủ gỗ
                </a>
              </li>
              <li>
                <a className="text-decoration-none footer" href="#">
                  Kệ gỗ trang trí
                </a>
              </li>
              <li>
                <a className="text-decoration-none footer" href="#">
                  Bàn ăn gỗ
                </a>
              </li>
              <li>
                <a className="text-decoration-none footer" href="#">
                  Tủ bếp gỗ
                </a>
              </li>
              <li>
                <a className="text-decoration-none footer" href="#">
                  Đồ nội thất khác
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4 pt-5">
            <h2 className="h2 footer-text-light border-bottom pb-3 border-light">
              Thông tin thêm
            </h2>
            <ul className="list-unstyled text-light footer-link-list">
              <li>
                <a className="text-decoration-none footer" href="#">
                  Trang chủ
                </a>
              </li>
              <li>
                <a className="text-decoration-none footer" href="#">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a className="text-decoration-none footer" href="#">
                  Địa chỉ cửa hàng
                </a>
              </li>
              <li>
                <a className="text-decoration-none footer" href="#">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a className="text-decoration-none footer" href="#">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row text-light mb-4">
          <div className="col-12 mb-3">
            <div className="w-100 my-3 border-top border-light" />
          </div>
          <div className="col-auto me-auto">
            <ul className="list-inline text-left footer-icons">
              <li className="list-inline-item border border-light rounded-circle text-center">
                <a
                  className="text-light text-decoration-none footer"
                  target="_blank"
                  href="http://facebook.com/"
                >
                  <i className="fab fa-facebook-f fa-lg fa-fw" />
                </a>
              </li>
              <li className="list-inline-item border border-light rounded-circle text-center">
                <a
                  className="text-light text-decoration-none footer"
                  target="_blank"
                  href="https://www.instagram.com/"
                >
                  <i className="fab fa-instagram fa-lg fa-fw" />
                </a>
              </li>
              <li className="list-inline-item border border-light rounded-circle text-center">
                <a
                  className="text-light text-decoration-none footer"
                  target="_blank"
                  href="https://twitter.com/"
                >
                  <i className="fab fa-twitter fa-lg fa-fw" />
                </a>
              </li>
              <li className="list-inline-item border border-light rounded-circle text-center">
                <a
                  className="text-light text-decoration-none footer"
                  target="_blank"
                  href="https://www.linkedin.com/"
                >
                  <i className="fab fa-linkedin fa-lg fa-fw" />
                </a>
              </li>
            </ul>
          </div>
          <div className="col-auto">
            <label className="sr-only" htmlFor="subscribeEmail">
              Địa chỉ email
            </label>
          </div>
        </div>
      </div>
    </footer>
    
    );
  };
  
  export default Footer;