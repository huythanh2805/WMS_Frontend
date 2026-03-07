'use client';

import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react';
import { EditTaskDialog } from './edit-task-dialog';

interface Comment {
  id: number;
  user: string;
  text: string;
  time: string;
}

export default function EditTaskPage() {
  const [title, setTitle] = useState('TEST TASK');
  const [project] = useState('First PROJECT');
  const [assigned, setAssigned] = useState('Codewave');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('IN_PROGRESS');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('2025-02-21');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isTaskEditOpen, setIsTaskEditOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      // Link.configure({ openOnClick: false }),
    ],
    immediatelyRender: false,
    content: '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[320px]',
      },
    },
  });

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        user: 'You',
        text: newComment,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setNewComment('');
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
      dueDate,
      documentation: docHTML,
      comments,
    });
    alert('✅ Task saved! Check console for full data.');
  };

  // Status & Priority colors
  const statusColor =
    status === 'IN_PROGRESS'
      ? 'bg-amber-500'
      : status === 'DONE'
        ? 'bg-emerald-500'
        : 'bg-zinc-500';
  const priorityColor =
    priority === 'HIGH'
      ? 'bg-red-500'
      : priority === 'MEDIUM'
        ? 'bg-amber-500'
        : 'bg-emerald-500';
  const handleOnTaskEditOpen = (open: boolean) => {
    setIsTaskEditOpen(open);
  };
  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              F
            </div>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-bold bg-transparent border-b-2 border-transparent focus:border-blue-500 focus:outline-none w-full"
              />
              <div className="text-blue-600 font-medium mt-1">{project}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                C
              </div>
              <select
                value={assigned}
                onChange={(e) => setAssigned(e.target.value)}
                className="bg-transparent focus:outline-none font-medium"
              >
                <option value="Codewave">Codewave</option>
                <option value="John Doe">John Doe</option>
                <option value="Alice">Alice</option>
              </select>
            </div>

            <button
              onClick={() => handleOnTaskEditOpen(true)}
              className="flex items-center gap-2 bg-white text-zinc-700 px-5 py-2.5 rounded-2xl border hover:bg-zinc-100 transition"
            >
              <span className="text-xl">✏️</span>
              Edit Task
            </button>
            <EditTaskDialog
              open={isTaskEditOpen}
              onOpenChange={handleOnTaskEditOpen}
              taskId={null}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* MAIN CONTENT */}
          <div className="flex-1 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <h2 className="font-semibold text-lg mb-3">Description</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a short description..."
                className="w-full h-28 resize-y bg-zinc-50 border border-zinc-200 rounded-2xl p-4 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <h2 className="font-semibold text-lg mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Status */}
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl text-white font-medium ${statusColor}`}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl text-white font-medium ${priorityColor}`}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="text-xs text-zinc-500 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-2xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Documentation - Tiptap */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <h2 className="font-semibold text-lg mb-4">Documentation</h2>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 border-b pb-3 mb-3">
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded-xl hover:bg-zinc-100 ${editor?.isActive('bold') ? 'bg-zinc-200' : ''}`}
                >
                  <Bold size={20} />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-xl hover:bg-zinc-100 ${editor?.isActive('italic') ? 'bg-zinc-200' : ''}`}
                >
                  <Italic size={20} />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  className={`p-2 rounded-xl hover:bg-zinc-100 ${editor?.isActive('strike') ? 'bg-zinc-200' : ''}`}
                >
                  <Strikethrough size={20} />
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleCode().run()}
                  className={`p-2 rounded-xl hover:bg-zinc-100 ${editor?.isActive('code') ? 'bg-zinc-200' : ''}`}
                >
                  <Code size={20} />
                </button>

                <div className="w-px h-6 bg-zinc-200 mx-2 my-auto" />

                <button
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={`p-2 rounded-xl hover:bg-zinc-100 ${editor?.isActive('heading', { level: 1 }) ? 'bg-zinc-200' : ''}`}
                >
                  <Heading1 size={20} />
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={`p-2 rounded-xl hover:bg-zinc-100 ${editor?.isActive('heading', { level: 2 }) ? 'bg-zinc-200' : ''}`}
                >
                  <Heading2 size={20} />
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={`p-2 rounded-xl hover:bg-zinc-100 ${editor?.isActive('heading', { level: 3 }) ? 'bg-zinc-200' : ''}`}
                >
                  <Heading3 size={20} />
                </button>

                <div className="w-px h-6 bg-zinc-200 mx-2 my-auto" />

                <button
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  className={`p-2 rounded-xl hover:bg-zinc-100 ${editor?.isActive('bulletList') ? 'bg-zinc-200' : ''}`}
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  className={`p-2 rounded-xl hover:bg-zinc-100 ${editor?.isActive('orderedList') ? 'bg-zinc-200' : ''}`}
                >
                  <ListOrdered size={20} />
                </button>

                <button
                  onClick={() => {
                    const url = prompt('Enter URL');
                    if (url)
                      editor?.chain().focus().toggleLink({ href: url }).run();
                  }}
                  className={`p-2 rounded-xl hover:bg-zinc-100 ${editor?.isActive('link') ? 'bg-zinc-200' : ''}`}
                >
                  <LinkIcon size={20} />
                </button>

                <div className="flex-1" />

                <button
                  onClick={() => editor?.chain().focus().undo().run()}
                  className="p-2 rounded-xl hover:bg-zinc-100"
                >
                  <Undo size={20} />
                </button>
                <button
                  onClick={() => editor?.chain().focus().redo().run()}
                  className="p-2 rounded-xl hover:bg-zinc-100"
                >
                  <Redo size={20} />
                </button>
              </div>

              {/* Editor */}
              <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white">
                <div className="prose prose-sm max-w-none px-4 py-3">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-96 space-y-6">
            {/* Comments */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <h2 className="font-semibold text-lg mb-4">Comments</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                {comments.length === 0 && (
                  <p className="text-zinc-400 text-sm italic">
                    No comments yet
                  </p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="bg-zinc-50 rounded-2xl p-4">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span className="font-medium text-zinc-700">
                        {c.user}
                      </span>
                      <span>{c.time}</span>
                    </div>
                    <p className="text-sm">{c.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addComment()}
                  placeholder="Add a comment..."
                  className="flex-1 border border-zinc-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={addComment}
                  className="bg-zinc-900 text-white px-6 rounded-2xl font-medium hover:bg-black transition"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border">
              <h2 className="font-semibold text-lg mb-4">Attachments</h2>
              <div className="h-40 border border-dashed border-zinc-300 rounded-2xl flex flex-col items-center justify-center text-zinc-400">
                <p className="text-sm">No attachments found</p>
                <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                  + Add files
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end mt-10">
          <button
            onClick={handleSave}
            className="bg-zinc-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-semibold text-lg transition flex items-center gap-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
