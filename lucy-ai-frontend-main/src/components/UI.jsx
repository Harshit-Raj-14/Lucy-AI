import { useState, useRef } from "react";
import { useChat } from "../hooks/useChat";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };
  if (hidden) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
          <h1 className="font-black text-xl">Lucy AI</h1>
          <p>3D Virtual Assistant</p>
        </div>
        <div className="w-full flex flex-col items-end justify-center gap-4"></div>
        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
          <div className="relative">
            <button
              onClick={async () => {
                const videoElement = document.getElementById("cameraFeed");
                if (
                  videoElement.style.display === "none" ||
                  !videoElement.style.display
                ) {
                  try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                      video: true,
                    });
                    videoElement.srcObject = stream;
                    videoElement.style.display = "block";
                    videoElement.play();
                  } catch (error) {
                    console.error("Error accessing camera:", error);
                  }
                } else {
                  const stream = videoElement.srcObject;
                  if (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                  }
                  videoElement.srcObject = null;
                  videoElement.style.display = "none";
                }
              }}
              className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25-2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </button>

            {/* Inline Video Feed */}
            <video
              id="cameraFeed"
              className="fixed top-4 right-4 bg-black rounded-md shadow-lg w-48 h-36 z-50"
              style={{ display: "none" }}
              autoPlay
              playsInline
            />
          </div>

          <input
            className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
            placeholder="Type a message..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            disabled={loading || message}
            onClick={sendMessage}
            className={`bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${
              loading || message ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};
