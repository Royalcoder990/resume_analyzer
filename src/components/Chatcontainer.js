// src/components/ChatContainer.js
import React, { useState } from 'react';
import MessageDisplay from './MessageDisplay';
import InputBox from './InputBox';

function ChatContainer() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (input) => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      generateResponse(input);
    }
  };

  const handleSendFile = (file) => {
    const fileMessage = { file, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, fileMessage]);
    // Add logic to send file to backend if needed
  };

  const generateResponse = (userInput) => {
    const botMessage = { text: `Bot response to: "${userInput}"`, sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  return (
    <div className="flex justify-center items-center justify-center w-full h-full bg-gray-100">
      <div className="w-full m-5 max-w-5xl h-[80vh] border rounded-lg shadow-md overflow-hidden">
        
        {/* Top section - White background, 20% height, including attachment and send box */}
        <div className="h-[17%] bg-white p-4 flex items-center justify-center">
          <InputBox onSendMessage={handleSendMessage} onSendFile={handleSendFile} />
        </div>
        
        {/* Bottom section - Gray background, 80% height, for messages display */}
        <div className="h-[80%] bg-gray-200 p-4 overflow-auto flex items-center space-x-2 justify-center">
  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">JAVA</button>
  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">C++</button>
  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">C</button>
  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">PYTHON</button>
  
  <MessageDisplay messages={messages} />
</div>

        
      </div>
    </div>
  );
}

export default ChatContainer;
