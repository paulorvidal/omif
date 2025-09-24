import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "../Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog
      disableScrollLock
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} secondary>
          Cancelar
        </Button>
        <Button onClick={onConfirm} autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
