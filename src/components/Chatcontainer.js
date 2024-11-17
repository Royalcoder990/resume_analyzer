import React, { useState } from "react";
import MessageDisplay from "./MessageDisplay";
import InputBox from "./InputBox";
import axios from "axios";

function ChatContainer() {
  const [messages, setMessages] = useState([]);

  // Handles sending user messages
  const handleSendMessage = (input) => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      generateResponse(input);
    }
  };

  // Handles sending file to the server and processing response
  const handleSendFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Ensure response contains `entities` array
      if (response.data?.entities?.length) {
        const entities = response.data.entities;
        const botMessage = {
          text: `Extracted Skills: ${entities.map((e) => e.text).join(", ")}`,
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        throw new Error("No entities found in response.");
      }
    } catch (error) {
      const botMessage = { text: "Failed to process the file.", sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  // Generates a bot response
  const generateResponse = (userInput) => {
    const botMessage = { text: `Bot response to: "${userInput}"`, sender: "bot" };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  return (
    <div className="flex justify-center items-center w-full h-full bg-gray-100">
      <div className="w-full m-5 max-w-5xl h-[80vh] border rounded-lg shadow-md overflow-hidden">
        {/* Top section: Input box */}
        <div className="h-[17%] bg-white p-4 flex items-center justify-center">
          <InputBox onSendMessage={handleSendMessage} onSendFile={handleSendFile} />
        </div>

        {/* Bottom section: Message display */}
        <div className="h-[80%] bg-gray-200 p-4 overflow-auto">
          <MessageDisplay messages={messages} />
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
