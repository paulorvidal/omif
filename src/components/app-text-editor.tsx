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

type AppTextEditorProps = {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
};

type AppTextEditorItemProps = {
  editor: any;
  command: string;
  attributes?: any;
  icon: React.ReactElement;
};

function AppTextEditor({
  content = "",
  onChange,
  placeholder = "Comece a digitar...",
  editable = true,
  className,
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

          "[&>p]:text-sm",
          "[&>h1]:text-xl [&>h1]:font-semibold",
          "[&>h2]:text-lg [&>h2]:font-semibold",
          "[&>h3]:text-base [&>h3]:font-semibold",
        ),
      },
    },
  });

  if (!editor) return null;

  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
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
  );
}

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

export { AppTextEditor, type AppTextEditorProps };
