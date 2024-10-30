"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import {LifeBuoyIcon, LogInIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
  


function AccountDropdown(){
    const session = useSession();
    const isLoggedIn = !!session.data;

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant={"link"}>
        <Avatar>
        <AvatarImage src={session.data?.user?.image ?? ""} />
        <AvatarFallback>CN</AvatarFallback>
        </Avatar>

            {session.data?.user?.name} 
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {
                    isLoggedIn ? (
                        <DropdownMenuItem onClick={() => signOut()}> <LogOutIcon className="mr-2"/> Sign Out </DropdownMenuItem>
                        
                    ) : (
                        <DropdownMenuItem  onClick={() => signIn("google")}><LogInIcon className="mr-2"/>Sign In </DropdownMenuItem>
                        
                    )
                }
            </DropdownMenuContent>
            </DropdownMenu>

    )
}
export function Header() {
    return (
        <header className="bg-gray-100 py-4 dark:bg-gray-900 w-full h-22">
            <div className="flex justify-between items-center">
                <Link href='/' className="flex gap-2 items-center text-xl font-serif hover:underline">
                    <Image 
                    src="/codepair.png"
                    alt="pair of bees humming over my pc"
                    width="60"
                    height="60" />
                    CodePair
                </Link>
            
            <div className="flex flex-row-reverse items-center gap-4">
                
               
                <AccountDropdown/>
                
                <ModeToggle />
                
            </div>
            </div>

           
        </header>
    );
}