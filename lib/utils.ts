import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function tagSplit(tags: string){
  return tags.split(",").map((tag) => tag.trim());
}
