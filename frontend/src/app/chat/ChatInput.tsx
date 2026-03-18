"use client"
import Form from "next/form"
import { SendHorizontal, Plus, CircleStop, Paperclip, X } from "lucide-react"
import { useState, useRef } from "react"
import { imageConfigDefault } from "next/dist/shared/lib/image-config"

export default function ChatInput({ onSubmit, onStop, loading }: { onSubmit: Function, onStop: Function, loading: boolean }) {

    //console.log(onSubmit)
    const [text, setText] = useState("");
    const FileInputRef = useRef<HTMLInputElement | null>(null)
    const [file, setFile] = useState<File | null | undefined>(null)
    const [fileUrl, setFileUrl] = useState<string | null>(null)

    function openFileExplorer() {
        FileInputRef.current?.click()
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()
        if (text.trim() === "") return
        onSubmit({ prompt: text, image: file ? file : null })
        setText("")
        if (file) {
            setFile(null)
            setFileUrl(null)
        }
    }

    function handleStop(e: React.MouseEvent) {
        onStop()
    }

    async function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && text.trim() !== "") {

            onSubmit({ prompt: text, image: file ? file : null })
            setText("")
            if (file) {
                setFile(null)
                setFileUrl(null)
            }
        }
    }

    function handleAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        //console.log(file)
        if (file)
            setFileUrl(URL.createObjectURL(file))
        setFile(file)

        e.target.value = ""
    }

    function removeFile() {
        setFile(null)
        setFileUrl(null)
    }

    return (
        <Form onSubmit={(e) => handleSubmit(e)} action="" className=" rounded w-[62%] flex flex-col m-2 mb-0 bg-base-100 shadow-md">
            {fileUrl &&
                <div className="relative h-40 w-40 m-2">
                    <img src={fileUrl} className="h-full w-full m-2 rounded-2xl"></img>
                    <button onClick={removeFile} className="rounded-full border-0 p-1 mt-4 bg-white absolute top-1 right-1"><X size={14} /></button>
                </div>
            }
            <textarea onKeyDown={(e) => handleKeyDown(e)} placeholder={"Ask anything"} value={text} onChange={(e) => setText(e.target.value)} className=" text-wrap outline-0 p-2 m-2 resize-none" />
            <div className="flex flex-row justify-between pt-0 mt-0 p-2 m-2">

                {/* Add files + */}
                <div className="dropdown dropdown-top p-0 m-0">
                    <div tabIndex={0} role="button" className="btn border-0 bg-base-100 hover:bg-base-200"><Plus className="hover:rounded-full transition-all" /></div>
                    <ul tabIndex={-1} className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
                        <li><button onClick={e => openFileExplorer()} >
                            <input type="file" className="hidden" ref={FileInputRef} onChange={e => handleAddFiles(e)} />
                            <Paperclip size={16} className="inline mr-2" />
                            Upload Image
                        </button></li>
                        <li><a>Item 2</a></li>
                    </ul>
                </div>
                {/* Send/Stop messages */}
                {!loading ?
                    <button type="submit" className="btn border-0 bg-base-100 hover:bg-base-200" >
                        <SendHorizontal className="" />
                    </button>
                    :
                    <button onClick={e => handleStop(e)} className="btn border-0 bg-base-100 hover:bg-base-200">
                        <CircleStop className="" />
                    </button>
                }
            </div>
        </ Form >
    );
}