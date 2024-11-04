"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { editRoomAction } from "./actions"
import { useParams, useRouter } from "next/navigation"
import { Room } from "@/db/schema"

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(250),
  githubRepo : z.string().min(2).max(50),
  tags: z.string().min(2).max(50)
})


export function EditRoomForm({room}: {room: Room}){
  const params = useParams();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: room.name,
          description: room.description ?? "",
          githubRepo : room.githubRepo ?? "",
          tags : room.tags,
        },
      })

    async function onSubmit(values: z.infer<typeof formSchema>) {
            await editRoomAction({id: params.roomId as string,
              ...values,});
      }


      return (
        <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input placeholder="room name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public room name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="description" {...field} />
                  </FormControl>
                  <FormDescription>
                    Put in your coding purpose...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubRepo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github Repo</FormLabel>
                  <FormControl>
                    <Input placeholder="github repo" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please put the link of the github repository of the project you want to work on...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programming Language</FormLabel>
                  <FormControl>
                    <Input placeholder="programming language" {...field} />
                  </FormControl>
                  <FormDescription>
                    What is the programming langauge of your project ?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        </div>
      )
    
}