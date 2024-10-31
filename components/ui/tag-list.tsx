import { Badge } from "./badge";

export function tagSplit(tags: string){
    return tags.split(",").map((tag) => tag.trim());
}


export default function TagList({tags} : {tags: string[]}){
    return (
        <div className="flex items-center flex-wrap">
        {tags.map((tag) => (
             <Badge className="w-fit" key={tag}>
             {tag}
           </Badge>
         ))}
         
        </div>
    )
}