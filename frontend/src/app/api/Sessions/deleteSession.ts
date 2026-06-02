import { mutationOptions, QueryClient } from '@tanstack/react-query'
//import { getAccessToken } from "@auth0/nextjs-auth0/client";

export const deleteSessionOptions = (session_id: string|null, queryClient:QueryClient) => mutationOptions({
  mutationKey: ['session'],
  mutationFn: async () => {
    //const token = await getAccessToken();
    console.log("Sending delete query for session : ", session_id)
    const response = await fetch(`http://localhost:8000/sessions/delete/${session_id}`,{
        method:"DELETE"/* ,
        headers:{
        "Authorization" : `Bearer ${token}`
      } */
    
    })

    return response.json()
  },
  onSuccess: ()=>{
    queryClient.invalidateQueries({queryKey:["session"]})
  }
})