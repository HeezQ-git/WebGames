import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      pid: string;
      name: string;
    } & DefaultSession["user"];
  }
}