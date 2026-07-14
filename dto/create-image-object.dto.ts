import { KEYS } from "@/utils/keys";
import { z } from "zod";

export const createImageObjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine((file) => file.size <= KEYS.MAX_IMAGE_SIZE_IN_MB * 1024 * 1024, {
      message: "Image size must be less than 5MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      {
        message: "Image must be jpg, jpeg, png, or webp",
      },
    ),
});

export type CreateImageObjectDto = z.infer<typeof createImageObjectSchema>;
