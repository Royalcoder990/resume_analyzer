import React, { useState } from 'react';

function InputBox({ onSendMessage, onSendFile }) {
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
    if (file) {
      onSendFile(file);
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="flex items-center justify-center p-3 border-t space-x-2">
      
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="p-2 bg-white-200 rounded-xl cursor-pointer hover:bg-gray-300"
        style={{ fontSize: '1.8rem', padding: '0.5rem' }}
      >
        📎
      </label>
      <button
        onClick={handleSend}
        className="p-2 bg-blue-600 text-white margin-left rounded-lg hover:bg-blue-700 transition"
        style={{ fontSize: '1.3rem', padding: '0.5rem' }}
      >
        Send
      </button>
    </div>
  );
}

export default InputBox;
