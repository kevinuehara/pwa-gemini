import { MicrophoneIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const getLastWord = (text: string) => {
  const words = text.trim().split(/\s+/);
  return words.length > 0 ? words[words.length - 1] : "";
};

function App() {
  const [messages, setMessages] = useState([
    { id: 1, type: "user", message: "Hello, bot!" },
    { id: 2, type: "bot", message: "Hello, how can I assist you?" },
  ]);

  const { transcript, listening, finalTranscript, resetTranscript } =
    useSpeechRecognition();

  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: "user",
        message: input,
      };
      setMessages([...messages, newMessage]);

      const response = await fetch(
        "https://web-production-a897.up.railway.app/gemini",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: input }),
        }
      );

      const data = await response.json();

      const botReply = {
        id: messages.length + 2,
        type: "bot",
        message: data.result,
      };
      setMessages((prevMessages) => [...prevMessages, botReply]);

      setInput("");
    }
  };

  const handleMicrophoneClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  useEffect(() => {
    setInput(transcript);
    const lastWord = getLastWord(transcript);
    if (lastWord === "finish" || lastWord === "terminei") {
      SpeechRecognition.stopListening();
      handleSend();
      resetTranscript();
    }
  }, [transcript, finalTranscript]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === "user" ? "justify-start" : "justify-end"
            } mb-2`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-4 bg-white border-t border-gray-300">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="w-full p-2 border border-gray-300 rounded-l-lg"
        />
        <button
          onClick={handleMicrophoneClick}
          className={`${
            listening ? "bg-gray-300" : "bg-gray-200"
          } p-4 w-16 text-gray-700 rounded-l-lg hover:bg-gray-300`}
        >
          <MicrophoneIcon className="h-6 w-6" />
        </button>
        <button
          onClick={handleSend}
          className="p-2 w-28 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
