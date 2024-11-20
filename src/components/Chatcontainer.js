import React, { useState } from "react";
import MessageDisplay from "./MessageDisplay";
import InputBox from "./InputBox";
import axios from "axios";
function ChatContainer() {
    const [messages, setMessages] = useState([]);
    const [skills, setSkills] = useState([]); 
    const handleSendMessage = (input) => {
        if (input.trim()) {
            const userMessage = { text: input, sender: "user" };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            generateResponse(input);
        }
    };
    const handleSendFile = async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      try {
          const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
          });
          console.log(response);
          if (response.data?.entities?.length) {
              setSkills(response.data.entities); 
          } else {
              throw new Error("No entities found in response.");
          }
      } catch (error) {
          setMessages((prevMessages) => [...prevMessages, { text: "Failed to process the file.", sender: "bot" }]);
      }
  };
const handleSkillClick = async (skill) => {
  const botMessage = { text: `Generating Q&A for skill: ${skill}`, sender: "bot" };
  setMessages((prevMessages) => [...prevMessages, botMessage]);
  try {
      const response = await axios.post("http://127.0.0.1:5000/generate-qa", { skill });
      if (response.data?.qa) {
          const qaData = response.data.qa;
          for (const [subtopic, qaContent] of Object.entries(qaData)) {
              setMessages((prevMessages) => [
                  ...prevMessages,
                  { text: `Subtopic: ${subtopic}`, sender: "bot" },
              ]);
              setMessages((prevMessages) => [
                  ...prevMessages,
                  { text: `Q&A:\n${qaContent}`, sender: "bot" },
              ]);
          }
      } else {
          throw new Error("No Q&A generated.");
      }
  } catch (error) {
      setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Failed to generate Q&A for skill: ${skill}`, sender: "bot" },
      ]);
  }
};

    const generateResponse = (userInput) => {
        const botMessage = { text: `Bot response to: "${userInput}"`, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
    };

    return (
        <div className="flex justify-center items-center w-full h-full bg-gray-100">
            <div className="w-full m-5 max-w-5xl h-[80vh] border rounded-lg shadow-md overflow-hidden">
                <div className="h-[17%] bg-white p-4 flex items-center justify-center">
                    <InputBox onSendMessage={handleSendMessage} onSendFile={handleSendFile} />
                </div>


                <div className="h-[15%] bg-gray-300 p-4 flex gap-2 overflow-x-auto">
                  {skills.map((skill, index) => (
                    <button
                      key={index}
                      className="h-12 w-32 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center"
                      onClick={() => handleSkillClick(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                <div className="h-[70%] bg-gray-200 p-4 overflow-auto">
                    <MessageDisplay messages={messages} />
                </div>
            </div>
        </div>
    );
}

export default ChatContainer;