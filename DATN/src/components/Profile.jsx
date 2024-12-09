import React, { useState, useEffect } from "react";
import axios from "axios";
// import '../../public/css/profile.css';
export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pass1, setNewPassword] = useState("");
  const [pass2, setConfirmPassword] = useState("");
  const [email, setEmail] = useState(""); // state for email
  const [image, setImage] = useState(null); // state for image

  // Fetch user data when the component is mounted
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.id) {
        fetchUserData(parsedUser.id);
      } else {
        setError("Không tìm thấy thông tin người dùng.");
        setIsLoading(false);
      }
    } else {
      setError("Không tìm thấy thông tin người dùng.");
      setIsLoading(false);
    }
  }, []);

  // Function to fetch user data from the API
  const fetchUserData = async (userId) => {
    const token = sessionStorage.getItem("authToken"); // Get token from sessionStorage

    try {
      const response = await axios.get(
        `https://laravel.ducps34770.id.vn/api/godatviet/infor/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to header
          },
        }
      );
      if (response.status === 200) {
        setUser(response.data.user);
        const emailWithoutDomain = response.data.user.email.split("@")[0];
        setEmail(emailWithoutDomain); // Set email part before @
      } else {
        setError("Không thể tải thông tin người dùng.");
      }
    } catch (err) {
      setError("Không thể tải thông tin người dùng.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      setImage(file);
    } else {
      setError("Vui lòng chọn ảnh định dạng JPG hoặc PNG.");
    }
  };

  // Function to handle the edit button click
  const handleEditClick = () => {
    setIsEditing(true);
    setIsUpdated(false);
  };

  // Function to handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "pass1") {
      setNewPassword(value);
    } else if (id === "pass2") {
      setConfirmPassword(value);
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [id]: value,
      }));
    }
  };

  // Function to handle the update button click
  const handleUpdateClick = async (e) => {
    e.preventDefault();

    if (!user.name) {
      setError("Tên không được để trống.");
      return;
    }

    const updatedData = new FormData();
    updatedData.append("name", user.name || "");
    updatedData.append("address", user.address || "");
    updatedData.append("phone", user.phone || "");
    updatedData.append("pass1", pass1 || "");
    updatedData.append("hinhcu", user.image || ""); // Truyền ảnh cũ nếu không đổi
    if (image) {
      updatedData.append("image", image); // Truyền file ảnh mới
    }

    const token = sessionStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `https://laravel.ducps34770.id.vn/api/godatviet/user_update/${user.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data.user); // Cập nhật thông tin user
        setIsUpdated(true);
        setIsEditing(false); // Quay lại chế độ xem thông tin
      } else {
        setError("Không thể cập nhật thông tin.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi cập nhật.");
      console.error(err);
    }
  };

  // If loading, show a loading message
  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <section className="profile-container mt-5">
      <h1 className="ttcn">Thông tin cá nhân</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {isUpdated && (
        <div className="alert alert-success" role="alert">
          Cập nhật thành công!
        </div>
      )}
      <div className="Profile-row">
        <div className="Profile-col-md-3 profile-section">
          <form id="profileImageForm" encType="multipart/form-data">
            <img
              src={
                user?.image
                  ? user.image
                  : "default-image.jpg"
              }
              alt="Profile Picture"
              className="img-fluid profile-picture"
            />

            <input
              type="file"
              id="profileImageUpload"
              className="form-control mt-3"
              disabled={!isEditing || isUpdated}
              onChange={handleImageChange}
            />
          </form>
          <h2 className="mt-3">{user?.name || "Chưa có tên"}</h2>
        </div>
        <div className="Profile-col-md-9">
          <form className="profile-form">
            <div className="profile-form-group mb-3">
              <label htmlFor="name">Họ tên</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={user?.name || ""}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="profile-form-group col-md-6">
                <label htmlFor="pass1">Mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  id="pass1"
                  name="pass1"
                  placeholder="Nhập mật khẩu mới"
                  readOnly={!isEditing}
                  onChange={handleChange}
                  value={pass1}
                />
              </div>
              <div className="profile-form-group col-md-6">
                <label htmlFor="pass2">Nhập lại mật khẩu mới</label>
                <input
                  type="password"
                  className="form-control"
                  id="pass2"
                  name="pass2"
                  placeholder="Xác nhận mật khẩu mới"
                  readOnly={!isEditing}
                  onChange={handleChange}
                  value={pass2}
                />
              </div>
            </div>
            <div className="row">
              <div className="profile-form-group col-md-6">
                <label>Email *</label>
                <div className="d-flex">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email || ""}
                    readOnly={!isEditing}
                    onChange={handleChange}
                  />
                  <span>@gmail.com</span>
                </div>
              </div>
              <div className="profile-form-group col-md-6">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={user?.address || ""}
                 
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="profile-form-group mb-3">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={user?.phone || ""}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </div>

            {isUpdated }

            <div className="mt-3">
              {isEditing ? (
                <>
                  <button
                    style={{ width: "100px" }}
                    className="btn btn-secondary"
                    onClick={handleUpdateClick}
                  >
                    Cập nhật
                  </button>
                  <button
                    style={{ width: "100px" }}
                    className="btn btn-primarycapnhat ms-2"
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  style={{ width: "100px" }}
                  className="btn btn-primarycapnhat"
                  onClick={handleEditClick}
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
