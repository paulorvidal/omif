import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { AppButton } from "./app-button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FieldDescription } from "./ui/field";

type AppTextEditorProps = {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  error?: string;
};

type AppTextEditorItemProps = {
  editor: any;
  command: string;
  attributes?: any;
  icon: React.ReactElement;
};

function AppTextEditorItem({
  editor,
  command,
  attributes,
  icon,
}: AppTextEditorItemProps) {
  const getActive = () =>
    attributes
      ? editor.isActive(command, attributes)
      : editor.isActive(command);

  const [active, setActive] = useState<boolean>(getActive);

  useEffect(() => {
    if (!editor) return;

    const update = () => setActive(getActive());

    editor.on("transaction", update);
    editor.on("selectionUpdate", update);

    update();

    return () => {
      editor.off("transaction", update);
      editor.off("selectionUpdate", update);
    };
  }, [editor, command, JSON.stringify(attributes)]);

  const method = "toggle" + command.charAt(0).toUpperCase() + command.slice(1);

  const canRun = attributes
    ? editor.can().chain().focus()[method](attributes).run()
    : editor.can().chain().focus()[method]().run();

  const onClick = () => {
    if (!canRun) return;

    attributes
      ? editor.chain().focus()[method](attributes).run()
      : editor.chain().focus()[method]().run();
  };

  return (
    <AppButton
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon-sm"
      className="border-none"
      aria-pressed={active}
      onClick={onClick}
    >
      {icon}
    </AppButton>
  );
}

function AppTextEditor({
  content = "",
  onChange,
  placeholder = "Comece a digitar...",
  editable = true,
  className,
  error,
}: AppTextEditorProps) {
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
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2x l mx-auto focus:outline-none",
          "min-h-[200px] p-4 border-0",

          "[&>h1]:text-xl [&>h1]:font-semibold",
          "[&>h2]:text-lg [&>h2]:font-semibold",
          "[&>h3]:text-lg [&>h3]:font-medium",
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === content) {
      return;
    }

    editor.chain().setContent(content).run();
  }, [editor, content]);

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "bg-input/30 border-input overflow-hidden rounded-lg border",
          className,
        )}
      >
        <div className="flex flex-wrap items-center gap-1 border-b p-2">
          <AppTextEditorItem
            editor={editor}
            command="bold"
            icon={<Bold className="h-4 w-4" />}
          />
          <AppTextEditorItem
            editor={editor}
            command="italic"
            icon={<Italic className="h-4 w-4" />}
          />
          <AppTextEditorItem
            editor={editor}
            command="strike"
            icon={<Strikethrough className="h-4 w-4" />}
          />
          <AppTextEditorItem
            editor={editor}
            command="code"
            icon={<Code className="h-4 w-4" />}
          />
          <AppTextEditorItem
            editor={editor}
            command="heading"
            attributes={{ level: 1 }}
            icon={<Heading1 className="h-4 w-4" />}
          />
          <AppTextEditorItem
            editor={editor}
            command="heading"
            attributes={{ level: 2 }}
            icon={<Heading2 className="h-4 w-4" />}
          />
          <AppTextEditorItem
            editor={editor}
            command="heading"
            attributes={{ level: 3 }}
            icon={<Heading3 className="h-4 w-4" />}
          />
        </div>

        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {error && (
        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      )}
    </div>
  );
}

export { AppTextEditor, type AppTextEditorProps };
