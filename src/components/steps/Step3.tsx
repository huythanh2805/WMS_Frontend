import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

export default function Step3() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bước 3: Gói dịch vụ </h2>

      <FormItem>
        <FormLabel>Plan</FormLabel>
        <FormControl>
          <Input placeholder="0123456789" {...register('plan')} />
        </FormControl>
        <FormMessage>{errors.plan?.message as string}</FormMessage>
      </FormItem>
    </div>
  );
}
