import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Message {
    response: string;
    input: {
        prompt: string;
        image: File | string | null;
    };
    done: boolean | null;
}

export interface Input {
    prompt: string;
    image: File | null
}

export interface Response {
    message: string
    status: boolean
    data: any
}

export interface Session {
  id: string
  name: string
  user: string
  created_at: Timestamp
  updated_at: Timestamp
}

export interface Prompt {
     prompt: string
     image: File | null 
}