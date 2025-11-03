import { AppButton } from "@/components/app-button";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { Check, Hourglass } from "lucide-react";

export interface AccountApprovalDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AccountApprovalDialog(props: AccountApprovalDialogProps) {
  const { open, onClose } = props;

  return (
    <AppDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <div className="flex justify-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Hourglass className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <AppDialogTitle>Conta Pendente de Aprovação</AppDialogTitle>
      <AppDialogContent>
        <DialogDescription className="text-center">
          Sua conta foi criada e está aguardando a aprovação de um coordenador
          ou administrador. Você será notificado por e-mail assim que seu acesso
          for liberado.
        </DialogDescription>
      </AppDialogContent>
      <AppDialogFooter>
        <AppButton icon={<Check />} onClick={onClose}>
          Entendi
        </AppButton>
      </AppDialogFooter>
    </AppDialog>
  );
}
