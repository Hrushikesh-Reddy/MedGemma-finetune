import { Copy, Check, Ellipsis } from "lucide-react"
import RenderMarkdown from "../../Components/RenderMarkdown"
import { useState } from "react"

export default function Message({ prompt, response, done }: { [key: string]: any }) {
    //console.log("Message Prompt -> ", prompt)
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await navigator.clipboard.writeText(response)
        setCopied(true)
        setTimeout(() => setCopied(false), 500)
    }

    return (
        <div className="flex flex-col m-0 p-0 pb-6">
            <div className="p-3 mb-6 bg-zinc-700 rounded-3xl max-w-[80%] self-end">{prompt}</div>
            <div className="max-w-[80%] self-start">
                < RenderMarkdown content={response} />
            </div>
            {done &&
                <div className=" mt-0 pt-0 flex flex-row gap-1">
                    <button>
                        {
                            copied ?
                                <Check size={34} className="p-2 text-white hover:rounded-[10px] hover:bg-zinc-700" />
                                :
                                <Copy size={34} className="p-2 text-white hover:rounded-[10px] hover:bg-zinc-700" onClick={handleCopy} />
                        }
                    </button>
                    <button>
                        <Ellipsis size={34} className="p-2 text-white hover:rounded-[10px] hover:bg-zinc-700" />
                    </button>
                </div>}
        </div>
    );
}



