import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const AddUsers = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: ""
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (formData.Password !== formData.ConfirmPassword) {
        setPasswordMatchError("Passwords do not match");
        return;
      }
      setPasswordMatchError("");

      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

      const newUser = await response.json(); // Get the created user from the response
      console.log("New user inserted successfully", newUser);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error inserting new user:", error.message);
      setError(error.message);
    }
  };
  
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setError("");
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg w-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-black">สร้างข้อมูลผู้ใช้</h3>
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">ชื่อผู้ใช้</label>
              <input
                type="text"
                id="name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="w-full text-gray-800 rounded-md p-2 border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">อีเมล</label>
              <input
                type="email"
                id="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                className="w-full text-gray-800 rounded-md p-2 border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">รหัสผ่าน</label>
              <input
                type="password"
                id="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                className="w-full text-gray-800 rounded-md p-2 border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                id="confirmPassword"
                name="ConfirmPassword"
                value={formData.ConfirmPassword}
                onChange={handleChange}
                className="w-full text-gray-800 rounded-md p-2 border border-gray-300"
                required
              />
              {passwordMatchError && <p className="text-red-500">{passwordMatchError}</p>}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                สร้าง
              </button>
              <button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-md flex flex-col items-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-5xl text-green-500 mb-4"
            />
            <h2 className="text-2xl font-bold text-black mb-4">สำเร็จ</h2>
            <p className="text-lg text-black">เพิ่มข้อมูลผู้ใช้สำเร็จ</p>
            {/* แสดงข้อมูลที่เพิ่มไป */}
            <div className="text-left mt-4">
              <p className="font-bold">ชื่อผู้ใช้: {formData.Name}</p>
              <p className="font-bold">อีเมล: {formData.Email}</p>
              {/* ตัวอย่างเพิ่มข้อมูลเพิ่มเติมที่คุณต้องการแสดง */}
            </div>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-md flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาดในการสร้างข้อมูล</h2>
            <p className="text-lg text-black">{error}</p>
            <button
              onClick={() => setError("")}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUsers;
