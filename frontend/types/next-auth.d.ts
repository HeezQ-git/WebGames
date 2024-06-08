import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      pid: string;
      name: string;
      settings: {
        profanesAllowed: boolean;
        wordListSortBy: "ALPHABETICAL" | 'LATEST_FIRST' | 'OLDEST_FIRST';
      }
    } & DefaultSession["user"];
  }
}