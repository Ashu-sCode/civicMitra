// src/components/ReportPage/DescriptionInput.jsx
import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

const DescriptionInput = ({ description, setDescription, maxLength = 500 }) => {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setDescription((prev) => {
        const combined = prev + " " + transcript;
        return combined.length > maxLength
          ? combined.substring(0, maxLength)
          : combined;
      });
    };

    recognition.onerror = (err) => {
      console.error("Voice input error:", err);
      setListening(false);

      if (err.error === "not-allowed") {
        alert(
          "Microphone access denied. Please allow microphone permissions to use voice input."
        );
      } else if (err.error === "no-speech") {
        alert("No speech detected. Please try again.");
      }
    };

    recognitionRef.current = recognition;
  }, [setDescription, maxLength]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300">
      <label className="block text-gray-900 dark:text-gray-100 font-semibold mb-2 text-lg">
        Describe the Issue
      </label>

      <div className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide any additional details about the issue..."
          className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition resize-none"
          rows={5}
          maxLength={maxLength}
        />

        {supported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`absolute top-2 right-2 flex items-center gap-2 px-4 py-2 rounded-full border shadow-md text-sm font-medium transition-all duration-300
              ${
                listening
                  ? "bg-red-500 text-white border-red-600 animate-pulse"
                  : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
          >
            {listening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
            {listening ? "Listening..." : "Voice Input"}
          </button>
        )}
      </div>

      {/* Listening visual bar */}
      {listening && (
        <div className="mt-2 h-1 w-full bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
          <div className="h-full w-full bg-blue-500 dark:bg-blue-400 animate-pulse-fast"></div>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
        {description.length}/{maxLength} characters
      </p>

      {!supported && (
        <p className="text-red-500 text-sm mt-1">
          Voice input not supported on this browser.
        </p>
      )}

      <style>
        {`
          @keyframes pulse-fast {
            0%, 100% { transform: scaleX(0.95); opacity: 0.6; }
            50% { transform: scaleX(1); opacity: 1; }
          }
          .animate-pulse-fast { animation: pulse-fast 1s infinite ease-in-out; transform-origin: left; }
        `}
      </style>
    </div>
  );
};

export default DescriptionInput;
