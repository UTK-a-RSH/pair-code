import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import  GoogleProvider  from "next-auth/providers/google"; // Import GoogleProvider
import type { Adapter } from "next-auth/adapters";

const handler = NextAuth({
    adapter: DrizzleAdapter(db) as Adapter,
    providers: [    
        GoogleProvider({      
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
    ],
}); // Cast the object to AuthOptions

export { handler as GET, handler as POST }