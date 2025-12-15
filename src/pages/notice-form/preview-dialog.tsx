import { AppButton } from "@/components/app-button";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type PreviewDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  htmlContent: string;
};

function PreviewDialog({
  open,
  onClose,
  title,
  htmlContent,
}: PreviewDialogProps) {
  return (
    <AppDialog
      className="sm:max-w-[calc(100%-2rem)] md:w-6xl"
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AppDialogTitle>{title}</AppDialogTitle>{/*  */}

      <AppDialogContent>
        <div
          className={cn(
            "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2x l mx-auto w-full focus:outline-none",
            "max-h-[70vh] overflow-y-auto p-4",

            "[&>h1]:text-xl [&>h1]:font-semibold",
            "[&>h2]:text-lg [&>h2]:font-semibold",
            "[&>h3]:text-lg [&>h3]:font-medium",
            "[&>a]:cursor-pointer [&>a]:text-sm [&>a]:font-medium [&>a]:text-blue-600 [&>a]:underline [&>a]:transition-colors [&>a]:hover:text-blue-800",
          )}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </AppDialogContent>

      <AppDialogFooter>
        <AppButton
          variant="secondary"
          type="button"
          onClick={onClose}
          icon={<X />}
        >
          Fechar
        </AppButton>
      </AppDialogFooter>
    </AppDialog>
  );
}

export { PreviewDialog };
