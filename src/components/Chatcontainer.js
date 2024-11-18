import React, { useState } from "react";
import MessageDisplay from "./MessageDisplay";
import InputBox from "./InputBox";
import axios from "axios";

function ChatContainer() {
    const [messages, setMessages] = useState([]);
    const [skills, setSkills] = useState([]); // Store extracted skills

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
          console.log(response);
          
          // Directly set the skills array without needing map
          if (response.data?.entities?.length) {
              setSkills(response.data.entities); // Just set the array of skills
          } else {
              throw new Error("No entities found in response.");
          }
      } catch (error) {
          setMessages((prevMessages) => [...prevMessages, { text: "Failed to process the file.", sender: "bot" }]);
      }
  };

    // Handles skill button click
    const handleSkillClick = async (skill) => {
        const botMessage = { text: `Generating Q&A for skill: ${skill}`, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        try {
            const response = await axios.post("http://127.0.0.1:5000/generate-qa", { skill });

            if (response.data?.qa) {
                const qaMessage = {
                    text: `Q&A for ${skill}: ${JSON.stringify(response.data.qa, null, 2)}`,
                    sender: "bot",
                };
                setMessages((prevMessages) => [...prevMessages, qaMessage]);
            } else {
                throw new Error("No Q&A generated.");
            }
        } catch (error) {
            setMessages((prevMessages) => [...prevMessages, { text: "Failed to generate Q&A.", sender: "bot" }]);
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

                {/* Skills section */}
                <div className="h-[10%] bg-gray-300 p-4 flex gap-2 overflow-x-auto">
                    {skills.map((skill, index) => (
                        <button
                            key={index}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            onClick={() => handleSkillClick(skill)}
                        >
                            {skill}
                        </button>
                    ))}
                </div>

                {/* Bottom section: Message display */}
                <div className="h-[60%] bg-gray-200 p-4 overflow-auto">
                    <MessageDisplay messages={messages} />
                </div>
            </div>
        </div>
    );
}

export default ChatContainer;