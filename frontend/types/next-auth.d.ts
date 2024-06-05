import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      pid: string;
      name: string;
      profanesAllowed: boolean;
    } & DefaultSession["user"];
  }
}