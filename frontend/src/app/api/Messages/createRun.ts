import { mutationOptions } from '@tanstack/react-query'
import { Input } from "@/app/types/datamodel"
//import { getAccessToken } from "@auth0/nextjs-auth0/client";

export const createRunOptions = mutationOptions({
  mutationKey: ['create_run'],
  mutationFn: async ({user_id, session_id, input}:{user_id: string|null, session_id: string|undefined, input: Input}) => {
    //const token = await getAccessToken();
    console.log(user_id, session_id, input)
    let upload_data = null;
    if(input.image){
        let res = await fetch(`http://localhost:8000/upload/?user_id=${user_id}&filename=${input.image.name}`)
        upload_data = await res.json()
        let ureq = await fetch(upload_data.url, {
                method: "PUT",
                body: input.image,
                headers: { "content-type": input.image.type }
            })
        console.log(ureq)
    }

        const req = new Request("http://localhost:8000/sessions/run", {
            method: "POST",
            headers: {
                "content-type": "Application/Json",
                //"Authorization" : `Bearer ${token}`
            },
            body: JSON.stringify({
            "user_id": user_id,
            "session_id": session_id,
            input: {
                prompt: input.prompt,
                image: upload_data ? upload_data.Key : null
            }
        }),
        })
        let response = await fetch(req)
        return response.json();
  },
  onSuccess: ()=>{
  }
})