import { Button } from "@/components/ui/button";

import { Room} from "@/db/schema";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GithubIcon } from "lucide-react";
import { getRooms } from "@/data-access/rooms";
import TagList from "@/components/ui/tag-list";
import { SearchBar } from "./search-bar";
import { tagSplit } from "@/lib/utils";




function CardRoom({ room }: { room: Room }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
      <TagList tags={ tagSplit(room.tags)}/>
        <Link href={room.githubRepo || ''} className="flex items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"><GithubIcon/> Github Project</Link>
      </CardContent>
      <CardFooter className="flex justify-items-center">
        <Button asChild>
          <Link href={`/rooms/${room.id}`}>Join Room
          </Link></Button>
      </CardFooter>
    </Card>
  );
}
export default async function Home({searchParams}: {
  searchParams: {
    search:string,
  }
}){

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
      return <CardRoom key={room.id} room={room}/>
    })}
    </div>
  </main>
)

}