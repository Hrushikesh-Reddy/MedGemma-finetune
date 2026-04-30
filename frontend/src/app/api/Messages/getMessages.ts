import { queryOptions } from '@tanstack/react-query'
//import { getAccessToken } from "@auth0/nextjs-auth0/client";


export const messageOptions = (session_id: string|null|undefined) => queryOptions({
  queryKey: ['message', session_id],
  queryFn: async () => {
    //const token = await getAccessToken();
    const response = await fetch(`http://localhost:8000/sessions/${session_id}/messages`/* ,
    {
        headers:{
        "Authorization" : `Bearer ${token}`
      }
    } */
    )

    return response.json()
  },
})