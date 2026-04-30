"use client"
import { SquarePen, Ellipsis, LogOut, Settings, PanelLeft } from "lucide-react"
import Link from "next/link";
import { Session } from "../types/datamodel"
import { useState, useEffect } from "react";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import { useRouter } from "next/navigation";


import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionOptions } from '@/src/app/api/Sessions/getSession'
import { mutateSessionOptions } from '@/src/app/api/Sessions/createSession'

export default function Sidebar() {

    const [sidebar, setSidebar] = useState<boolean>(true)
    const { user, error, isLoading } = useUser();
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data } = useSuspenseQuery(sessionOptions("0094b233-0110-407a-8219-11288be39d16"))
    const mutation = useMutation(mutateSessionOptions("0094b233-0110-407a-8219-11288be39d16", queryClient))

    //console.log("TanStackQuery : ", data)

    useEffect(() => {
        if (data.data !== undefined && data.data.length > 0) {
            [...data.data].sort((a: Session, b: Session) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            })
        }
    }, [data])


    async function handleCreateSession() {
        try {
            console.log("creating session")
            mutation.mutate()
            console.log("Tanstackquery:mutate sessions", mutation.data.data)
            router.push(`/chat/${mutation.data.data.id}`)
        } catch (error) {
            console.error("Mutation failed:", error);
        }
    }

    return (
        <>
            {/* Sidebar */}
            <aside className={`min-w-66 overflow-x-hidden p-4 flex flex-col bg-base-300 whitespace-nowrap ${sidebar ? "" : "max-w-[50px]"} max-sm:hidden`}>

                <button className="p-1 hover:cursor-e-resize hover:bg-base-300 hover:rounded min-w-[28px] max-w-[28px] outline-0" onClick={() => setSidebar(!sidebar)}>
                    <PanelLeft size={20} className="min-w-[20px] hover:bg-base-300" />
                </button>


                <nav className="flex flex-col gap-3">
                    <div onClick={() => handleCreateSession()} className={`flex items-center gap-2 rounded min-w-[28px] hover:bg-base-200 p-1 mt-4`}>
                        <SquarePen size={20} className="min-w-[20px]" />
                        <span className={`${sidebar ? "" : "hidden"}`}>New Chat</span>
                    </div>
                </nav>
                <div className={`flex-1 min-h-0 overflow-y-auto mt-4 overflow-x-clip ${sidebar ? "" : "invisible"} }`}>
                    <h2 className="text-lg font-bold">Chats</h2>
                    <div className="p-4 pt-0 pl-0 rounded flex flex-col">
                        {
                            data.data.map((ses: Session, i: Number) =>
                                (<Link href={`/chat/${ses.id}`} key={ses.id} className="font-base-content p-2 block hover:rounded hover:bg-base-200" >{ses.name}</Link>)
                            )
                        }
                    </div>
                </div>
                {/* User */}
                <div className="dropdown dropdown-top">
                    <div tabIndex={0} role="button" className={`btn bg-base-300 border-0 min-w-[28px] hover:bg-base-100 w-full mt-4 flex flex-row items-center justify-start p-4 ${sidebar ? "" : "pl-0"}`}>
                        <img src={user?.picture} alt="https://cdn.auth0.com/avatars/hr.png" className="min-h-[25px] min-w-[25px] h-[25px] w-[25px] rounded-full " />
                        <div>{sidebar ? user?.name : ""}</div>
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
            </aside ></>
    );
}