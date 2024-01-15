"use server";
import * as hashnode from "@/bin/hashnode";

export const getPosts = async (after?: string) => {
  return hashnode.getPosts(after);
};
