import { db } from "@/db";
import { room } from "@/db/schema";

export default async function Home(){

const rooms = await db.query.room.findMany();

return (
  <main className="flex min-h-screen flex-col items-center justify-normal">
    {rooms.map((item) => {
      return <div key={item.id}>{item.name}</div>
    })}
  </main>
)

}