"use client"
import Image from "next/image";
import ChatInput from "./ChatInput"
import Message from "./Message";
export default function Home() {
  let messages = [{ "prompt": "Hi, who are you ? ", "response": "Hello, I am an LLM", }, { "prompt": "Hi, who are you ? ", "response": "Hello, I am an LLM", "done": false },]

  return (
    <>
      {/* <div className="text-white text-2xl">Placeholder</div> */}
      <div className="h-full w-[100%] overflow-auto flex flex-col pl-50 pr-50 no-scrollbar">
        {
          messages.map((msg, i) =>
          (<Message
            key={i}
            prompt={msg["prompt"]}
            response={msg["response"]}
            done={msg["done"] == undefined ? true : msg["done"]}
          />)
          )
        }
      </div>
      <ChatInput />
      <div className="p-2 text-xs text-zinc-400">Ai responses may contain mistakes</div>
    </>
  );
}

