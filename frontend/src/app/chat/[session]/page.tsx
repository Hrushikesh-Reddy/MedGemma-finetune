"use client"
import ChatInput from "../ChatInput"
import Message from "../Message";
import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { get_upload_url } from "./utils"

interface Message {
    response: string;
    input: {
        prompt: string;
        image: File | string | null;
    };
    done: boolean | null;
}

interface Input {
    prompt: string;
    image: File | null
}

export default function Home() {

    const params = useParams()
    const session_id = params.session
    const user = "u1"
    const user_id = 1
    const [messages, setMessages] = useState<Array<Message>>([])
    const [loading, setLoading] = useState(false)
    const wsRef = useRef<WebSocket | null>(null)
    const bottomRef = useRef<HTMLDivElement | null>(null)

    //console.log(params)

    useEffect(() => {
        const getMessages = async () => {
            let res = await fetch(`http://localhost:8000/sessions/${session_id}/messages`)
            let data = await res.json()
            data = data.data
            //console.log(data)
            setMessages(data.reverse())
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
            } else if (data.type === "Error") {
                setLoading(false)
            }
        }

        return (() => ws.close())
    }, [])

    async function handleSubmit(input: Input) {
        setLoading(true)
        //console.log(text)
        let upload_data = null;
        //console.log("image present ?", input.image)
        if (input.image) {
            upload_data = await get_upload_url(user_id, input?.image);
            let ureq = await fetch(upload_data.url, {
                method: "PUT",
                body: input.image,
                headers: { "content-type": input.image.type }
            })
            //console.log("Aws upload", ureq)
        }

        const jstr = JSON.stringify({
            "user": user,
            "session_id": session_id,
            input: {
                prompt: input.prompt,
                image: upload_data ? upload_data.Key : null
            }
        })
        //console.log(jstr)
        const req = new Request("http://localhost:8000/sessions/run/", {
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
                    prompt: input.prompt,
                    image: upload_data ? upload_data.Key : null
                },
                response: "",
                done: false
            }
            //console.log("adding new prompt", last)
            updated.push(last)
            return updated
        })

        let wsreq = JSON.stringify({
            type: "start",
            Run: {
                user: "u1",
                input: {
                    prompt: input.prompt,
                    image: upload_data ? upload_data.Key : null
                }
            },
        })
        wsRef.current?.send(wsreq)
    }

    function handleStop() {
        let wsreq = JSON.stringify({
            type: "stop"
        })
        wsRef.current?.send(wsreq)
        setLoading(false)
    }



    return (
        <>
            <div className="bg-base-200 h-full w-full overflow-auto flex flex-col sm:pl-8 md:pl-16 lg:pl-24 xl:pl-60 sm:pr-8 md:pr-16 lg:pr-24 xl:pr-60 no-scrollbar transition-all pt-6">
                {
                    messages.map((msg, i) => {
                        //console.log(i === messages.length - 1 ? msg : "")
                        return (<Message
                            key={i}
                            prompt={msg["input"]["prompt"]}
                            response={msg["response"]}
                            image={msg["input"]["image"]}
                            done={msg["done"] == undefined ? true : msg["done"]}
                            loading={loading}
                        />)
                    }
                    )
                }
                <div ref={bottomRef}></div>
            </div>
            <ChatInput onSubmit={handleSubmit} onStop={handleStop} loading={loading} />
            <div className="p-2 text-xs">Ai responses may contain mistakes</div>
        </>
    );
}

