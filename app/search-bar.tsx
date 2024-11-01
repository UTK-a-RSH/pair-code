"use client";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SearchIcon} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
    search: z.string().min(0).max(50),
  })




export function SearchBar(){
    const router = useRouter();
    const query = useSearchParams();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          search: query.get("search") ?? "",
        },
      })

      const search = query.get("search");
      useEffect(() => {
        form.setValue("search", search ?? "")
      }, [search, form])
      
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if(values.search){
            router.push(`/?search=${values.search}`);
        } else{
            router.push('/');
        }
  }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="w-[440px]" placeholder="Search Your Rooms by the tags" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

 <Button className="ml-4" type="submit"><SearchIcon/>Search</Button>

 {
    query.get("search") && (
    <Button variant="link" onClick={()=>{
        form.setValue("search", "");
        router.push('/');
    }}>Clear</Button> 
    )
 }
          </form>
        </Form>
    )
}