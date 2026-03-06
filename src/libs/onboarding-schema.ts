import { z } from 'zod';

export const step1Schema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),

  about: z.string().max(500, 'Giới thiệu không được quá 500 ký tự').optional(),

  industryType: z.string().min(1, 'Vui lòng chọn ngành nghề').optional(),

  roleType: z.string().min(1, 'Vui lòng chọn vai trò').optional(),

  country: z.string().min(1, 'Vui lòng chọn quốc gia').optional(),
});

export const step2Schema = z.object({
  workspaceName: z.string().min(5),
  description: z.string().optional(),
});

export const step3Schema = z.object({
  plan: z.enum(['basic', 'pro', 'enterprise']),
});

export const fullFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type FullFormData = z.infer<typeof fullFormSchema>;
