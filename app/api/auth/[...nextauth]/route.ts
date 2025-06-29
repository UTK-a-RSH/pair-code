import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

export async function GET(request: Request) {
  const handler = NextAuth(authConfig);
  return handler(request);
}

export async function POST(request: Request) {
  const handler = NextAuth(authConfig);
  return handler(request);
}