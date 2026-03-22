"use client"
import ChatInput from "./ChatInput"
import { useSession } from "./context"
import { useRouter } from "next/navigation"
import { Session, Prompt } from "@/src/app/types/datamodel"

export default function Home() {

  const { setSessions } = useSession()
  const router = useRouter()
  const username = "u1";

  async function handleSubmit(prompt: Prompt) {
    let jstr = JSON.stringify({
      user: username,
      prompt: prompt.prompt
    })
    console.log(jstr)
    let res = await fetch(`http://localhost:8000/sessions/create`, {
      method: "POST",
      body: jstr,
      headers: { "Content-Type": "application/json" }
    })
    let data = await res.json();
    data = data.data
    setSessions((sessions: Session[]) => {
      let updates = [...sessions]
      updates.push(data)
      updates.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      })
      return updates
    })
    localStorage.setItem(data.id, JSON.stringify({ ...prompt }))
    router.push(`/chat/${data.id}`)
  }

  return (
    <>
      <div className="text-white text-2xl h-full">Placeholder</div>
      {/* <div className="h-full w-[100%] overflow-auto flex flex-col pl-50 pr-50 no-scrollbar">
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
      </div> */}
      <ChatInput onSubmit={handleSubmit} loading={false} onStop={() => { }} />
      <div className="p-2 text-xs text-zinc-400">Ai responses may contain mistakes</div>
    </>
  );
}

