// components/rich-text-toolbar.tsx
'use client';

import { type Editor } from '@tiptap/react';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextToolbarProps {
  editor: Editor | null;
  className?: string;
}

export function RichTextToolbar({ editor, className }: RichTextToolbarProps) {
  if (!editor) return null;

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {/* Text formatting */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-muted' : ''}
        title="Bold (Ctrl+B)"
      >
        <Bold size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-muted' : ''}
        title="Italic (Ctrl+I)"
      >
        <Italic size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-muted' : ''}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'bg-muted' : ''}
        title="Inline Code"
      >
        <Code size={18} />
      </Button>

      {/* Headings */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </Button>

      {/* Lists */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        title="Bullet List"
      >
        <List size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </Button>

      {/* Link */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('Enter URL', previousUrl || 'https://');
          if (url === null) return;

          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
          }

          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}
        className={editor.isActive('link') ? 'bg-muted' : ''}
        title="Insert Link"
      >
        <LinkIcon size={18} />
      </Button>

      {/* Spacer */}
      <div className="flex-1 min-w-[1px]" />

      {/* History */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={18} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo size={18} />
      </Button>
    </div>
  );
}