import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { useState, useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import Placeholder from "@tiptap/extension-placeholder";
import { Label } from "./Label";

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const [, setUpdate] = useState(0);

  useEffect(() => {
    if (!editor) {
      return;
    }
    const forceUpdate = () => {
      setUpdate((update) => update + 1);
    };
    editor.on("update", forceUpdate);
    editor.on("selectionUpdate", forceUpdate);
    return () => {
      editor.off("update", forceUpdate);
      editor.off("selectionUpdate", forceUpdate);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-shrink-0 flex-col items-center gap-y-2 rounded-l-md rounded-r-none border-2 border-r-0 border-zinc-300 px-2 py-3">
      <button
        title="Negrito"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "rounded bg-zinc-300/50 p-1"
            : "rounded p-1 hover:bg-zinc-100"
        }
      >
        <Bold className="h-5 w-5" />
      </button>
      <button
        title="Itálico"
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "rounded bg-zinc-300/50 p-1"
            : "rounded p-1 hover:bg-zinc-100"
        }
      >
        <Italic className="h-5 w-5" />
      </button>
      <button
        title="Tachado"
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? "rounded bg-zinc-300/50 p-1"
            : "rounded p-1 hover:bg-zinc-100"
        }
      >
        <Strikethrough className="h-5 w-5" />
      </button>
      <button
        title="Código"
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={
          editor.isActive("code")
            ? "rounded bg-zinc-300/50 p-1"
            : "rounded p-1 hover:bg-zinc-100"
        }
      >
        <Code className="h-5 w-5" />
      </button>

      <div className="my-1 h-px w-full bg-zinc-200" />

      <button
        title="Título 1"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "rounded bg-zinc-300/50 p-1"
            : "rounded p-1 hover:bg-zinc-100"
        }
      >
        <Heading1 className="h-5 w-5" />
      </button>
      <button
        title="Título 2"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "rounded bg-zinc-300/50 p-1"
            : "rounded p-1 hover:bg-zinc-100"
        }
      >
        <Heading2 className="h-5 w-5" />
      </button>
      <button
        title="Título 3"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "rounded bg-zinc-300/50 p-1"
            : "rounded p-1 hover:bg-zinc-100"
        }
      >
        <Heading3 className="h-5 w-5" />
      </button>
    </div>
  );
};

interface TextEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  error?: string;
  placeholder?: string;
  label: string;
  name: string;
}

export const TextEditor = ({
  content,
  onUpdate,
  error,
  placeholder,
  label,
  name,
}: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: false,
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class:
            "text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer transition-colors",
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `w-full h-full p-4 outline-none whitespace-pre-wrap rounded-r-md rounded-l-none border-2 ${error ? "border-red-500 focus:border-red-500" : "border-zinc-300 focus:border-zinc-400"} `,
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const isSame = editor.getHTML() === content;
      if (!isSame) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <div className="flex [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]">
        <MenuBar editor={editor} />
        <div className="relative w-full">
          <EditorContent editor={editor} className="h-full" />
          {error && (
            <p className="absolute bottom-[-20px] left-1 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
