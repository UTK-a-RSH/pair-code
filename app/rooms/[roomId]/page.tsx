import { getRoom } from "@/data-access/rooms";
import { GithubIcon } from 'lucide-react';
import Link from "next/link";
import TagList from "@/components/ui/tag-list";
import { PairVideo } from "./video-player";
import { tagSplit } from "@/lib/utils";
import { unstable_noStore } from "next/cache";

export default async function RoomPage(props: {params: {roomId: string}}){
  unstable_noStore();

  const roomId = props.params.roomId;
  const room = await getRoom(roomId);
   
  if(!room){
    return <div>OOPs!! No room of the current ID is found</div>
  }

  return(
    <div className="grid grid-cols-4 h-screen overflow-hidden">
      <div className="col-span-3 p-4 pr-2 flex flex-col">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex-grow overflow-auto">
          <PairVideo room={{ ...room, description: room.description ?? "", githubRepo: room.githubRepo ?? "" }} />
        </div>
      </div>
      <div className="col-span-1 p-4 pl-2 overflow-auto">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-4">
          <h1 className="text-base font-semibold">{room?.name}</h1>
          {room.githubRepo && (
            <Link
              href={room.githubRepo}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="w-5 h-5" /> Github Project
            </Link>
          )}
          <p className="text-base text-gray-600">{room?.description}</p>
          <TagList tags={tagSplit(room.tags)}/>
        </div>
      </div>
    </div>
  )
}

