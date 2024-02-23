import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const AddStudents = ({ onClose }) => {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Age: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "Age" ? parseInt(value) : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create student");
      }

      console.log("New student inserted successfully");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error inserting new student:", error.message);
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
          <h3 className="text-lg font-semibold mb-4 text-black">สร้างข้อมูลนักเรียน</h3>
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">ชื่อจริง</label>
              <input
                type="text"
                id="firstName"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                className="w-full text-gray-800 rounded-md p-2 border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">นามสกุล</label>
              <input
                type="text"
                id="lastName"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                className="w-full text-gray-800 rounded-md p-2 border border-gray-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">อายุ</label>
              <input
                type="number"
                id="age"
                name="Age"
                value={formData.Age}
                onChange={handleChange}
                className="w-full text-gray-800 rounded-md p-2 border border-gray-300"
                required
              />
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
            <p className="text-lg text-black">เพิ่มข้อมูลนักเรียนสำเร็จ</p>
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
            <h2 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาดในการเพิ่มข้อมูล</h2>
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

export default AddStudents;
