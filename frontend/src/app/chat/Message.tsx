import { Copy, Check, Ellipsis } from "lucide-react"
import RenderMarkdown from "../../Components/RenderMarkdown"
import { useState } from "react"

export default function Message({ prompt, response, image, done, loading }: { [key: string]: any }) {
    //console.log("Message Prompt -> ", prompt)
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await navigator.clipboard.writeText(response)
        setCopied(true)
        setTimeout(() => setCopied(false), 500)
    }

    return (
        <div className="flex flex-col m-0 p-0 pb-6">
            {image &&
                <img src={`http://localhost:8000/image/?Key=${encodeURIComponent(image)}`} alt="" className="self-end m-2 rounded-2xl" height={100} width={200} />}
            <div className="p-3 mb-6  rounded-3xl max-w-[80%] self-end bg-base-300 font-base-content">{prompt}</div>
            <div className="min-w-full self-start">
                {(response) ? < RenderMarkdown content={response} /> : <span className="p-2 ml-1 bg-base-content loading loading-dots loading-sm"></span>}
            </div>
            {done &&
                <div className=" mt-0 pt-0 flex flex-row gap-1">
                    <button>
                        {
                            copied ?
                                <Check size={34} className="p-2 pt-1 pb-1 ml-1 hover:rounded-[10px] hover:bg-base-300" />
                                :
                                <Copy size={34} className="p-2 pt-1 pb-1 ml-1  hover:rounded-[10px] hover:bg-base-300" onClick={handleCopy} />
                        }
                    </button>
                    <button>
                        <Ellipsis size={34} className="p-2 pt-1 pb-1  hover:rounded-[10px] hover:bg-base-300" />
                    </button>
                </div>}
        </div>
    );
}



