import z from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable().optional(),
  email: z.string().email(),
  image: z.string().nullable().optional(),
})