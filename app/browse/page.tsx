import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRooms } from "@/data-access/rooms";
import { SearchBar } from "./search-bar";
import { RoomCard } from "./room-card";
import { unstable_noStore } from "next/cache";
import Image from "next/image";


export default async function Home({searchParams}: {
  searchParams: {
    search:string,
  }
}){
  unstable_noStore();
  const rooms = await getRooms(searchParams.search);


return (
  <main className="flex flex-col p-16">
   <div className="flex justify-between items-center space-x-4 mb-8">
    <h1 className="text-5xl font-sans">Explore Creative Rooms</h1>
    <Button asChild><Link href='/create-room'>Create Room</Link></Button>
    </div>
    <div className="mb-12">
    <SearchBar/>
    </div>
    
    <div className="grid grid-cols-3 gap-4">
    {rooms.map((room) => {
      return <RoomCard key={room.id} room={{ ...room, description: room.description ?? null, githubRepo: room.githubRepo ?? '' }}/>
    })}
    </div>

    {
      rooms.length === 0 && (
        <div className="text-center text-2xl mt-24">
          <Image src={'../not-found.svg'} height={200} width={200} alt="Not Found anything"/>
        </div>
      )
    }

   
  </main>
)

}