import React from 'react';
import Card from './App1'; // นำเข้าคอมโพเนนต์ Card

const App1 = () => {
  return (
    <div className="App">
      <h1>My React App</h1>
      <Card /> {/* เรียกใช้งานคอมโพเนนต์ Card */}
    </div>
  );
}

export default App1;
