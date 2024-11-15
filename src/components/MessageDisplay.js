import React from 'react';

function MessageDisplay({ messages }) {
  return (
    <div>
      {messages.map((message, index) => (
        <div 
          key={index}
          className={`p-2 rounded-lg mb-2 max-w-xs ${
            message.sender === 'user' ? 'self-end bg-blue-500 text-white' : 'self-start bg-gray-300 text-black'
          }`}
        >
          {message.text}
          <div  className="flex flex-col flex-grow p-4 overflow-y-auto bg-gray-50"></div>
        </div>
      ))}
    </div>
  );
}

export default MessageDisplay;
