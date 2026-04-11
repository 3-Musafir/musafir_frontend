'use client';

import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: unknown;
}

type ToolbarAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'insertOrderedList'
  | 'insertUnorderedList'
  | 'outdent'
  | 'indent'
  | 'subscript'
  | 'superscript';

const headingOptions = [
  { label: 'Body', value: 'p' },
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
];

const toolbarButtons: Array<{ label: string; action: ToolbarAction }> = [
  { label: 'B', action: 'bold' },
  { label: 'I', action: 'italic' },
  { label: 'U', action: 'underline' },
  { label: '1.', action: 'insertOrderedList' },
  { label: '•', action: 'insertUnorderedList' },
  { label: '<', action: 'outdent' },
  { label: '>', action: 'indent' },
  { label: 'X2', action: 'subscript' },
  { label: 'X²', action: 'superscript' },
];

function applyCommand(command: ToolbarAction, value?: string) {
  document.execCommand(command, false, value);
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const currentHtml = editor.innerHTML === '<br>' ? '' : editor.innerHTML;
    if (currentHtml === value) return;
    isSyncingRef.current = true;
    editor.innerHTML = value || '';
    isSyncingRef.current = false;
  }, [value]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isFullscreen]);

  const emitChange = () => {
    const editor = editorRef.current;
    if (!editor || isSyncingRef.current) return;
    onChange(editor.innerHTML);
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const handleToolbarAction = (action: ToolbarAction) => {
    focusEditor();
    applyCommand(action);
    emitChange();
  };

  const handleHeadingChange = (block: string) => {
    focusEditor();
    document.execCommand('formatBlock', false, block === 'p' ? 'div' : block);
    emitChange();
  };

  const handleColorChange = (command: 'foreColor' | 'hiliteColor', color: string) => {
    focusEditor();
    document.execCommand(command, false, color);
    emitChange();
  };

  return (
    <>
      {isFullscreen && <div className="rte-backdrop" onClick={() => setIsFullscreen(false)} />}

      <div className={`rte-shell ${isFullscreen ? 'rte-fullscreen' : ''}`}>
        <div className="rte-toolbar">
          <select
            className="rte-select"
            defaultValue="p"
            onChange={(e) => handleHeadingChange(e.target.value)}
            aria-label="Text style"
          >
            {headingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {toolbarButtons.map((button) => (
            <button
              key={button.action}
              type="button"
              className="rte-button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleToolbarAction(button.action)}
              aria-label={button.action}
            >
              {button.label}
            </button>
          ))}

          <label className="rte-color">
            <span>A</span>
            <input
              type="color"
              aria-label="Text color"
              onChange={(e) => handleColorChange('foreColor', e.target.value)}
            />
          </label>

          <label className="rte-color">
            <span>Bg</span>
            <input
              type="color"
              aria-label="Highlight color"
              onChange={(e) => handleColorChange('hiliteColor', e.target.value)}
            />
          </label>

          <button
            type="button"
            className="rte-button rte-fullscreen-button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsFullscreen((prev) => !prev)}
          >
            {isFullscreen ? 'Exit' : 'Full'}
          </button>
        </div>

        <div
          ref={editorRef}
          className="rte-editor"
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onBlur={emitChange}
          data-placeholder={placeholder || 'Write here...'}
        />
      </div>

      <style jsx global>{`
        .rte-shell {
          position: relative;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
          background: #fff;
        }

        .rte-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .rte-button,
        .rte-select,
        .rte-color {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: #fff;
          color: #111827;
          font-size: 0.875rem;
        }

        .rte-button {
          min-width: 2.25rem;
          padding: 0.45rem 0.65rem;
          font-weight: 600;
        }

        .rte-fullscreen-button {
          margin-left: auto;
        }

        .rte-select {
          padding: 0.45rem 0.65rem;
        }

        .rte-color {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.5rem;
        }

        .rte-color input {
          width: 1.5rem;
          height: 1.5rem;
          border: 0;
          padding: 0;
          background: transparent;
        }

        .rte-editor {
          min-height: 12rem;
          padding: 1rem;
          outline: none;
          overflow-y: auto;
          line-height: 1.7;
          color: #111827;
        }

        .rte-editor:empty::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        .rte-editor h1,
        .rte-editor h2,
        .rte-editor h3 {
          font-weight: 700;
          margin: 0.75rem 0 0.35rem;
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

        .rte-editor p,
        .rte-editor div {
          margin: 0.35rem 0;
        }

        .rte-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(2px);
          z-index: 999;
        }

        .rte-fullscreen {
          position: fixed;
          inset: 5vh 4vw;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .rte-fullscreen .rte-editor {
          flex: 1;
          min-height: 0;
        }

        @media (max-width: 640px) {
          .rte-toolbar {
            gap: 0.4rem;
            padding: 0.6rem;
          }

          .rte-button,
          .rte-select,
          .rte-color {
            font-size: 0.8125rem;
          }

          .rte-fullscreen-button {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
}
