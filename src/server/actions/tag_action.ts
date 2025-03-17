"use server";

import { revalidatePath } from "next/cache";
import tagService from "../services/tag_service";

export const createTag = async (name: string) => {
  const tag = await tagService.upsert({ name });
  revalidatePath("/");
  return tag;
};

export const getAllTags = async () => {
  const tag = await tagService.getAll();
  return tag;
};
