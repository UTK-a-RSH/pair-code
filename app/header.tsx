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
import {DeleteIcon, LifeBuoyIcon, LogInIcon, LogOutIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
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
import { useState } from "react";
import { deleteAccountAction } from "./actions";
import { room } from "@/db/schema";
  


function AccountDropdown(){
    const session = useSession();
    const [open, setOpen] = useState(false);
    

    return (
        <>
        <AlertDialog open={open} onOpenChange={setOpen}>
          
            
          
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to permanently delete this account ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction  onClick={async () => {
                await deleteAccountAction();
                signOut({ callbackUrl: "/" });
              }}>Yes, Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
                
                        <DropdownMenuItem onClick={() => signOut({
                            callbackUrl: '/',
                        })}> <LogOutIcon className="mr-2"/> Sign Out </DropdownMenuItem>

                        <DropdownMenuSeparator>
                            <DropdownMenuItem  onClick={() => {
              setOpen(true);
            }}>
                                <DeleteIcon/> Delete Account
                            </DropdownMenuItem>
                        </DropdownMenuSeparator>
                        
                    
                
            </DropdownMenuContent>
            </DropdownMenu>
                        </>
    )
}
export function Header() {
    const session = useSession();
    const isLoggedIn = !!session.data;
    return (
        <header className="bg-gray-100 py-4 dark:bg-gray-900 w-full h-22 z-10 relative">
            <div className="flex justify-between items-center">
                <Link href='/' className="flex gap-2 items-center text-xl font-serif hover:underline">
                    <Image 
                    src="/codepair.png"
                    alt="pair of bees humming over my pc"
                    width="60"
                    height="60" />
                    CodePair
                </Link>

                <nav className=" flex gap-4">
                   {
                     isLoggedIn && (
                        <>
                        <Link className="hover:underline" href='/browse'>
                        BROWSE
                        </Link>



                        <Link className="hover:underline" href='/your-rooms'>
                        MY ROOMS
                        </Link>

                        </>
                     )
                   }
                </nav>
            
            <div className="flex flex-row-reverse items-center">
                
               
              { isLoggedIn && <AccountDropdown/>}

              {
                !isLoggedIn && 
                <Button onClick={() => signIn()} variant='link'> <LogInIcon/>Sign In </Button>
              }
                
                <ModeToggle />
                
            </div>
            </div>

           
        </header>
    );
}