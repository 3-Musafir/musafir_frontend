'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import Color from '@tiptap/extension-color';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: unknown;
}

const normalizeHtml = (html: string) => html.replace(/\s+/g, ' ').trim();

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: placeholder ?? 'Start writing...',
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rte-editor',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const editorHtml = normalizeHtml(editor.getHTML());
    const nextValue = normalizeHtml(value || '');

    if (editorHtml !== nextValue) {
      editor.commands.setContent(value || '', false);
    }
  }, [editor, value]);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isFullscreen]);

  const toolbarButtonClass = (active = false) =>
    `rte-button ${active ? 'rte-button-active' : ''}`;

  return (
    <>
      {isFullscreen && <div className='rte-backdrop' />}
      <div
        ref={containerRef}
        className={`rte-wrapper ${isFullscreen ? 'rte-fullscreen' : ''}`}
      >
        <div className='rte-toolbar'>
          <button
            type='button'
            className={toolbarButtonClass(editor?.isActive('bold'))}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            B
          </button>
          <button
            type='button'
            className={toolbarButtonClass(editor?.isActive('italic'))}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            I
          </button>
          <button
            type='button'
            className={toolbarButtonClass(editor?.isActive('underline'))}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            U
          </button>
          <button
            type='button'
            className={toolbarButtonClass(editor?.isActive('heading', { level: 1 }))}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </button>
          <button
            type='button'
            className={toolbarButtonClass(editor?.isActive('heading', { level: 2 }))}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </button>
          <button
            type='button'
            className={toolbarButtonClass(editor?.isActive('bulletList'))}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            • List
          </button>
          <button
            type='button'
            className={toolbarButtonClass(editor?.isActive('orderedList'))}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </button>
          <button
            type='button'
            className='rte-button'
            onClick={() => editor?.chain().focus().undo().run()}
          >
            Undo
          </button>
          <button
            type='button'
            className='rte-button'
            onClick={() => editor?.chain().focus().redo().run()}
          >
            Redo
          </button>
          <button
            type='button'
            className='rte-button'
            onClick={() => setIsFullscreen((current) => !current)}
          >
            Fullscreen
          </button>
        </div>

        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .rte-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          z-index: 999;
        }

        .rte-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 160px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: #fff;
        }

        .rte-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .rte-button {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background: #fff;
          padding: 0.375rem 0.625rem;
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1;
          cursor: pointer;
        }

        .rte-button-active {
          border-color: #111827;
          background: #111827;
          color: #fff;
        }

        .rte-editor {
          min-height: 180px;
          padding: 1rem;
          outline: none;
        }

        .rte-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          float: left;
          height: 0;
        }

        .rte-editor h1,
        .rte-editor h2,
        .rte-editor h3 {
          margin: 1rem 0 0.5rem;
          font-weight: 700;
        }

        .rte-editor h1 {
          font-size: 1.5rem;
        }

        .rte-editor h2 {
          font-size: 1.25rem;
        }

        .rte-editor h3 {
          font-size: 1.125rem;
        }

        .rte-editor ul,
        .rte-editor ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }

        .rte-editor p {
          margin: 0.5rem 0;
        }

        .rte-fullscreen {
          position: fixed;
          top: 50%;
          left: 50%;
          z-index: 1000;
          width: 90vw;
          max-width: 1200px;
          height: 90vh;
          transform: translate(-50%, -50%);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .rte-fullscreen .rte-editor {
          height: 100%;
          min-height: 0;
          overflow-y: auto;
        }

        @media (max-width: 640px) {
          .rte-wrapper {
            min-height: 120px;
          }

          .rte-toolbar {
            gap: 0.375rem;
            padding: 0.625rem;
          }

          .rte-button {
            padding: 0.35rem 0.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
