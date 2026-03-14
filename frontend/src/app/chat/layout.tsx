import Image from "next/image";
//import { useEffect, useState } from "react";
import { MessageCircle, Settings } from "lucide-react";
import { SquarePen, Sun, Moon, EllipsisVertical, Ellipsis } from "lucide-react"
import "./chat.css"

import Link from "next/link";
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {

  let sessions = ["01957f9c-8c9c-7d2a-9b7e-6f3d1a2c4e5f", "sid2", "sid3", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4", "sid4"]
  //let sessions = ["01957f9c-8c9c-7d2a-9b7e-6f3d1a2c4e5f", "sid2", "sid3"]
  return (
    <div className="flex max-h-screen">
      {/* Sidebar */}
      <aside className="w-92 bg-zinc-900 text-white p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-6">My App</h1>

        <nav className="flex flex-col gap-3">
          <a className="flex items-center gap-2 hover:bg-zinc-800 p-2 rounded">
            <SquarePen size={18} />
            New Chat
          </a>
        </nav>
        <div className="flex-1 min-h-0 overflow-y-auto mt-4">
          <h2 className="text-xl font-bold mb-4">Chats</h2>
          <div className="p-4 rounded flex flex-col">
            {
              sessions.map((ses, i) =>
                (<Link href={`/chat/${ses}`} key={i} className="p-4 block hover:bg-zinc-800 hover:rounded-4xl" >{ses}</Link>)
              )
            }
          </div>
        </div>
        <div className="p-4 h-[50px] flex flex-row">
          <img src="" alt="" />
          <span>User_name</span>
          <Ellipsis size={14} className="self-end justify-end" />
        </div>
      </aside>

      {/* Content */}
      <main className="flex flex-col w-full h-screen justify-end items-center">
        <h1 className="w-full h-[50px] bg-zinc-950 p-4 border-b border-zinc-500 text-2xl flex items-center justify-between">Header</h1>
        {children}
      </main>
    </div >
  );/* <section>{children}</section> */
} 