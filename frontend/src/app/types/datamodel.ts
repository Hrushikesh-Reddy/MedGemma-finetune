import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Message {
    input: {
        prompt: string;
        image: File | string | null;
    };
    response: string;
    status: "STARTED" | "COMPLETED" | "ERROR" | "STOPPED" | "INPROGRESS";
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
  user_id: string
  created_at: Timestamp
  updated_at: Timestamp
}