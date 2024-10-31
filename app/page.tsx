import { Button } from "@/components/ui/button";

import { Room, room } from "@/db/schema";
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
import TagList, { tagSplit } from "@/components/ui/tag-list";




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
export default async function Home(){

  const rooms = await getRooms();


return (
  <main className="flex flex-col p-16">
   <div className="flex justify-between items-center space-x-4 mb-8">
    <h1 className="text-5xl font-sans">Find Your Pair</h1>
    <Button asChild><Link href='/create-room'>Create Room</Link></Button>
    </div>
    <div className="grid grid-cols-3 gap-4">
    {rooms.map((room) => {
      return <CardRoom key={room.id} room={room}/>
    })}
    </div>
  </main>
)

}