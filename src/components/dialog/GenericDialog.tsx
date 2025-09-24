import * as React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "../Button";
import type { Path, RegisterOptions } from "react-hook-form";

export interface FieldConfig<T extends object> {
  name: Path<T>;
  label: string;
  type: React.HTMLInputTypeAttribute;
  placeholder?: string;
  rules?: RegisterOptions;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export interface GenericDialogProps<T extends object> {
  open: boolean;
  title?: string;
  description?: string;
  initialValues: T;
  fields: FieldConfig<T>[];
  onClose: () => void;
  onApply: (values: T) => void;
}

export interface DialogFormProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  submitText?: string;
  cancelText?: string;
  children: React.ReactNode;
}

export function DialogForm(props: DialogFormProps) {
  const {
    open,
    title,
    description,
    onClose,
    onSubmit,
    submitText = "Aplicar",
    cancelText = "Cancelar",
    children,
  } = props;

  return (
    <Dialog
      disableScrollLock
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {description && <DialogContentText>{description}</DialogContentText>}
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {children}
          <DialogActions>
            <Button onClick={onClose} secondary type="button">
              {cancelText}
            </Button>
            <Button type="submit">{submitText}</Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
