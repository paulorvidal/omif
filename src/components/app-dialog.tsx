import type { ComponentProps, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

type AppDialogProps = {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
} & ComponentProps<typeof Dialog>;

type AppDialogTitleProps = { description?: ReactNode } & ComponentProps<
  typeof DialogTitle
>;

type AppDialogContentProps = {
  children: React.ReactNode;
};

type AppDialogFooterProps = {
  children: React.ReactNode;
};

function AppDialog({ onSubmit, children, ...props }: AppDialogProps) {
  if (onSubmit) {
    return (
      <Dialog {...props}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={onSubmit}>{children}</form>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Dialog {...props}>
        <DialogContent className="sm:max-w-[425px]">{children}</DialogContent>
      </Dialog>
    );
  }
}

function AppDialogTitle({
  children,
  description,
  ...props
}: AppDialogTitleProps) {
  return (
    <DialogHeader>
      <DialogTitle className="text-center" {...props}>
        {children}
      </DialogTitle>
      {description && (
        <DialogDescription className="text-center">
          {description}
        </DialogDescription>
      )}
    </DialogHeader>
  );
}

function AppDialogContent({ children }: AppDialogContentProps) {
  return <div className="grid gap-4 py-4">{children}</div>;
}

function AppDialogFooter({ children }: AppDialogFooterProps) {
  return <DialogFooter>{children}</DialogFooter>;
}

export { AppDialog, AppDialogTitle, AppDialogContent, AppDialogFooter };
