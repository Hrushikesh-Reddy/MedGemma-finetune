"use client"
import { useEffect, useState } from "react";
import { SquarePen, Sun, Moon, Ellipsis, LogOut, Settings, PanelLeft } from "lucide-react"
import Link from "next/link";
import "./chat.css"
import SessionContext from "./context"
import { Response, Session } from "../types/datamodel"



export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [sidebar, setSidebar] = useState<boolean>(true)
  const [isDark, setIsDark] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])
  const user = "u1"

  useEffect(() => {
    const getSessions = async () => {
      let res = await fetch(`http://localhost:8000/sessions/${user}`)
      let data = await res.json()
      data = data.data
      data.sort((a: Session, b: Session) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      })
      setSessions(data)
    }
    getSessions()
  }, [])

  return (
    <div className="flex max-h-screen" data-theme={`${isDark ? "halloween" : "wireframe"}`}>
      {/* Sidebar */}
      <aside className={`max-w-66 overflow-x-hidden p-4 flex flex-col bg-base-300 whitespace-nowrap ${sidebar ? "" : "max-w-[50px]"} max-sm:hidden`}>

        <button className="p-1 hover:cursor-e-resize hover:bg-base-300 hover:rounded min-w-[28px] max-w-[28px] outline-0" onClick={() => setSidebar(!sidebar)}>
          <PanelLeft size={20} className="min-w-[20px] hover:bg-base-300" />
        </button>


        <nav className="flex flex-col gap-3">
          <a href="/chat" className={`flex items-center gap-2 rounded min-w-[28px] hover:bg-base-200 p-1 mt-4`}>
            <SquarePen size={20} className="min-w-[20px]" />
            <span className={`${sidebar ? "" : "hidden"}`}>New Chat</span>
          </a>
        </nav>
        <div className={`flex-1 min-h-0 overflow-y-auto mt-4 overflow-x-clip ${sidebar ? "" : "invisible"} }`}>
          <h2 className="text-lg font-bold">Chats</h2>
          <div className="p-4 pt-0 pl-0 rounded flex flex-col">
            {
              sessions.map((ses, i) =>
                (<Link href={`/chat/${ses.id}`} key={ses.id} className="font-base-content p-2 block hover:rounded hover:bg-base-200" >{ses.name}</Link>)
              )
            }
          </div>
        </div>
        {/* User */}
        <div className="dropdown dropdown-top">
          <div tabIndex={0} role="button" className={`btn bg-base-300 border-0 min-w-[28px] hover:bg-base-100 w-full mt-4 flex flex-row items-center justify-start p-4 ${sidebar ? "" : "pl-0"}`}>
            <img src="https://cdn.auth0.com/avatars/hr.png" alt="" className="min-h-[25px] min-w-[25px] h-[25px] w-[25px] rounded-full " />
            <div>{sidebar ? "Username" : ""}</div>
            <Ellipsis size={20} />
          </div>
          <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li><button>
              <Settings size={18} />
              Settings
            </button></li>
            <li><button>
              <LogOut size={18} />
              Log out
            </button></li>
          </ul>
        </div>
      </aside>

      {/* Content */}
      <main className="flex flex-col w-full h-screen justify-end items-center bg-base-200">
        <header className="sticky top-0 shadow-md w-full h-12.5  p-4 text-2xl flex items-center justify-between bg-base-200  ">
          <h1 className="">Header</h1>
          <button className="btn border-0 rounded-full hover:bg-base-100">
            {
              isDark ? <Sun size={25} color={"white"} onClick={e => setIsDark(!isDark)} />
                :
                <Moon size={25} onClick={e => setIsDark(!isDark)} />
            }
          </button>
        </header>
        <SessionContext.Provider value={{ setSessions }}>
          {children}
        </SessionContext.Provider>
      </main>
    </div >
  );/* <section>{children}</section> */
} 