"use client";

import { useLLM } from "@/hook/useLLM";
import React from "react";
import { User, Bot } from "lucide-react";

interface Chat {
  role: "user" | "llm";
  message: string;
}

export default function Home() {
  const [message, setMessage] = React.useState("");
  const [chat, setChat] = React.useState<Chat[]>([]);
  const llm = useLLM();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChat((chat) => [...chat, { role: "user", message }]);
    setMessage("");

    llm.mutate(
      { prompt: message },
      {
        onSuccess: (data) => {
          setChat((chat) => [...chat, { role: "llm", message: data.message }]);
        },
        onError: () => {
          setChat((chat) => [
            ...chat,
            { role: "llm", message: "Something went wrong. Please try again." },
          ]);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-800 flex flex-col">
      <main className="flex-1 max-w-4xl w-full mx-auto py-10 px-4 flex flex-col gap-6 overflow-hidden">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">AI Chat Assistant</h1>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
          {chat.map(({ message, role }, index) => (
            <div key={index} className={flex items-start ${role === "user" ? "justify-end" : "justify-start"}}>
              {role === "llm" && (
                <div className="mr-2">
                  <Bot className="w-6 h-6 text-blue-500" />
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-lg max-w-[70%] shadow-md text-sm transition-all ${
                  role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                {message}
              </div>
              {role === "user" && (
                <div className="ml-2">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={onSubmit}
          className="sticky bottom-0 bg-white border-t border-gray-200 flex gap-3 items-center px-4 py-3 shadow-md rounded-t-xl"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
