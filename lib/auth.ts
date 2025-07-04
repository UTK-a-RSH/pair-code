import { db } from "@/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { AuthOptions, DefaultSession } from "next-auth";
import { Adapter } from "next-auth/adapters";

declare module "next-auth" {
    interface Session extends DefaultSession {
      user: {
        id: string;
      } & DefaultSession["user"];
    }
  }

export const authConfig = {
    adapter: DrizzleAdapter(db) as Adapter,
    session: {
        strategy: "jwt",
      },
    providers: [    
        GoogleProvider({      
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
    ],
    callbacks: {
        async jwt({ token }) {
          const dbUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, token.email!),
          });
    
          if (!dbUser) {
            throw new Error("no user with email found");
          }
    
          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            picture: dbUser.image,
          };
        },
        async session({ token, session }) {
          if (token) {
           session.user = {
            id: token.id as string,
            name: token.name,
            email: token.email,
            image: token.picture
           }
          }
    
          return session;
        },
      },
} satisfies AuthOptions;

const { handlers, auth } = NextAuth(authConfig);

export const { GET, POST } = handlers;

export function getSession(){
    return auth();
}