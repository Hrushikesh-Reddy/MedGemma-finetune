import { mutationOptions, QueryClient } from '@tanstack/react-query'
//import { getAccessToken } from "@auth0/nextjs-auth0/client";

export const mutateSessionOptions = (user_id: string|null, queryClient:QueryClient) => mutationOptions({
  mutationKey: ['create_session'],
  mutationFn: async () => {
    //const token = await getAccessToken();
    const response = await fetch(`http://localhost:8000/sessions/create/${user_id}`,{
        method:"POST"/* ,
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