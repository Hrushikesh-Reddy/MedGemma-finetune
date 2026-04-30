import { queryOptions } from '@tanstack/react-query'
//import { getAccessToken } from "@auth0/nextjs-auth0/client";

export const sessionOptions = (user_id: string|null) => queryOptions({
  queryKey: ['session', user_id],
  queryFn: async () => {
    //const token = await getAccessToken();
    const response = await fetch(`http://localhost:8000/sessions/${user_id}`/* ,
      {
        headers:{
        "Authorization" : `Bearer ${token}`
      } 
    }*/
    )

    return response.json()
  },
})