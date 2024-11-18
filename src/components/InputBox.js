import React, { useState } from 'react';

function InputBox({ onSendMessage, onSendFile }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    onSendMessage(input);
    setInput('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onSendFile(file);
    }
  };

  return (
    <div className="flex space-x-2">
      <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
      <label htmlFor="fileInput" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
        Upload File
      </label>
    </div>
  );
}

export default InputBox;