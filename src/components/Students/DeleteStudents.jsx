import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const DeleteStudents = ({ onClose, studentID }) => {
  const [student, setStudent] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/students/${studentID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student:", error.message);
      }
    };
    fetchStudent();
  }, [studentID]);

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/students/${studentID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Student deleted successfully");
      setIsDeleted(true);
      // onClose(); // Close the modal after confirming deletion
    } catch (error) {
      console.error("Error deleting student:", error.message);
    }
  };

  const handleOKClick = () => {
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 rounded-md flex flex-col items-center">
        {isDeleted ? (
          <>
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-5xl text-green-500 mb-4"
            />
            <h2 className="text-2xl font-bold mb-4 text-black">ลบแล้ว!</h2>
            <p className="text-lg text-black">นักเรียนถูกลบเรียบร้อยแล้ว</p>
            <button
              onClick={handleOKClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              ตกลง
            </button>
          </>
        ) : (
          <>
            {student && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-black">{`${student.FirstName} ${student.LastName}`}</h2>
                <p className="text-lg mb-4 text-black">{`อายุ: ${student.Age}`}</p>
              </>
            )}
            <p className="text-lg mb-4 text-black">
              คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนคนนี้?
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                ยืนยัน
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                ยกเลิก
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteStudents;
