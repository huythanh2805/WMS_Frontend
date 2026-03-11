'use client';

import { DragHandle } from '@/components/data-table';
import * as React from 'react';

import {
  IconAlertCircle,
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconCircleDashed,
  IconClock,
  IconDotsVertical,
  IconEyeCheck,
  IconLoader2,
} from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Checkbox } from '@/components/ui/checkbox';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { userSchema } from '@/lib/user-schame';
import { TaskPriority, TaskStatus } from '@/enums';
import { formatLocalDate } from '@/utils/format-date';

export const taskSchemaColumns = z.object({
  id: z.string(),
  header: z.string(),
  position: z.number(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(TaskPriority),
  status: z.enum(TaskStatus),
  startDate: z.date(),
  dueDate: z.date(),
  assignedTo: userSchema,
});
export type TaskColumn = z.infer<typeof taskSchemaColumns>;
export const taskColumns: ColumnDef<TaskColumn>[] = [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "header",
  //   header: "Header",
  //   cell: ({ row }) => {
  //     return row.original.header
  //   },
  //   enableHiding: false,
  // },
  {
    accessorKey: 'title',
    header: 'Header',
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.title}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status as TaskStatus;

      let icon: React.ReactNode = null;
      let badgeVariant: 'outline' | 'default' | 'secondary' | 'destructive' =
        'outline';
      let textColor = 'text-muted-foreground';
      let bgColor = ''; // chỉ dùng khi cần nền nhẹ

      switch (status) {
        case TaskStatus.BACKLOG:
          icon = (
            <IconClock className="size-3.5 fill-slate-400 dark:fill-slate-500" />
          );
          textColor = 'text-slate-700 dark:text-slate-300';
          badgeVariant = 'secondary';
          break;

        case TaskStatus.TODO:
          icon = (
            <IconCircleDashed className="size-3.5 fill-blue-400 dark:fill-blue-500" />
          );
          textColor = 'text-blue-700 dark:text-blue-300';
          break;

        case TaskStatus.IN_PROGRESS:
          icon = (
            <IconLoader2 className="size-3.5 animate-spin fill-yellow-500 dark:fill-yellow-400" />
          );
          textColor = 'text-yellow-800 dark:text-yellow-300';
          badgeVariant = 'secondary';
          break;

        case TaskStatus.IN_REVIEW:
          icon = <IconEyeCheck className="size-3.5" />;
          textColor = 'text-purple-700 dark:text-purple-300';
          badgeVariant = 'secondary';
          break;

        case TaskStatus.COMPLETED:
          icon = (
            <IconCircleCheckFilled className="size-3.5 fill-green-500 dark:fill-green-400" />
          );
          textColor = 'text-green-700 dark:text-green-300';
          badgeVariant = 'default';
          bgColor =
            'bg-green-50/80 dark:bg-green-950/30 border-green-200 dark:border-green-800';
          break;

        default:
          icon = <IconAlertCircle className="size-3.5 fill-gray-400" />;
      }

      return (
        <Badge
          variant={badgeVariant}
          className={`
          inline-flex items-center gap-1.5 
          px-2.5 py-0.5 text-xs font-medium
          capitalize
          ${textColor}
          ${bgColor}
        `}
        >
          {icon}
          {status.replace(/_/g, ' ')} {/* chuyển IN_PROGRESS → IN PROGRESS */}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.original.priority as TaskPriority;

      let badgeVariant: 'outline' | 'default' | 'secondary' | 'destructive' =
        'outline';
      let icon: React.ReactNode = null;
      let textColor = 'text-muted-foreground';

      switch (priority) {
        case TaskPriority.LOW:
          icon = (
            <IconCircleDashed className="fill-slate-400 dark:fill-slate-500 size-3.5" />
          );
          textColor = 'text-slate-700 dark:text-slate-300';
          badgeVariant = 'secondary';
          break;

        case TaskPriority.MEDIUM:
          icon = (
            <IconCircleCheckFilled className="fill-sky-500 dark:fill-sky-400 size-3.5" />
          );
          textColor = 'text-sky-700 dark:text-sky-300';
          badgeVariant = 'secondary';
          break;

        case TaskPriority.HIGH:
          icon = (
            <IconAlertTriangleFilled className="fill-amber-500 dark:fill-amber-400 size-3.5" />
          );
          textColor = 'text-amber-800 dark:text-amber-300';
          badgeVariant = 'secondary';
          break;

        case TaskPriority.CRITICAL:
          icon = (
            <IconAlertTriangleFilled className="fill-rose-600 dark:fill-rose-500 size-3.5" />
          );
          // hoặc IconXCircleFilled, IconFlameFilled nếu muốn mạnh hơn
          textColor = 'text-rose-700 dark:text-rose-300';
          badgeVariant = 'secondary';
          break;

        default:
          icon = <IconCircleDashed className="fill-gray-400 size-3.5" />;
      }

      return (
        <Badge
          variant={badgeVariant}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium ${textColor}`}
        >
          {icon}
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'startDate',
    header: 'StartDate',
    cell: ({ row }) => formatLocalDate(row.original.startDate),
  },
  {
    accessorKey: 'dueDate',
    header: 'dueDate',
    cell: ({ row }) => formatLocalDate(row.original.dueDate),
  },
  {
    accessorKey: 'assignedTo',
    header: 'assignedTo',
    cell: ({ row }) => row.original.assignedTo?.name ?? '-',
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const { onOpenUpdateDialogChange, onOpenDeleteDialogChange } = table
        .options.meta as {
        onOpenUpdateDialogChange: (open: boolean, taskId?: string) => void;
        onOpenDeleteDialogChange: (open: boolean, taskId?: string) => void;
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onOpenUpdateDialogChange?.(true, row.original.id);
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onOpenDeleteDialogChange?.(true, row.original.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
// export function TableCellViewer({ item }: {item: z.infer<typeof schema>}) {
//   const isMobile = useIsMobile()

//   return (
//     <Drawer direction={isMobile ? "bottom" : "right"}>
//       <DrawerTrigger asChild>
//         <Button variant="link" className="text-foreground w-fit px-0 text-left">
//           {item.header}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader className="gap-1">
//           <DrawerTitle>{item.header}</DrawerTitle>
//           <DrawerDescription>
//             Showing total visitors for the last 6 months
//           </DrawerDescription>
//         </DrawerHeader>
//         <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
//           {!isMobile && (
//             <>
//               <ChartContainer config={chartConfig}>
//                 <AreaChart
//                   accessibilityLayer
//                   data={chartData}
//                   margin={{
//                     left: 0,
//                     right: 10,
//                   }}
//                 >
//                   <CartesianGrid vertical={false} />
//                   <XAxis
//                     dataKey="month"
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={8}
//                     tickFormatter={(value) => value.slice(0, 3)}
//                     hide
//                   />
//                   <ChartTooltip
//                     cursor={false}
//                     content={<ChartTooltipContent indicator="dot" />}
//                   />
//                   <Area
//                     dataKey="mobile"
//                     type="natural"
//                     fill="var(--color-mobile)"
//                     fillOpacity={0.6}
//                     stroke="var(--color-mobile)"
//                     stackId="a"
//                   />
//                   <Area
//                     dataKey="desktop"
//                     type="natural"
//                     fill="var(--color-desktop)"
//                     fillOpacity={0.4}
//                     stroke="var(--color-desktop)"
//                     stackId="a"
//                   />
//                 </AreaChart>
//               </ChartContainer>
//               <Separator />
//               <div className="grid gap-2">
//                 <div className="flex gap-2 leading-none font-medium">
//                   Trending up by 5.2% this month{" "}
//                   <IconTrendingUp className="size-4" />
//                 </div>
//                 <div className="text-muted-foreground">
//                   Showing total visitors for the last 6 months. This is just
//                   some random text to test the layout. It spans multiple lines
//                   and should wrap around.
//                 </div>
//               </div>
//               <Separator />
//             </>
//           )}
//           <form className="flex flex-col gap-4">
//             <div className="flex flex-col gap-3">
//               <Label htmlFor="header">Header</Label>
//               <Input id="header" defaultValue={item.header} />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="type">Type</Label>
//                 <Select defaultValue={item.type}>
//                   <SelectTrigger id="type" className="w-full">
//                     <SelectValue placeholder="Select a type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Table of Contents">
//                       Table of Contents
//                     </SelectItem>
//                     <SelectItem value="Executive Summary">
//                       Executive Summary
//                     </SelectItem>
//                     <SelectItem value="Technical Approach">
//                       Technical Approach
//                     </SelectItem>
//                     <SelectItem value="Design">Design</SelectItem>
//                     <SelectItem value="Capabilities">Capabilities</SelectItem>
//                     <SelectItem value="Focus Documents">
//                       Focus Documents
//                     </SelectItem>
//                     <SelectItem value="Narrative">Narrative</SelectItem>
//                     <SelectItem value="Cover Page">Cover Page</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="status">Status</Label>
//                 <Select defaultValue={item.status}>
//                   <SelectTrigger id="status" className="w-full">
//                     <SelectValue placeholder="Select a status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Done">Done</SelectItem>
//                     <SelectItem value="In Progress">In Progress</SelectItem>
//                     <SelectItem value="Not Started">Not Started</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="target">Target</Label>
//                 <Input id="target" defaultValue={item.target} />
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="limit">Limit</Label>
//                 <Input id="limit" defaultValue={item.limit} />
//               </div>
//             </div>
//             <div className="flex flex-col gap-3">
//               <Label htmlFor="reviewer">Reviewer</Label>
//               <Select defaultValue={item.reviewer}>
//                 <SelectTrigger id="reviewer" className="w-full">
//                   <SelectValue placeholder="Select a reviewer" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
//                   <SelectItem value="Jamik Tashpulatov">
//                     Jamik Tashpulatov
//                   </SelectItem>
//                   <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </form>
//         </div>
//         <DrawerFooter>
//           <Button>Submit</Button>
//           <DrawerClose asChild>
//             <Button variant="outline">Done</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   )
// }
