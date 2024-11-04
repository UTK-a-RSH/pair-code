import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRooms } from "@/data-access/rooms";
import { SearchBar } from "./search-bar";
import { RoomCard } from "./room-card";
import { unstable_noStore } from "next/cache";


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
    <h1 className="text-5xl font-sans">Find Your Pair</h1>
    <Button asChild><Link href='/create-room'>Create Room</Link></Button>
    </div>
    <div className="mb-12">
    <SearchBar/>
    </div>
    
    <div className="grid grid-cols-3 gap-4">
    {rooms.map((room) => {
      return <RoomCard key={room.id} room={room}/>
    })}
    </div>
  </main>
)

}