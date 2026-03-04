import z from "zod";

export const taskSchame = z.object({
  taskName: z.string().min(1, "Task name is required"),
  assignee: z.string().min(1, "Please select an assignee"),
  priority: z.string().min(1),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  status: z.string().min(1),
  description: z.string().optional(),
});