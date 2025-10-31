import type { ComponentProps } from "react";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "./app-dialog"; 
import { AppButton } from "./app-button";
import { Save, X } from "lucide-react";

type AppGenericDialogProps = {
  title: string;
  description?: string;
  onClose: () => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  submitText: string;
  cancelText: string;
} & ComponentProps<typeof AppDialog>;

function AppGenericDialog({
  title,
  description,
  onClose,
  onSubmit,
  submitText,
  cancelText,
  children,
  ...props
}: AppGenericDialogProps) {
  return (
    <AppDialog onSubmit={onSubmit} {...props}>
      <AppDialogTitle {...(description ? { description } : {})}>
        {title}
      </AppDialogTitle>
      <AppDialogContent>{children}</AppDialogContent>
      <AppDialogFooter>
        <AppButton variant="secondary" type="button" onClick={onClose}>
          <X />
          {cancelText}
        </AppButton>
        <AppButton type="submit">
          <Save />
          {submitText}
        </AppButton>
      </AppDialogFooter>
    </AppDialog>
  );
}

export { AppGenericDialog };
