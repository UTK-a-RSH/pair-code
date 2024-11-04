"use client";
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
import { GithubIcon, PencilIcon, TrashIcon } from "lucide-react";
import TagList from "@/components/ui/tag-list";
import { tagSplit } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteRoomAction } from "./actions";





export function UserRoomCard({ room }: { room: Room }) {
  return (
    <Card>
      <CardHeader className="relative">
        <Button className="top-1 right-1 absolute"  size={"icon"}>
          <Link href={`/edit-room/${room.id}`}> 
          <PencilIcon />
          </Link>
        </Button>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
      <TagList tags={ tagSplit(room.tags)}/>
        <Link href={room.githubRepo || ''} className="flex items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"><GithubIcon/> Github Project</Link>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-4">
        <Button asChild>
          <Link href={`/rooms/${room.id}`}>Join Room
          </Link></Button>

          

          <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button  variant="destructive" >
              <TrashIcon className="w-4 h-4" /> Delete Room
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to permanently delete this room ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                deleteRoomAction(room.id);
              }}>Yes, Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
