"use client"
import ChatInput from "../ChatInput"
import Message from "../Message";
import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"

export default function Home() {

    const params = useParams()
    const session_id = params.session
    const user = "u1"
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const wsRef = useRef(null)
    const bottomRef = useRef(null)

    console.log(params)

    useEffect(() => {
        const getMessages = async () => {
            let res = await fetch(`http://localhost:8000/sessions/${session_id}/messages`)
            res = await res.json()
            console.log(res.data)
            setMessages(res.data.reverse())
        }
        getMessages()
    }, [session_id])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/runs/${session_id}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.type === "message") {
                setMessages((prev) => {
                    let updated = [...prev]
                    let last = updated.length - 1
                    updated[last] = {
                        ...updated[last],
                        response: updated[last].response + data.content,
                        done: data.done
                    }
                    return updated
                })
                if (data.done) setLoading(false)
            }
            else if (data.type === "stopped") {
                setLoading(false)
            }
        }

        return (() => ws.close())
    }, [])

    async function handleSubmit(text: string) {
        setLoading(true)
        //console.log(text)
        const jstr = JSON.stringify({
            "user": user,
            "session_id": session_id,
            input: {
                prompt: text,
                image: "path_to_img"
            }
        })
        //console.log(jstr)
        const req = new Request("http://localhost:8000/sessions/run", {
            method: "POST",
            body: jstr,
            headers: {
                "content-type": "Application/Json"
            }
        })
        await fetch(req)
        setMessages((prev) => {
            let updated = [...prev]
            let last = {
                input: {
                    prompt: text,
                    image: "path_to_image"
                },
                response: "",
                done: false
            }
            console.log("adding new prompt", last)
            updated.push(last)
            return updated
        })

        let wsreq = JSON.stringify({
            type: "start",
            Run: {
                user: "u1",
                input: {
                    prompt: text,
                    image: "path_to_img"
                }
            },
        })
        wsRef.current.send(wsreq)
    }

    function handleStop() {
        let wsreq = JSON.stringify({
            type: "stop"
        })
        wsRef.current.send(wsreq)
        setLoading(false)
    }



    return (
        <>
            <div className="h-full w-[100%] overflow-auto flex flex-col pl-56 pr-56 no-scrollbar transition-all pt-6">
                {
                    messages.map((msg, i) => {
                        console.log(i === messages.length - 1 ? msg : "")
                        return (<Message
                            key={i}
                            prompt={msg["input"]["prompt"]}
                            response={msg["response"]}
                            done={msg["done"] == undefined ? true : msg["done"]}
                        />)
                    }
                    )
                }
                <div ref={bottomRef}></div>
            </div>
            <ChatInput onSubmit={handleSubmit} onStop={handleStop} loading={loading} />
            <div className="p-2 text-xs text-zinc-400">Ai responses may contain mistakes</div>
        </>
    );
}

