import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function Step2() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bước 2: Liên lạc</h2>

      <FormItem>
        <FormLabel>Tên dự án</FormLabel>
        <FormControl>
          <Input placeholder="Tên dự án của bạn" {...register("workspaceName")} />
        </FormControl>
        <FormMessage>{errors.workspaceName?.message as string}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Mô tả</FormLabel>
        <FormControl>
          <Input type="description" placeholder="Mô tả ngắn gọn về dự án" {...register("description")} />
        </FormControl>
        <FormMessage>{errors.description?.message as string}</FormMessage>
      </FormItem>
    </div>
  );
}