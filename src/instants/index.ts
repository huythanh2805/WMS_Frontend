export enum AccessLevel {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  IN_REVIEW = 'IN_REVIEW',
  BACKLOG = 'BACKLOG',
}
export enum FileType {
  PDF = "PDF",
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
  VIDEO = "VIDEO",
  OTHER = "OTHER",
}
// Get color by enum
export const statusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
    case TaskStatus.BACKLOG:
      return 'bg-zinc-500 hover:bg-zinc-600';           // xám - chưa bắt đầu

    case TaskStatus.IN_PROGRESS:
      return 'bg-amber-500 hover:bg-amber-600';         // vàng - đang làm

    case TaskStatus.COMPLETED:
      return 'bg-emerald-500 hover:bg-emerald-600';     // xanh lá - hoàn thành

    case TaskStatus.IN_REVIEW:
      return 'bg-blue-500 hover:bg-blue-600';           // xanh dương - đang review

    default:
      return 'bg-zinc-400 hover:bg-zinc-500';           // fallback
  }
};

export const priorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.LOW:
      return 'bg-emerald-500 hover:bg-emerald-600';     // xanh lá - thấp

    case TaskPriority.MEDIUM:
      return 'bg-amber-500 hover:bg-amber-600';         // vàng - trung bình

    case TaskPriority.HIGH:
      return 'bg-red-500 hover:bg-red-600';             // đỏ - cao

    case TaskPriority.CRITICAL:
      return 'bg-rose-600 hover:bg-rose-700';           // đỏ đậm hơn - khẩn cấp

    default:
      return 'bg-zinc-400 hover:bg-zinc-500';           // fallback
  }
};