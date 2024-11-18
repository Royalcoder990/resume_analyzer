import React from "react";

function MessageDisplay({ messages }) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        if (message.sender === "bot" && typeof message.text === "object") {
          // If the bot's message is a Q&A dictionary, display it in a better format
          return (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">Q&A:</h2>
              {Object.entries(message.text).map(([subtopic, content], idx) => (
                <details key={idx} className="my-3">
                  <summary className="cursor-pointer text-lg font-medium text-blue-600 hover:underline">
                    {subtopic}
                  </summary>
                  <div className="mt-2 space-y-2">
                    {content.split("\n\n").map((qa, qaIdx) => (
                      <div key={qaIdx} className="bg-white p-3 rounded-md shadow">
                        {qa.split("\n").map((line, lineIdx) => (
                          <p key={lineIdx} className="text-gray-700">
                            {line}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          );
        }

        // Regular text messages
        return (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"
            }`}
          >
            {message.text}
          </div>
        );
      })}
    </div>
  );
}

export default MessageDisplay;