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
import { GithubIcon } from "lucide-react";
import TagList from "@/components/ui/tag-list";
import { tagSplit } from "@/lib/utils";




export function RoomCard({ room }: { room: Room }) {
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
