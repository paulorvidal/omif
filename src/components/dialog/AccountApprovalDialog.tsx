import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { Hourglass, X } from "lucide-react";
import { Button } from "../Button";

export interface AccountApprovalDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AccountApprovalDialog(props: AccountApprovalDialogProps) {
  const { open, onClose } = props;

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
            <Hourglass className="h-8 w-8 text-green-600" strokeWidth={2} />
          </div>

          <h1 className="text-xl font-bold text-zinc-900">
            Conta Pendente de Aprovação
          </h1>

          <p className="mt-2 max-w-xs text-sm text-zinc-500">
            Sua conta foi criada e está aguardando a aprovação de um coordenador
            ou administrador. Você será notificado por e-mail assim que seu
            acesso for liberado.
          </p>

          <div className="my-5 h-px w-full bg-zinc-200" />

          <div className="flex h-12 w-full items-center justify-center">
            <Button onClick={onClose} className="h-12 w-full text-base">
              Entendi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
