"use client"
import { useEffect, useState } from "react";
import { Sun, Moon, } from "lucide-react"
import "@/app/chat/chat.css"
import { useRouter } from "next/navigation"
import { getAccessToken } from "@auth0/nextjs-auth0/client";
import Sidebar from "./Sidebar";
import { auth0 } from "@/lib/auth0"

import { getQueryClient } from '@/app/api/get-query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { sessionOptions } from '@/src/app/api/Sessions/getSession'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {



  const [isDark, setIsDark] = useState(true)
  const router = useRouter()

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(sessionOptions("0094b233-0110-407a-8219-11288be39d16"))


  useEffect(() => {
    const setUserId = async () => {
      if (localStorage.getItem("user_id"))
        return;
      console.log(await getAccessToken())
      let res = await fetch(`http://localhost:8000/auth/user`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${await getAccessToken()}` },
      })
      let data = await res.json()
      console.log("Login-signup : ", data)
      localStorage.setItem("user_id", data.data[0].id)
    }
    setUserId()
  }, [])

  async function getUser() {

  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex max-h-screen" data-theme={`${isDark ? "halloween" : "wireframe"}`}>

        <Sidebar />


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
          {children}
        </main>
      </div >
    </HydrationBoundary>
  );
} 