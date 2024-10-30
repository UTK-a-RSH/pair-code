'use server';

import { db } from "@/db";
import { Room, room } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createRoomAction(roomData: Omit<Room, "id" | "userId">){
    const session = await getSession();
    if(!session){
        throw new Error("You are not logged in currently!!");
    }
    await db.insert(room).values({...roomData, userId: session.user.id});

    revalidatePath('/');
}