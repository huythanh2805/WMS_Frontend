import { useFormContext, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { countries, industryTypes, roleTypes } from "@/data"


export default function Step1() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bước 1: Thông tin cơ bản</h2>

      {/* Name */}
      <FormItem>
        <FormLabel>Tên</FormLabel>
        <FormControl>
          <Input placeholder="Nhập tên của bạn" {...register("name")} />
        </FormControl>
        <FormMessage>{errors.name?.message as string}</FormMessage>
      </FormItem>

      {/* About */}
      <FormItem>
        <FormLabel>Giới thiệu</FormLabel>
        <FormControl>
          <Textarea
            placeholder="Giới thiệu ngắn về bạn"
            {...register("about")}
          />
        </FormControl>
        <FormMessage>{errors.about?.message as string}</FormMessage>
      </FormItem>

      {/* Industry Type */}
      <FormItem>
        <FormLabel>Ngành nghề</FormLabel>
        <Controller
          control={control}
          name="industryType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngành nghề" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {industryTypes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormMessage>{errors.industryType?.message as string}</FormMessage>
      </FormItem>

      {/* Role Type */}
      <FormItem>
        <FormLabel>Vai trò</FormLabel>
        <Controller
          control={control}
          name="roleType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roleTypes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormMessage>{errors.roleType?.message as string}</FormMessage>
      </FormItem>

      {/* Country */}
      <FormItem>
        <FormLabel>Quốc gia</FormLabel>
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quốc gia" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <div className="flex items-center gap-2">
                      <img
                        src={c.flag}
                        alt={c.name}
                        className="w-5 h-4 object-cover"
                      />
                      {c.name} ({c.phoneCode})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormMessage>{errors.country?.message as string}</FormMessage>
      </FormItem>
    </div>
  )
}