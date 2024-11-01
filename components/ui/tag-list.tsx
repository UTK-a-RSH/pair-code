"use client";
import { useRouter } from "next/navigation";
import { Badge } from "./badge";



export default function TagList({tags} : {tags: string[]}){
    const router = useRouter();
    return (
        <div className="flex items-center flex-wrap">
        {tags.map((tag) => (
             <Badge 
             onClick={
                () => {
                    router.push(`/?search=${tag}`);
                }
             } className="w-fit cursor-pointer" key={tag} tabIndex={0} role="button">
             {tag}
           </Badge>
         ))}
         
        </div>
    )
}