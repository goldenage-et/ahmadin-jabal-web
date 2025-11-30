'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  className,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: mounted ? content : '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'focus:outline-none min-h-[200px] p-4 [&_p]:mb-4 [&_p]:leading-7 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_strong]:font-bold [&_em]:italic',
      },
    },
  });

  useEffect(() => {
    if (editor && mounted && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor, mounted]);

  if (!mounted || !editor) {
    return (
      <div className={cn('border rounded-md min-h-[200px]', className)}>
        <div className='flex items-center gap-1 p-2 border-b bg-muted/50'>
          <div className='h-8 w-8 bg-muted animate-pulse rounded' />
        </div>
        <div className='p-4'>
          <div className='h-4 bg-muted animate-pulse rounded w-3/4 mb-2' />
          <div className='h-4 bg-muted animate-pulse rounded w-1/2' />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border rounded-md', className)}>
      {/* Toolbar */}
      <div className='flex items-center gap-1 p-2 border-b bg-muted/50'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className='h-4 w-4' />
        </Button>
        <div className='h-6 w-px bg-border mx-1' />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
        >
          <Heading1 className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        >
          <Heading2 className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        >
          <Heading3 className='h-4 w-4' />
        </Button>
        <div className='h-6 w-px bg-border mx-1' />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-muted' : ''}
        >
          <Quote className='h-4 w-4' />
        </Button>
        <div className='h-6 w-px bg-border mx-1' />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className='h-4 w-4' />
        </Button>
      </div>
      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}


