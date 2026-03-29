'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const defaultModules = {
  toolbar: {
    container: [
      ['bold', 'italic', 'underline'],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ header: [1, 2, 3, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      ['clean'],
      ['fullscreen'],
    ],
  },
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: typeof defaultModules;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  modules,
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Register the fullscreen button handler once the toolbar is rendered
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const btn = container.querySelector('.ql-fullscreen');
    if (btn) {
      (btn as HTMLButtonElement).onclick = (e) => {
        e.preventDefault();
        toggleFullscreen();
      };
    }
  }, [toggleFullscreen]);

  // ESC key to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  // Click outside to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handleClick = (e: MouseEvent) => {
      const editorWrapper = containerRef.current?.querySelector('.ql-container');
      const toolbar = containerRef.current?.querySelector('.ql-toolbar');
      if (
        editorWrapper &&
        !editorWrapper.contains(e.target as Node) &&
        toolbar &&
        !toolbar.contains(e.target as Node)
      ) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isFullscreen]);

  return (
    <>
      {isFullscreen && (
        <div
          className="rte-backdrop"
          onClick={() => setIsFullscreen(false)}
        />
      )}
      <div
        ref={containerRef}
        className={`rte-wrapper ${isFullscreen ? 'rte-fullscreen' : ''}`}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules?.toolbar ? modules : defaultModules}
        />
      </div>

      <style jsx global>{`
        /* ── Base wrapper ── */
        .rte-wrapper {
          position: relative;
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          resize: vertical;
          min-height: 160px;
        }
        @media (max-width: 640px) {
          .rte-wrapper { min-height: 120px; }
        }

        .rte-wrapper .ql-toolbar {
          flex-wrap: wrap;
          overflow-x: auto;
        }

        .rte-wrapper .ql-container {
          min-height: 120px;
        }

        /* ── Fullscreen ── */
        .rte-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          z-index: 999;
        }

        .rte-fullscreen {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90vw;
          max-width: 1200px;
          height: 90vh;
          z-index: 1000;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          resize: none;
        }

        .rte-fullscreen .ql-toolbar {
          flex-shrink: 0;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }

        .rte-fullscreen .ql-container {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }

        /* ── Fullscreen button icon ── */
        .ql-fullscreen {
          position: relative;
          width: 28px;
          height: 24px;
        }
        .ql-fullscreen::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          border: 2px solid #444;
          border-radius: 2px;
          background: transparent;
        }
        .ql-fullscreen::before {
          content: '';
          position: absolute;
          top: 3px;
          right: 5px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 5px solid #444;
        }
      `}</style>
    </>
  );
}
