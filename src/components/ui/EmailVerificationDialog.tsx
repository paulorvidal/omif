import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { MailCheck, X } from "lucide-react";
import { Button } from "./Button";

export interface EmailVerificationDialogProps {
  open: boolean;
  email: string;
  isSending: boolean;
  onClose: () => void;
  onResend: (email: string) => void;
  countdown: number;
}

export function EmailVerificationDialog(props: EmailVerificationDialogProps) {
  const { open, email, isSending, onClose, onResend, countdown } = props;

  const handleResendClick = () => {
    onResend(email);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs">
      <DialogContent className="p-4">
        <div className="flex w-full justify-end">
          <IconButton
            aria-label="close"
            onClick={onClose}
            className="text-zinc-400 transition-colors hover:text-zinc-600"
          >
            <X size={24} />
          </IconButton>
        </div>

        <div className="flex flex-col items-center px-4 pb-6 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <MailCheck className="h-8 w-8 text-green-600" strokeWidth={2} />
          </div>

          <h1 className="text-xl font-bold text-zinc-900">
            Verifique seu E-mail
          </h1>

          <p className="mt-2 max-w-xs text-sm text-zinc-500">
            Enviamos um link de confirmação para
            <span className="mt-1 block font-semibold text-zinc-700">
              {email}
            </span>
          </p>

          <div className="my-5 h-px w-full bg-zinc-200" />

          <div className="flex h-12 w-full items-center justify-center">
            {countdown > 0 ? (
              <p className="text-sm text-zinc-500">
                Você pode reenviar o link em{" "}
                <span className="font-semibold text-zinc-700">
                  {countdown}s
                </span>
              </p>
            ) : (
              <Button
                onClick={handleResendClick}
                disabled={isSending}
                className="h-12 w-full text-base"
              >
                {isSending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reenviar Link"
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
