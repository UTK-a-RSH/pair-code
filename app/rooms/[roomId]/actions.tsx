"use server";
import { StreamChat } from 'stream-chat';
import { getSession } from "@/lib/auth";

export async function generateToken(){
    const session = await getSession();

    if(!session){
        throw new Error("No session found");
    }

const api_key = process.env.NEXT_PUBLIC_GET_STREAM_API!;
const api_secret = process.env.NEXT_PUBLIC_GET_STREAM_SECRET!;


const serverClient = StreamChat.getInstance( api_key, api_secret);
const token = serverClient.createToken(session.user.id);
return token;
}


