import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import './chatAgent.css';
import { RiRobot3Fill } from "react-icons/ri";
import { GiRobotAntennas } from "react-icons/gi";

function ChatAgent() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [responses, setResponses] = useState({});
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Load responses from Excel file
        fetch('/ChatAgentResponses.xlsx')
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                const workbook = XLSX.read(buffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet);

                // Normalize questions as keys in lowercase, trimmed format
                const responseMapping = {};
                data.forEach((row) => {
                    if (row.Question && row.Answer) {
                        const normalizedQuestion = row.Question.trim().toLowerCase();
                        responseMapping[normalizedQuestion] = row.Answer;
                    }
                });
                setResponses(responseMapping);
            })
            .catch((error) => {
                console.error("Error loading Excel file:", error);
                setResponses({});
            });
    }, []);

    useEffect(() => {
        // Scroll to the bottom whenever the messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { sender: 'user', text: input }]);

            // Normalize user input to check against the responses
            const normalizedInput = input.trim().toLowerCase();
            let answer = findBestMatch(normalizedInput); // Find the best match based on the input

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'chat-agent', text: answer },
            ]);
            setInput('');
            // Scroll to the bottom after adding the message
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Function to find the best matching answer based on the user's input
    const findBestMatch = (userInput) => {
        let bestMatch = "Sorry, I don't have an answer for that. Please ask Riley for further help.";
        let maxMatchCount = 0;

        // Loop through all the stored questions in the responses
        for (const question in responses) {
            const wordsInQuestion = question.split(' ').map(word => word.toLowerCase());
            const wordsInUserInput = userInput.split(' ').map(word => word.toLowerCase());

            let matchCount = 0;
            wordsInUserInput.forEach((word) => {
                if (wordsInQuestion.includes(word)) {
                    matchCount++;
                }
            });

            // If we find a better match, update the best match
            if (matchCount > maxMatchCount) {
                maxMatchCount = matchCount;
                bestMatch = responses[question];
            }
        }

        return bestMatch;
    };

    const handleCloseChat = () => {
        // Reset messages and input when chat is closed
        setMessages([]);
        setInput('');
        setIsOpen(false);
    };

    return (
        <div className="chat-agent-container">
            {isOpen ? (
                <div className="chat-agent">
                    <div className="chat-header">
                        <RiRobot3Fill />
                        <button onClick={handleCloseChat} className="close-button">×</button>
                    </div>
                    <div className="chat-body">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-footer">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask a question..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setIsOpen(true)} className="chat-toggle-button">
                    <GiRobotAntennas />
                </button>
            )}
        </div>
    );
}

export default ChatAgent;
