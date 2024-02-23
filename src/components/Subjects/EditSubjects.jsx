import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const EditSubjects = ({ subject, onClose }) => {
  const [editedSubject, setEditedSubject] = useState(subject);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSubject({
      ...editedSubject,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/subjects/${editedSubject.ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedSubject),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedSubject = await response.json();
      console.log("Updated subject data:", updatedSubject);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating subject:", error.message);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  useEffect(() => {
    // Set initial state based on prop subject
    setEditedSubject(subject);
  }, [subject]);

  return (
    <div>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg w-[400px]">
          <h3 className="text-lg font-semibold mb-4 text-black">แก้ไขข้อมูลวิชา</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">ชื่อวิชา</label>
              <input
                type="text"
                id="name"
                name="Name"
                value={editedSubject.Name}
                onChange={handleChange}
                className="border border-gray-800 rounded-md px-4 py-2 w-full text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">คำอธิบาย</label>
              <input
                type="text"
                id="description"
                name="Description"
                value={editedSubject.Description}
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

export default EditSubjects;
