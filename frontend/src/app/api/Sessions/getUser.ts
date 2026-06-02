import { queryOptions } from '@tanstack/react-query'
//import { getAccessToken } from "@auth0/nextjs-auth0/client";

export const userOptions = (auth0_sub: string|null|undefined, ready:boolean) => queryOptions({
  queryKey: ['user', auth0_sub],
  queryFn: async () => {
    //const token = await getAccessToken();
    const response = await fetch(`http://localhost:8000/users/${auth0_sub}`/* ,
      {
        headers:{
        "Authorization" : `Bearer ${token}`
      } 
    }*/
    )

    return response.json()
  },
})