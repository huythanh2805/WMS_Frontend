'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { EditTaskDialog } from './edit-task-dialog';

// shadcn/ui components
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/libs/utils'; // hàm cn của shadcn
import Link from '@tiptap/extension-link';
import { RichTextToolbar } from './tool-bar';
import { priorityColor, statusColor, TaskPriority, TaskStatus } from '@/instants';
import { useApi } from '@/hooks/use-api';
import { Comment, Task } from '@/types';
import { formatLocalDate } from '@/utils/format-date';
import { useUserStore } from '@/stores/user-store';

type TaskDetailProps = {
  taskId: string,
  projectId: string
}
export default function TaskDetail({ taskId, projectId }: TaskDetailProps) {
  const { loading, request } = useApi<Comment>()
  const { user } = useUserStore()
  const { loading: isFetchTaskLoading, request: isFetchTaskRequest } = useApi<Task>()
  const [title, setTitle] = useState('TEST TASK');
  const [project, setProject] = useState('First PROJECT');
  const [assigned, setAssigned] = useState('Codewave');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.IN_PROGRESS);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date('2025-02-21'));
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isTaskEditOpen, setIsTaskEditOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // optional: disable một số nếu không cần
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 underline' },
      }),
    ],
    immediatelyRender: false,
    content: '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[320px] prose prose-sm max-w-none',
      },
    },
  });
  const addComment = async () => {
    if (!newComment.trim()) return;
    if (!user?.id || !projectId || !taskId) return;
      await request({
        url: "/comment",
        method: "post",
        data: {
          content: newComment,
          taskId,
          projectId,
          userId: user?.id
        }
      }, {
        onSuccess: (data) => {
          if (data?.data) {
            setComments([
              ...comments,
              data.data
            ]);
          }
          setNewComment('');
        }
      })
  };

  const handleSave = () => {
    const docHTML = editor?.getHTML() || '';
    console.log('=== TASK SAVED ===');
    console.log({
      title,
      project,
      assigned,
      description,
      status,
      priority,
      dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
      documentation: docHTML,
      comments,
    });
    alert('✅ Task saved! Check console for full data.');
  };

  const handleOnTaskEditOpen = (open: boolean) => {
    setIsTaskEditOpen(open);
  };

  // Fetching task to edit
  const fetchTaskById = async () => {
    await isFetchTaskRequest({
      url: `/task/${taskId}`,
      method: 'get',
    }, {
      onSuccess: (data) => {
        const result = data?.data
        // Set state bằng optional chaining
        setTitle(result?.title ?? 'TEST TASK');
        setProject(result?.project?.name ?? result?.project ?? 'First PROJECT');
        setAssigned(result?.assignedTo?.name ?? 'Codewave');
        setDescription(result?.description ?? '');
        setStatus(result?.status ?? TaskStatus.IN_PROGRESS);
        setPriority(result?.priority ?? TaskPriority.MEDIUM);
        setDueDate(result?.dueDate ? new Date(result.dueDate) : undefined);
        setComments(result?.comments);

        // Nếu có documentation cho editor
        if (result?.documentation && editor) {
          editor.commands.setContent(result.documentation.content ?? '');
        }
      }
    });
  };
  useEffect(() => {
    if (!taskId || !projectId || !user) return;
    fetchTaskById();
  }, [taskId, projectId, user]);
  return (
    <div className="min-h-screen bg-zinc-50/40 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-sm">
              F
            </div>
            <div className="flex-1 min-w-0">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-bold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none h-auto"
                placeholder="Task title"
              />
              <div className="text-blue-600 font-medium mt-1">{project}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border shadow-sm">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                C
              </div>
              <Select value={assigned} onValueChange={setAssigned}>
                <SelectTrigger className="w-[160px] border-none shadow-none focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Codewave">Codewave</SelectItem>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Alice">Alice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => handleOnTaskEditOpen(true)}
              className="gap-2"
            >
              <span className="text-lg">✏️</span> Edit Task
            </Button>

            <EditTaskDialog
              open={isTaskEditOpen}
              onOpenChange={handleOnTaskEditOpen}
              taskId={taskId}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a short description..."
                  className="min-h-[120px] resize-y"
                />
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-xs text-muted-foreground">
                      Status
                    </Label>
                    <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
                      <SelectTrigger className={cn('text-white font-medium', statusColor(status))}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                        <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                        <SelectItem value={TaskStatus.BACKLOG}>Back Log</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-xs text-muted-foreground">
                      Priority
                    </Label>
                    <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                      <SelectTrigger className={cn('text-white font-medium', priorityColor(priority))}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                        <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                        <SelectItem value={TaskPriority.CRITICAL}>Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-xs text-muted-foreground">
                      Due Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !dueDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={setDueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentation - Tiptap (giữ nguyên) */}
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Toolbar */}
                <RichTextToolbar
                  editor={editor}
                  className="border-b pb-4 mb-4"
                />

                <div className="border rounded-lg overflow-hidden bg-white min-h-[320px]">
                  <div className="px-4 py-3">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
                  {comments.length === 0 && (
                    <p className="text-muted-foreground text-sm italic text-center py-8">
                      No comments yet
                    </p>
                  )}
                  {comments.map((c) => (
                    <div key={c.id} className="bg-muted/40 rounded-xl p-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span className="font-medium text-foreground">{c?.user?.name}</span>
                        <span>{formatLocalDate(c?.createdAt)}</span>
                      </div>
                      <p className="text-sm">{c?.content}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addComment())}
                    placeholder="Add a comment..."
                    className="flex-1"
                  />
                  <Button onClick={addComment}>Post</Button>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground">
                  <p className="text-sm">No attachments found</p>
                  <Button variant="link" className="mt-3 text-primary">
                    + Add files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={handleSave}
            size="lg"
            className="px-10 py-6 text-lg"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}