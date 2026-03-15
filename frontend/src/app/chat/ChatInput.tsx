"use client"
import Form from "next/form"
import { SendHorizontal, Plus, CircleStop } from "lucide-react"
import { useState } from "react"

export default function ChatInput({ onSubmit, onStop, loading }: { onSubmit: Function, onStop: Function, loading: boolean }) {

    //console.log(onSubmit)
    const [text, setText] = useState("");

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (text.trim() === "") return
        onSubmit(text)
        setText("")
    }

    function handleStop(e: React.MouseEvent) {
        e.preventDefault()
        onStop()
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && text.trim() !== "") {
            e.preventDefault()
            onSubmit(text)
            setText("")
        }
    }

    function handleAddFiles(e: React.MouseEvent) {
        e.preventDefault()
    }

    return (
        <Form onSubmit={(e) => handleSubmit(e)} action="" className=" bg-amber-50 rounded w-[65%] flex flex-col m-2 mb-0" >
            <textarea onKeyDown={(e) => handleKeyDown(e)} value={text} onChange={(e) => setText(e.target.value)} className="input-text  text-gray-800 text-wrap outline-0 p-2 m-2 resize-none" />
            <div className="flex flex-row justify-between pt-0 mt-0 p-2 m-2">
                <button onClick={e => handleAddFiles(e)}>
                    <Plus className="text-black hover:bg-amber-100 hover:rounded-full transition-all" />
                </button>
                {!loading ?
                    <button type="submit" className="" >
                        <SendHorizontal className="text-black hover:bg-amber-100 hover:rounded-full transition-all" />
                    </button>
                    :
                    <button onClick={e => handleStop(e)} className="">
                        <CircleStop className="text-black hover:bg-amber-100 hover:rounded-full transition-all" />
                    </button>
                }
            </div>
        </ Form >
    );
}