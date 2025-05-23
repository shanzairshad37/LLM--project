"use client";

import { useLLM } from "@/hook/useLLM";
import React from "react";

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
    e.stopPropagation();

    setChat((chat) => [
      ...chat,
      {
        role: "user",
        message: message,
      },
    ]);

    llm.mutate(
      { prompt: message },
      {
        onSuccess: (data) => {
          setChat((chat) => [
            ...chat,
            {
              role: "llm",
              message: data.message,
            },
          ]);
        },
        onError: () => {
          setChat((chat) => [
            ...chat,
            {
              role: "llm",
              message: "Something went wrong",
            },
          ]);
        },
      }
    );
  };

  return (
    <div className="size-full bg-gradient-to-r from-indigo-200 to-yellow-100">
      <main className="min-h-screen flex flex-col max-w-7xl mx-auto py-10 px-4 gap-y-4 ">
        <section className="flex-1  p-4 ">
          <div className="max-h-[80vh] font-mono overflow-y-auto p-4 space-y-4">
            {chat.map(({ message, role }: Chat, index) =>
              role === "user" ? (
                <div key={index} className="flex w-full justify-end ">
                  <div className="bg-slate-100 rounded-xl">
                    <p className=" w-fit border py-2 px-4 rounded-lg shadow-lg border-slate-100 min-w-24 text-center bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
                      {message}
                    </p>
                  </div>
                </div>
              ) : role === "llm" ? (
                <div key={index} className="flex w-full justify-start">
                  <div className="bg-slate-100 rounded-xl">
                    <p className="w-fit border py-2 px-4 rounded-lg shadow-lg border-slate-100 min-w-24  bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">
                      {message}
                    </p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </section>
        <section className="font-mono">
          <form className="flex items-center justify-center gap-y-4 ">
            <input
              placeholder="What is the color of the sky?"
              className="p-1 bg-gradient-to-b from-rose-400 to-pink-600 text-white md:p-2 w-6/12 focus:border-r-0 active:border-r-0 outline-0 focus:outline-0 active:outline-0 border border-r-0 rounded-l-md  text-black"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={onSubmit}
              className="rounded-r p-1 md:p-2  cursor-pointer hover:bg-sky-600 hover:text-white hover:bg-gradient-to-b from-rose-400 to-pink-600 group"
            >
              <span className="text-xs bg-gradient-to-b from-rose-700 to-pink-800 bg-clip-text text-transparent group-hover:text-white">
                Prompt
              </span>
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
