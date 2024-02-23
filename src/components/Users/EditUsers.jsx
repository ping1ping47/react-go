import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const EditUsers = ({ user, onClose }) => { // เปลี่ยนชื่อ EditSubjects เป็น EditUsers
  const [editedUser, setEditedUser] = useState(user); // เปลี่ยนชื่อ editedSubject เป็น editedUser
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ // เปลี่ยนชื่อ editedSubject เป็น editedUser
      ...editedUser,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/users/${editedUser.ID}`, // เปลี่ยน URL ให้เรียกข้อมูลผู้ใช้
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUser),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedUser = await response.json(); // เปลี่ยน updatedSubject เป็น updatedUser
      console.log("Updated user data:", updatedUser);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  useEffect(() => {
    // Set initial state based on prop user
    setEditedUser(user);
  }, [user]);

  return (
    <div>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg w-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-black">แก้ไขข้อมูลผู้ใช้</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label className="block text-sm font-medium text-black">ชื่อผู้ใช้</label>
<input
  type="text"
  id="name"
  name="Name"
  value={editedUser.Name}
  onChange={handleChange}
  className="border border-gray-800 rounded-md px-4 py-2 w-full text-black"
  required
/>
            </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-black">อีเมล</label>
                <input
                    type="email"
                    id="email"
                    name="Email"
                    value={editedUser.Email}
                    onChange={handleChange}
                className="border border-gray-800 rounded-md px-4 py-2 w-full text-black"
            required
/>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-gray-800 px-4 py-2 rounded-md"
              >
                บันทึกการเปลี่ยนแปลง
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-700 text-gray-800 px-4 py-2 rounded-md"
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
            <h2 className="text-2xl font-bold mb-4 text-black">สำเร็จแล้ว!</h2>
            <p className="text-lg text-black">ข้อมูลได้ถูกอัปเดตเรียบร้อยแล้ว</p>
            <button
              onClick={handleCloseModal}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditUsers; // เปลี่ยนชื่อ EditSubjects เป็น EditUsers และสร้าง props สำหรับรับข้อมูลผู้ใช้แทนข้อมูลวิชา
