import z from "zod";

export const taskSchame = z.object({
  title: z.string().min(1, "Task name is required"),
  assignee: z.string().min(1, "Please select an assignee"),
  priority: z.string().min(1),
  startDate: z.date(),
  dueDate: z.date(),
  status: z.string().min(1),
  description: z.string().optional(),
});