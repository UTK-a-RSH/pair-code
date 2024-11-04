import { Button } from "@/components/ui/button";

import Link from "next/link";
import { getUserRooms } from "@/data-access/rooms";
import { UserRoomCard } from "./user-room-card";
import { unstable_noStore } from "next/cache";
import Image from "next/image";





export default async function YourRoomsPage(){
    unstable_noStore();

  const rooms = await getUserRooms();


return (
  <main className="flex flex-col p-16">
   <div className="flex justify-between items-center space-x-4 mb-8">
    <h1 className="text-5xl font-sans">Find Your Coding Pair</h1>
    <Button asChild><Link href='/create-room'>Create Room</Link></Button>
    </div>
   
    <div className="grid grid-cols-3 gap-4">
    {rooms.map((room) => {
      return <UserRoomCard key={room.id} room={room}/>
    })}
    </div>

    {
      rooms.length === 0 && (
        <div className="text-center text-2xl mt-24">
          <Image src={'../not-found.svg'} height={200} width={200} alt="Not Found anything" className="mx-auto"/>
          <h2 className="text-2xl">Create Your Own Room !!</h2>
        </div>
      )
    }
  </main>
)

}