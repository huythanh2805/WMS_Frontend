'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarWithFallbackProps {
  /**
   * URL của avatar (có thể là null/undefined nếu chưa có)
   */
  avatar?: string | null;

  /**
   * Tên người dùng (dùng để fallback nếu không có avatar)
   */
  name?: string | null;

  /**
   * Kích thước avatar (className của Avatar)
   * @default "h-10 w-10"
   */
  size?: string;

  /**
   * ClassName bổ sung cho Avatar
   */
  className?: string;
  /**
   * ClassName bổ sung cho FallBack Avatar
   */
  fallbackClassName?: string;
}

/**
 * Component hiển thị avatar với fallback tự động:
 * - Nếu có avatar → hiển thị ảnh
 * - Nếu không có hoặc ảnh lỗi → hiển thị 2 chữ cái đầu của name
 * - Nếu cả name cũng không có → hiển thị "U" (User)
 */
export function AvatarWithFallback({
  avatar,
  name,
  size = 'h-10 w-10',
  className,
  fallbackClassName,
}: AvatarWithFallbackProps) {
  // Tính fallback text: lấy 2 chữ cái đầu, uppercase
  const fallbackText = name
    ? name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'U';
  console.log({ avatar })
  return (
    <Avatar className={cn(size, className)}>
      {avatar && (
        <AvatarImage
          src={avatar}
          alt={name || 'Avatar'}
          onLoadingStatusChange={(status) => {
            console.log(status)
          }}
        />
      )}
      <AvatarFallback className={cn("text-xs font-medium", fallbackClassName)}>
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
}